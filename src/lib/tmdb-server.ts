// Solo lato server: legge le variabili d'ambiente con la credenziale TMDB.
const TMDB_API_BASE = "https://api.themoviedb.org/3";

/**
 * Accetta entrambi i formati di credenziale TMDB:
 * - "API Key" v3 (32 caratteri esadecimali) → parametro `api_key`
 * - "API Read Access Token" v4 (JWT, inizia con "eyJ") → header `Authorization: Bearer`
 * Variabili lette: TMDB_API_KEY, oppure TMDB_READ_ACCESS_TOKEN.
 */
function getCredential(): string | null {
  const raw =
    process.env.TMDB_API_KEY?.trim() ||
    process.env.TMDB_READ_ACCESS_TOKEN?.trim() ||
    "";
  // Toglie eventuali virgolette o "Bearer " incollati per errore.
  const cleaned = raw.replace(/^["']|["']$/g, "").replace(/^Bearer\s+/i, "");
  return cleaned || null;
}

export const hasTmdbCredential = () => getCredential() !== null;

/** fetch verso TMDB con l'autenticazione giusta. Ritorna null se manca la credenziale. */
export async function tmdbFetch(
  path: string,
  params: Record<string, string> = {},
): Promise<Response | null> {
  const credential = getCredential();
  if (!credential) return null;

  const url = new URL(`${TMDB_API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (credential.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${credential}`;
  } else {
    url.searchParams.set("api_key", credential);
  }

  return fetch(url, { headers, next: { revalidate: 86400 } });
}
