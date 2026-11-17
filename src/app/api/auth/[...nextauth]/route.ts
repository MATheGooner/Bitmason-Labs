import { authConfigured, handlers } from "@/server/auth/config";

export const runtime = "nodejs";

export const GET: typeof handlers.GET = async (request) => authConfigured()
  ? handlers.GET(request) : Response.json({ error: "Administrative access is not configured." }, { status: 503 });
export const POST: typeof handlers.POST = async (request) => authConfigured()
  ? handlers.POST(request) : Response.json({ error: "Administrative access is not configured." }, { status: 503 });
