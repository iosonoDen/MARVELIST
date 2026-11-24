"use client";

import {
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
} from "lucide-react";
import {
  type FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const SEEK_STEP_SECONDS = 10;
const DEFAULT_VISIBILITY = 0.8;
const DEFAULT_VOLUME = 0.5;
const STORAGE_KEY = "marvelist:background-settings";
const SETTINGS_CHANGE_EVENT = "marvelist:background-settings-change";

interface BackgroundSettings {
  volume: number;
  visibility: number;
  lastVisibility: number;
}

const DEFAULT_SETTINGS: BackgroundSettings = {
  volume: DEFAULT_VOLUME,
  visibility: DEFAULT_VISIBILITY,
  lastVisibility: DEFAULT_VISIBILITY,
};

function clamp01(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(Math.max(value, 0), 1)
    : fallback;
}

function parseSettings(raw: string | null): BackgroundSettings {
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const data = (JSON.parse(raw) ?? {}) as Partial<BackgroundSettings>;
    const visibility = clamp01(data.visibility, DEFAULT_VISIBILITY);
    const lastVisibility = clamp01(
      data.lastVisibility,
      visibility > 0 ? visibility : DEFAULT_VISIBILITY,
    );
    return {
      volume: clamp01(data.volume, DEFAULT_VOLUME),
      visibility,
      lastVisibility: lastVisibility > 0 ? lastVisibility : DEFAULT_VISIBILITY,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/* Copia in memoria: se localStorage non è scrivibile, le impostazioni restano valide in sessione. */
let memoryRaw: string | null | undefined;

function subscribeToSettings(onChange: () => void) {
  const handleStorage = () => {
    memoryRaw = undefined;
    onChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(SETTINGS_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, onChange);
  };
}

function getSettingsSnapshot(): string | null {
  if (memoryRaw !== undefined) return memoryRaw;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSettingsServerSnapshot(): string | null {
  return null;
}

function saveSettings(settings: BackgroundSettings): void {
  const raw = JSON.stringify(settings);
  memoryRaw = raw;
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // localStorage non disponibile: le impostazioni restano solo in sessione.
  }
  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

interface CinematicBackgroundProps {
  videoSrc?: string;
}

const pillClass =
  "group flex items-center rounded-full bg-neutral-900/80 border border-white/10 hover:border-white/30 focus-within:border-white/30 cinematic-blur shadow-md transition-colors";

const panelClass =
  "flex items-center gap-2 overflow-hidden max-w-0 opacity-0 group-hover:max-w-72 group-hover:opacity-100 group-hover:pr-3 group-focus-within:max-w-72 group-focus-within:opacity-100 group-focus-within:pr-3 transition-[max-width,opacity,padding] duration-300 ease-out motion-reduce:transition-none";

const iconButtonClass =
  "p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-red-500";

const sliderBaseClass =
  "w-24 h-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-red-500";

export const CinematicBackground: FC<CinematicBackgroundProps> = ({
  videoSrc = "/Marvel-Opening-Theme.mp4",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [hasError, setHasError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const rawSettings = useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    getSettingsServerSnapshot,
  );
  const { volume, visibility, lastVisibility } = useMemo(
    () => parseSettings(rawSettings),
    [rawSettings],
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.volume = volume;
  }, [isMuted, volume]);

  useEffect(() => {
    videoRef.current?.play().catch((err) => {
      console.info("Autoplay bloccato dal browser:", err);
    });
  }, []);

  const updateSettings = (patch: Partial<BackgroundSettings>) => {
    saveSettings({ volume, visibility, lastVisibility, ...patch });
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch((err) => console.info("Play non riuscito:", err));
    } else {
      video.pause();
    }
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration,
    );
  };

  const toggleMute = () => {
    if (isMuted && volume === 0) updateSettings({ volume: DEFAULT_VOLUME });
    setIsMuted((prev) => !prev);
  };

  const handleVolumeChange = (value: number) => {
    updateSettings({ volume: value });
    setIsMuted(value === 0);
  };

  const handleVisibilityChange = (value: number) => {
    updateSettings(
      value > 0
        ? { visibility: value, lastVisibility: value }
        : { visibility: value },
    );
  };

  const toggleVisibility = () => {
    if (visibility > 0) {
      updateSettings({ visibility: 0, lastVisibility: visibility });
    } else {
      updateSettings({ visibility: lastVisibility });
    }
  };

  const handleVideoError = () => {
    console.warn(
      `Video background non disponibile al percorso "${videoSrc}", fallback su gradiente cinematico.`,
    );
    setHasError(true);
  };

  const audioOff = isMuted || volume === 0;
  const videoHidden = visibility === 0;

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-linear-to-b from-[#180508] via-[#08090C] to-[#040405]" />

        {!hasError && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster="/marvel-opening-poster.jpg"
            preload="auto"
            autoPlay
            loop
            muted
            playsInline
            onError={handleVideoError}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ opacity: visibility }}
            className="absolute inset-0 w-full h-full object-cover filter blur-[6px] brightness-[0.7] contrast-[1.1] scale-105 transition-opacity duration-300"
          />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#060709_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,7,9,0.15)_0%,rgba(6,7,9,0.7)_100%)]" />
      </div>

      {!hasError && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 font-sans">
          <div className={pillClass}>
            <div className={panelClass}>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={audioOff ? 0 : volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                aria-label="Volume"
                className={`${sliderBaseClass} ml-3 ${
                  audioOff ? "accent-neutral-500" : "accent-red-500"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={toggleMute}
              aria-pressed={!audioOff}
              aria-label={audioOff ? "Attiva audio" : "Disattiva audio"}
              title={audioOff ? "Attiva audio" : "Disattiva audio"}
              className="relative p-2 rounded-full text-neutral-200 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-red-500"
            >
              <Volume2
                size={16}
                aria-hidden="true"
                className={audioOff ? "" : "text-red-500"}
              />
              {audioOff && (
                <svg
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 m-auto h-4 w-4"
                >
                  <line
                    x1="2"
                    y1="2"
                    x2="14"
                    y2="14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className={pillClass}>
            <div className={panelClass}>
              <button
                type="button"
                onClick={() => seekBy(-SEEK_STEP_SECONDS)}
                aria-label={`Indietro di ${SEEK_STEP_SECONDS} secondi`}
                title={`Indietro di ${SEEK_STEP_SECONDS}s`}
                className={`${iconButtonClass} ml-3`}
              >
                <RotateCcw size={14} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Metti in pausa" : "Riproduci"}
                title={isPlaying ? "Pausa" : "Riproduci"}
                className={iconButtonClass}
              >
                {isPlaying ? (
                  <Pause size={14} aria-hidden="true" />
                ) : (
                  <Play size={14} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => seekBy(SEEK_STEP_SECONDS)}
                aria-label={`Avanti di ${SEEK_STEP_SECONDS} secondi`}
                title={`Avanti di ${SEEK_STEP_SECONDS}s`}
                className={iconButtonClass}
              >
                <RotateCw size={14} aria-hidden="true" />
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={visibility}
                onChange={(e) => handleVisibilityChange(Number(e.target.value))}
                aria-label="Visibilità del video di sfondo"
                className={`${sliderBaseClass} accent-red-500`}
              />
            </div>
            <button
              type="button"
              onClick={toggleVisibility}
              aria-pressed={!videoHidden}
              aria-label={videoHidden ? "Mostra video" : "Nascondi video"}
              title={videoHidden ? "Mostra video" : "Nascondi video"}
              className="p-2 rounded-full text-neutral-200 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              {videoHidden ? (
                <EyeOff size={16} aria-hidden="true" />
              ) : (
                <Eye size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};