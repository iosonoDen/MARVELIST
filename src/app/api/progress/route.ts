import { auth, clerkClient } from "@clerk/nextjs/server";
import { parseCloud } from "@/lib/progress-sync";

const KEY = "marvelist";

/** Progressi salvati nell'account dell'utente collegato. */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const stored = (user.privateMetadata?.[KEY] as { p?: unknown } | undefined)?.p;
  return Response.json({ progress: parseCloud(stored) ?? {} });
}

/** Sostituisce i progressi salvati nell'account. */
export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }
  const progress = parseCloud((body as { progress?: unknown })?.progress);
  if (!progress) return Response.json({ error: "invalid progress" }, { status: 400 });
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { [KEY]: { v: 1, p: progress } },
  });
  return Response.json({ ok: true });
}
