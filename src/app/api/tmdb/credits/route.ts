import { type NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb-server";

interface TMDBPerson {
  id: number;
  name: string;
  character?: string;
  roles?: Array<{ character: string }>;
  profile_path: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";
  const language = searchParams.get("lang") === "en" ? "en-US" : "it-IT";

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "Missing or invalid id parameter", cast: [] },
      { status: 400 },
    );
  }

  const path =
    type === "tv" ? `/tv/${id}/aggregate_credits` : `/movie/${id}/credits`;

  try {
    const res = await tmdbFetch(path, { language });

    if (!res) {
      console.error("Credenziale TMDB non configurata (TMDB_API_KEY)");
      return NextResponse.json(
        { error: "Cast service unavailable", cast: [] },
        { status: 503 },
      );
    }

    if (!res.ok) {
      console.error(`TMDB credits: HTTP ${res.status} per ${type}/${id}`);
      return NextResponse.json(
        { error: "TMDB request failed", cast: [] },
        { status: 502 },
      );
    }

    const data: { cast?: TMDBPerson[] } = await res.json();
    const cast = (data.cast ?? []).slice(0, 8).map((p) => ({
      id: p.id,
      name: p.name,
      character: p.character || p.roles?.[0]?.character || "",
      photoUrl: p.profile_path
        ? `https://image.tmdb.org/t/p/w185${p.profile_path}`
        : null,
    }));

    return NextResponse.json(
      { cast },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch (err) {
    console.error("TMDB credits fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cast", cast: [] },
      { status: 500 },
    );
  }
}
