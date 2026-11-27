/** Regole dell'username, uguali sul client e sul server. */
export const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
/** Giorni di attesa tra un cambio di username e il successivo. */
export const USERNAME_COOLDOWN_DAYS = 30;

export const cleanUsername = (raw: string) => raw.trim().replace(/^@/, "").toLowerCase();

/** Data dalla quale si può cambiare di nuovo l'username (null = subito). */
export function nextUsernameChange(changedAt: unknown, hasUsername: boolean): Date | null {
  if (!hasUsername || typeof changedAt !== "string") return null;
  const t = Date.parse(changedAt);
  if (Number.isNaN(t)) return null;
  const next = new Date(t + USERNAME_COOLDOWN_DAYS * 24 * 60 * 60 * 1000);
  return next.getTime() > Date.now() ? next : null;
}
