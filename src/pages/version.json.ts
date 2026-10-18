import type { APIRoute } from "astro";
import { buildVersion } from "../lib/build-version";

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ version: buildVersion }), {
    headers: { "Content-Type": "application/json" },
  });
