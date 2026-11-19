'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

interface CinematicBackgroundProps {
  videoSrc?: string;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  videoSrc = '/Marvel-Opening-Theme.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoDisabled, setVideoDisabled] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- preferenza utente letta solo nel browser
      setVideoDisabled(true);
    }
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {!videoDisabled ? (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover filter blur-[28px] brightness-[0.22] contrast-[1.25] scale-105 transition-opacity duration-1000"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#120406] via-[#08090C] to-[#040405] opacity-95" />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#060709_90%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(6,7,9,0.4)_0%,rgba(6,7,9,0.85)_100%)]" />

      <div className="absolute top-20 right-6 pointer-events-auto flex items-center gap-2">
        <button
          type="button"
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-white/10 hover:border-red-600/50 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white cinematic-blur transition-all"
          title={isMuted ? "Attiva audio intro" : "Disattiva audio"}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-red-500 animate-pulse" />}
          <span>{isMuted ? "Audio OFF" : "Audio ON"}</span>
        </button>
        <button
          type="button"
          onClick={() => setVideoDisabled(!videoDisabled)}
          className="p-1.5 rounded-full bg-neutral-900/80 border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white cinematic-blur transition-all"
          title={videoDisabled ? "Attiva video background" : "Disattiva video"}
        >
          {videoDisabled ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </div>
  );
};