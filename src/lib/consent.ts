/** Scelta sui cookie: "all" attiva le statistiche anonime; "necessary" e "none" no. */
export type Consent = "all" | "necessary" | "none";

const KEY = "marvelist:cookie-consent:v1";
export const CONSENT_EVENT = "marvelist:consent-change";

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "all" || v === "necessary" || v === "none" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent | null) {
  try {
    if (value) window.localStorage.setItem(KEY, value);
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage non disponibile */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
