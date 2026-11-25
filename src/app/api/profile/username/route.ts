import { auth, clerkClient } from "@clerk/nextjs/server";
import { cleanUsername, nextUsernameChange, USERNAME_RE } from "@/lib/username";

async function isTaken(username: string, userId: string) {
  const client = await clerkClient();
  const { data } = await client.users.getUserList({ username: [username], limit: 2 });
  return data.some((u) => u.id !== userId);
}

/** Controlla se un username è libero: GET /api/profile/username?u=nome */
export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });
  const username = cleanUsername(new URL(request.url).searchParams.get("u") ?? "");
  if (!USERNAME_RE.test(username)) return Response.json({ valid: false, available: false });
  return Response.json({ valid: true, available: !(await isTaken(username, userId)) });
}

/** Imposta o cambia l'username: al massimo una volta ogni 30 giorni. */
export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }
  const username = cleanUsername(String((body as { username?: unknown })?.username ?? ""));
  if (!USERNAME_RE.test(username)) return Response.json({ error: "invalid" }, { status: 400 });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  if (user.username === username) return Response.json({ ok: true, username });

  const next = nextUsernameChange(user.publicMetadata?.usernameChangedAt, Boolean(user.username));
  if (next) return Response.json({ error: "too_soon", nextAt: next.toISOString() }, { status: 429 });
  if (await isTaken(username, userId)) return Response.json({ error: "taken" }, { status: 409 });

  try {
    await client.users.updateUser(userId, { username });
  } catch (err) {
    const code = (err as { errors?: Array<{ code?: string }> })?.errors?.[0]?.code;
    console.error("Username non aggiornato:", code ?? err);
    if (code === "form_identifier_exists") return Response.json({ error: "taken" }, { status: 409 });
    return Response.json({ error: "failed" }, { status: 502 });
  }
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { usernameChangedAt: new Date().toISOString() },
  });
  return Response.json({ ok: true, username });
}
