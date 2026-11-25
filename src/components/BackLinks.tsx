import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import type React from "react";

// Stesso stile per la X delle pagine di accesso e per "Torna alla lista"
const BASE =
  "inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-neutral-900/80 text-neutral-300 transition-colors duration-150 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-[#E21B24]";

/** X in alto a destra: chiude la pagina e torna alla lista. */
export const CloseToList: React.FC<{ label: string; className?: string }> = ({ label, className = "" }) => (
  <Link href="/" aria-label={label} title={label} className={`${BASE} w-10 cinematic-blur ${className}`}>
    <X size={18} aria-hidden="true" />
  </Link>
);

/** "‹ Torna alla lista" */
export const BackToList: React.FC<{ label: string; className?: string }> = ({ label, className = "" }) => (
  <Link href="/" className={`${BASE} gap-1 pr-3.5 pl-2.5 text-xs font-semibold ${className}`}>
    <ChevronLeft size={16} aria-hidden="true" />
    {label}
  </Link>
);
