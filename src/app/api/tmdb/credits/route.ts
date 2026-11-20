import {type NextRequest, NextResponse } from "next/server";

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

  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter" },
      { status: 400 },
    );
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("Variabile TMDB_API_KEY non configurata");

    return NextResponse.json(
      { error: "Cast service unavailable", cast: [] },
      { status: 503 },
    );
  }

  const endpoint =
    type === "tv"
      ? `https://api.themoviedb.org/3/tv/${id}/aggregate_credits?api_key=${apiKey}&language=it-IT`
      : `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}&language=it-IT`;

  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ cast: [] }, { status: res.status });
    }

    const data = await res.json();
    const rawCast: TMDBPerson[] = data.cast || [];

    const cast = rawCast.slice(0, 8).map((p) => {
      const character = p.character || p.roles?.[0]?.character || "";
      return {
        id: p.id,
        name: p.name,
        character,
        photoUrl: p.profile_path
          ? `https://image.tmdb.org/t/p/w185${p.profile_path}`
          : null,
      };
    });

    return NextResponse.json({ cast });
  } catch (err) {
    console.error("TMDB credits fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch cast", cast: [] },
      { status: 500 },
    );
  }
}
