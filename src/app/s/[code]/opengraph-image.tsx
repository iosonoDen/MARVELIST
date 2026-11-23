import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { INITIAL_MCU_DATABASE } from "@/data/mcu-canon";
import { byTimeline, decodeChallenge, MILESTONES, rankAt, sagaProgress } from "@/lib/saga";

export const alt = "MARVELIST";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";


// Font e logo letti una volta sola.
const fontsP = Promise.all([
  readFile(join(process.cwd(), "src/assets/fonts/Anton-Regular.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/Inter-SemiBold.ttf")),
  readFile(join(process.cwd(), "src/assets/fonts/Inter-Black.ttf")),
]);
const logoP = readFile(join(process.cwd(), "public/marvel-logo.svg")).then(
  (b) => `data:image/svg+xml;base64,${b.toString("base64")}`,
);

/** Stemmi dei gradi come data URL (percorsi fissi: Vercel include solo questi file). */
const toDataUrl = (b: Buffer) => `data:image/png;base64,${b.toString("base64")}`;
const RANK_ICONS: Record<string, Promise<string>> = {
  "/ranks/cadetto.png": readFile(join(process.cwd(), "public/ranks/cadetto.png")).then(toDataUrl),
  "/ranks/recluta.png": readFile(join(process.cwd(), "public/ranks/recluta.png")).then(toDataUrl),
  "/ranks/agente.png": readFile(join(process.cwd(), "public/ranks/agente.png")).then(toDataUrl),
  "/ranks/eroe.png": readFile(join(process.cwd(), "public/ranks/eroe.png")).then(toDataUrl),
  "/ranks/vendicatore.png": readFile(join(process.cwd(), "public/ranks/vendicatore.png")).then(toDataUrl),
};

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const challenge = decodeChallenge((await params).code) ?? {
    locale: "it" as const,
    watched: 0,
    total: INITIAL_MCU_DATABASE.length,
  };
  const { locale, watched, total } = challenge;
  const s = sagaProgress(watched, total);
  const it = locale === "it";
  const [[anton, interSemi, interBlack], logo, icon] = await Promise.all([
    fontsP,
    logoP,
    RANK_ICONS[s.rank.icon],
  ]);

  const posters = byTimeline(INITIAL_MCU_DATABASE)
    .slice(0, 24)
    .map((e) => e.posterUrl.replace("/w500/", "/w185/"));
  const c = s.rank.color;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#060709",
          fontFamily: "Inter",
          color: "#f3f4f6",
        }}
      >
        {/* Locandine inclinate a destra */}
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -70,
            width: 540,
            height: 780,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            transform: "rotate(8deg)",
          }}
        >
          {posters.map((src, i) => (
            <img
              key={src + i}
              src={src}
              width={127}
              height={190}
              alt=""
              style={{ borderRadius: 6, objectFit: "cover" }}
            />
          ))}
        </div>
        {/* Sfumatura verso il nero + alone rosso come il sito */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background:
              "linear-gradient(90deg, #060709 0%, #060709 45%, rgba(6,7,9,0.75) 62%, rgba(6,7,9,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle at 8% 10%, rgba(226,27,36,0.32) 0%, rgba(226,27,36,0) 45%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 64,
            top: 56,
            bottom: 56,
            width: 640,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo: file originale + "IST" */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <img src={logo} width={123} height={48} alt="" style={{ objectFit: "contain" }} />
            <span
              style={{
                fontFamily: "Anton",
                fontSize: 48,
                lineHeight: 1,
                letterSpacing: -2,
                color: "#fff",
              }}
            >
              IST
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 34 }}>
            <span style={{ fontFamily: "Anton", fontSize: 190, lineHeight: 0.9, color: "#fff" }}>
              {s.pct}
            </span>
            <span
              style={{
                fontFamily: "Inter Black",
                fontSize: 70,
                color: "#E21B24",
                marginLeft: 6,
                marginBottom: 6,
              }}
            >
              %
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 28 }}>
            {/* Stemma del grado, già colorato */}
            <img src={icon} width={96} height={96} alt="" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "Inter Black",
                  fontSize: 20,
                  letterSpacing: 3,
                  color: c,
                  textTransform: "uppercase",
                }}
              >
                {it ? "Grado" : "Rank"}: {s.rank[locale]}
              </span>
              <span style={{ fontSize: 24, color: "#d4d4d4", marginTop: 4 }}>
                <span style={{ fontFamily: "Inter Black", color: "#fff", marginRight: 8 }}>
                  {watched}
                </span>
                / {total} {it ? "titoli visti" : "titles watched"}
              </span>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex" }} />

          {/* Barra della saga con le tappe dentro */}
          <div
            style={{
              position: "relative",
              display: "flex",
              height: 26,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "#171717",
              padding: 3,
            }}
          >
            <div
              style={{
                width: `${Math.max(s.pct, 2)}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #8B0000, #E21B24, #FF4D4D)",
                boxShadow: "0 0 18px rgba(226,27,36,0.9)",
              }}
            />
            {MILESTONES.map((m) => (
              <div
                key={m}
                style={{
                  position: "absolute",
                  left: `${m}%`,
                  top: 4,
                  bottom: 4,
                  width: 3,
                  borderRadius: 3,
                  background: s.pct >= m ? rankAt(m).color : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Anton", data: anton, weight: 400, style: "normal" },
        { name: "Inter", data: interSemi, weight: 600, style: "normal" },
        { name: "Inter Black", data: interBlack, weight: 900, style: "normal" },
      ],
    },
  );
}
