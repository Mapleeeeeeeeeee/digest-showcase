import assert from "node:assert/strict";
import test from "node:test";
import { startVersionWatcher } from "../src/lib/version-watcher.ts";

const settle = () => new Promise((resolve) => setImmediate(resolve));

function setup({
  value = { version: "A" },
  href = "https://example.org/digest/posts/story/?filter=all#clip",
  media = [],
  failure,
} = {}) {
  const window = new EventTarget();
  const document = new EventTarget();
  const navigations = [];
  const requests = [];
  const intervals = new Map();
  let timerId = 0;
  let now = 0;
  Object.assign(window, {
    location: { href, replace: (url) => navigations.push(url) },
    setTimeout,
    clearTimeout,
    setInterval: (callback, delay) => {
      intervals.set(++timerId, { callback, delay, nextAt: now + delay });
      return timerId;
    },
    clearInterval: (id) => intervals.delete(id),
  });
  Object.assign(document, {
    visibilityState: "visible",
    querySelectorAll: () => media,
  });
  let responseValue = value;
  const watcher = startVersionWatcher({
    window,
    document,
    currentVersion: "A",
    endpoint: "/digest/version.json",
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (failure) throw failure;
      return { ok: true, json: async () => responseValue };
    },
  });
  return {
    watcher,
    window,
    document,
    navigations,
    requests,
    intervals,
    async advance(milliseconds) {
      const end = now + milliseconds;
      while (true) {
        const next = Math.min(
          ...Array.from(intervals.values(), (timer) => timer.nextAt),
        );
        if (next > end) break;
        now = next;
        for (const timer of intervals.values()) {
          if (timer.nextAt === now) {
            timer.nextAt += timer.delay;
            timer.callback();
          }
        }
        await settle();
      }
      now = end;
    },
    setValue: (value) => {
      responseValue = value;
    },
  };
}

test("Given the same deployed version when checking then the page stays open", async () => {
  const state = setup();
  await settle();
  assert.deepEqual(state.navigations, []);
  assert.equal(state.requests[0].options.cache, "no-store");
  await state.watcher.check();
  assert.notEqual(state.requests[0].url, state.requests[1].url);
  state.watcher.dispose();
});

test("Given a new version when checking then navigation preserves route filters and hash", async () => {
  const state = setup({ value: { version: "B" } });
  await settle();
  assert.deepEqual(state.navigations, [
    "https://example.org/digest/posts/story/?filter=all&__site_version=B#clip",
  ]);
  state.watcher.dispose();
});

test("Given stale HTML at the target version URL when checking then it does not loop", async () => {
  const state = setup({
    value: { version: "B" },
    href: "https://example.org/?__site_version=B",
  });
  await settle();
  await state.watcher.check();
  assert.deepEqual(state.navigations, []);
  state.watcher.dispose();
});

for (const [name, options] of [
  ["offline", { failure: new TypeError("Failed to fetch") }],
  ["invalid JSON", { failure: new SyntaxError("Unexpected token") }],
  ["missing version", { value: {} }],
  ["blank version", { value: { version: " " } }],
  ["timeout", { failure: new DOMException("Aborted", "AbortError") }],
]) {
  test(`Given ${name} when checking then the page stays open`, async () => {
    const state = setup(options);
    await settle();
    assert.deepEqual(state.navigations, []);
    state.watcher.dispose();
  });
}

test("Given multiple playing media when a new version arrives then navigation waits for all to stop", async () => {
  const media = [
    { paused: false, ended: false },
    { paused: false, ended: false },
  ];
  const state = setup({ value: { version: "B" }, media });
  await settle();
  assert.deepEqual(state.navigations, []);
  media[0].paused = true;
  state.document.dispatchEvent(new Event("pause"));
  assert.deepEqual(state.navigations, []);
  media[1].ended = true;
  state.document.dispatchEvent(new Event("ended"));
  assert.equal(state.navigations.length, 1);
  state.watcher.dispose();
});

test("Given a hidden page when deploying then checks resume on return to foreground", async () => {
  const state = setup();
  await settle();
  state.document.visibilityState = "hidden";
  state.document.dispatchEvent(new Event("visibilitychange"));
  assert.equal(state.intervals.size, 0);
  state.setValue({ version: "B" });
  await state.watcher.check();
  assert.deepEqual(state.navigations, []);
  state.document.visibilityState = "visible";
  state.document.dispatchEvent(new Event("visibilitychange"));
  await settle();
  assert.equal(state.navigations.length, 1);
  state.watcher.dispose();
});

test("Given an unfinished check when another trigger fires then it waits for the outstanding result", async () => {
  const state = setup();
  await settle();
  let resolveResponse;
  // The fetch boundary remains deliberately pending while foreground events arrive.
  state.watcher.dispose();
  const requests = [];
  const watcher = startVersionWatcher({
    window: state.window,
    document: state.document,
    currentVersion: "A",
    endpoint: "/version.json",
    fetch: () => {
      requests.push("pending");
      return new Promise((resolve) => {
        resolveResponse = resolve;
      });
    },
  });
  state.window.dispatchEvent(new Event("online"));
  await watcher.check();
  assert.equal(requests.length, 1);
  resolveResponse({ ok: true, json: async () => ({ version: "B" }) });
  await settle();
  assert.equal(state.navigations.length, 1);
  watcher.dispose();
});

test("Given an unexpected error when checking then the error propagates", async () => {
  const state = setup();
  await settle();
  state.watcher.dispose();
  state.document.visibilityState = "hidden";
  const error = new Error("Unexpected failure");
  const watcher = startVersionWatcher({
    window: state.window,
    document: state.document,
    currentVersion: "A",
    endpoint: "/version.json",
    fetch: async () => {
      throw error;
    },
  });
  state.document.visibilityState = "visible";
  await assert.rejects(watcher.check(), (actual) => actual === error);
  watcher.dispose();
});

test("Given a foreground page when deployment changes then the 15 second check navigates without another event", async () => {
  const state = setup();
  try {
    await settle();
    state.setValue({ version: "B" });
    await state.advance(14_999);
    assert.deepEqual(state.navigations, []);
    await state.advance(1);
    assert.deepEqual(state.navigations, [
      "https://example.org/digest/posts/story/?filter=all&__site_version=B#clip",
    ]);
  } finally {
    state.watcher.dispose();
  }
});
