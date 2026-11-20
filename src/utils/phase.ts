import type { MCUPhase, SupportedLocale } from "@/types/mcu";

export function formatPhase(phase: MCUPhase, locale: SupportedLocale): string {
  return locale === "it" ? phase.replace("Phase", "Fase") : phase;
}