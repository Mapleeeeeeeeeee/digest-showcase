const CHECK_INTERVAL_MS = 15_000;
const REQUEST_TIMEOUT_MS = 5_000;

interface WatcherOptions {
  currentVersion: string;
  endpoint: string;
  window: Window;
  document: Document;
  fetch: typeof fetch;
}

function readVersion(value: unknown): string | undefined {
  if (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    typeof value.version === "string" &&
    value.version.trim().length > 0
  ) {
    return value.version;
  }
}

/** Watches while visible; pending updates wait until every media element stops. */
export function startVersionWatcher(options: WatcherOptions) {
  const { window, document, currentVersion, endpoint } = options;
  let inFlight = false;
  let pendingVersion: string | undefined;
  let navigating = false;
  let requestNumber = 0;
  let interval: number | undefined;
  let disposed = false;
  let activeRequest: AbortController | undefined;

  function applyPendingVersion() {
    if (!pendingVersion || navigating || document.visibilityState === "hidden")
      return;
    const hasPlayingMedia = Array.from(
      document.querySelectorAll("video, audio"),
    ).some((media) => {
      const element = media as HTMLMediaElement;
      return !element.paused && !element.ended;
    });
    if (hasPlayingMedia) return;
    const target = new URL(window.location.href);
    if (target.searchParams.get("__site_version") === pendingVersion) return;
    target.searchParams.set("__site_version", pendingVersion);
    navigating = true;
    window.location.replace(target.href);
  }

  async function check() {
    if (
      disposed ||
      inFlight ||
      navigating ||
      document.visibilityState === "hidden"
    )
      return;
    inFlight = true;
    const controller = new AbortController();
    activeRequest = controller;
    const timeout = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );
    const url = new URL(endpoint, window.location.href);
    url.searchParams.set("__check", `${Date.now()}-${++requestNumber}`);
    let value: unknown;
    try {
      const response = await options.fetch(url.href, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) return;
      value = await response.json();
    } catch (error: unknown) {
      if (
        error instanceof TypeError ||
        error instanceof SyntaxError ||
        (error instanceof DOMException && error.name === "AbortError")
      )
        return;
      throw error;
    } finally {
      window.clearTimeout(timeout);
      activeRequest = undefined;
      inFlight = false;
    }
    const latestVersion = readVersion(value);
    if (disposed || !latestVersion) return;
    pendingVersion =
      latestVersion !== currentVersion ? latestVersion : undefined;
    applyPendingVersion();
  }

  function resume() {
    if (interval !== undefined) window.clearInterval(interval);
    interval = undefined;
    if (document.visibilityState === "hidden") return;
    applyPendingVersion();
    void check();
    interval = window.setInterval(() => void check(), CHECK_INTERVAL_MS);
  }

  window.addEventListener("pageshow", resume);
  window.addEventListener("online", resume);
  document.addEventListener("visibilitychange", resume);
  document.addEventListener("pause", applyPendingVersion, true);
  document.addEventListener("ended", applyPendingVersion, true);
  resume();

  return {
    check,
    dispose() {
      disposed = true;
      activeRequest?.abort();
      if (interval !== undefined) window.clearInterval(interval);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("online", resume);
      document.removeEventListener("visibilitychange", resume);
      document.removeEventListener("pause", applyPendingVersion, true);
      document.removeEventListener("ended", applyPendingVersion, true);
    },
  };
}
