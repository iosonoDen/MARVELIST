import { type NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb-server";

interface TMDBImage {
  file_path: string;
  iso_639_1: string | null;
  vote_average: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") === "tv" ? "tv" : "movie";

  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ posterUrl: null }, { status: 400 });
  }

  try {
    const response = await tmdbFetch(`/${type}/${id}/images`, {
      include_image_language: "en",
    });

    if (!response) {
      return NextResponse.json({ posterUrl: null }, { status: 503 });
    }

    if (!response.ok) {
      return NextResponse.json({ posterUrl: null }, { status: 502 });
    }

    const data: { posters?: TMDBImage[] } = await response.json();
    const best = (data.posters ?? [])
      .filter((p) => p.iso_639_1 === "en")
      .sort((a, b) => b.vote_average - a.vote_average)[0];

    return NextResponse.json(
      {
        posterUrl: best
          ? `https://image.tmdb.org/t/p/w500${best.file_path}`
          : null,
      },
      { headers: { "Cache-Control": "public, max-age=86400" } },
    );
  } catch (error) {
    console.error("TMDB poster fetch error:", error);
    return NextResponse.json({ posterUrl: null }, { status: 500 });
  }
}