"use client";

import {Eye, EyeOff, Volume2, VolumeX} from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);

  mediaQuery.addEventListener("change", onChange);

  return () => {
    mediaQuery.removeEventListener("change", onChange);
  };
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

interface CinematicBackgroundProps {
  videoSrc?: string;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  videoSrc = "/Marvel-Opening-Theme.mp4",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const [videoOverride, setVideoOverride] = useState<boolean | null>(null);

  const videoDisabled = videoOverride ?? prefersReducedMotion;
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (videoRef.current && !videoDisabled && !hasError) {
      videoRef.current.play().catch((err) => {
        console.info(
          "Autoplay bloccato dal browser o in attesa di interazione:",
          err,
        );
      });
    }
  }, [videoDisabled, hasError]);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVideoError = () => {
    console.warn(
      `Video background non disponibile al percorso "${videoSrc}", fallback su gradiente cinematico.`,
    );
    setHasError(true);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {!videoDisabled && !hasError ? (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover filter blur-[28px] brightness-[0.25] contrast-[1.25] scale-105 transition-opacity duration-1000"
        />
      ) : (
        <div className="absolute inset-0 bg-linear-to-b from-[#180508] via-[#08090C] to-[#040405] opacity-95" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#060709_90%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,7,9,0.35)_0%,rgba(6,7,9,0.85)_100%)]" />

      <div className="absolute top-20 right-6 pointer-events-auto flex items-center gap-2 font-sans">
        {!hasError && (
          <button
            type="button"
            onClick={toggleAudio}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 hover:border-red-600/50 text-xs font-semibold uppercase tracking-wider text-neutral-200 hover:text-white cinematic-blur transition-all shadow-md"
            title={isMuted ? "Attiva audio intro" : "Disattiva audio"}
          >
            {isMuted ? (
              <VolumeX size={14} />
            ) : (
              <Volume2 size={14} className="text-red-500 animate-pulse" />
            )}
            <span>{isMuted ? "Audio OFF" : "Audio ON"}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => setVideoOverride(!videoDisabled)}
          className="p-2 rounded-full bg-neutral-900/80 border border-white/10 hover:border-white/30 text-neutral-300 hover:text-white cinematic-blur transition-all shadow-md"
          title={videoDisabled ? "Attiva video background" : "Disattiva video"}
        >
          {videoDisabled ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </div>
  );
};
