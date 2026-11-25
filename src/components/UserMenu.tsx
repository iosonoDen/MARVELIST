"use client";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Cloud, CloudOff, LogIn, LogOut, Pencil, User, UserPlus, X } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ChooseUsernameDialog, EditProfileDialog } from "@/components/ProfileDialogs";
import type { SyncStatus } from "@/hooks/useCloudSync";
import type { SupportedLocale } from "@/types/mcu";

const NUDGE_MS = 5000;

interface UserMenuProps {
  locale: SupportedLocale;
  syncStatus: SyncStatus;
  /** Avviso "Hai segnato N titoli!" da mostrare (null = nessuno). */
  nudgeCount: number | null;
  onNudgeClose: () => void;
}

/** Pulsante utente nell'header: menu Accedi/Registrati, oppure foto profilo dopo l'accesso. */
export const UserMenu: React.FC<UserMenuProps> = ({
  locale,
  syncStatus,
  nudgeCount,
  onNudgeClose,
}) => {
  const it = locale === "it";
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Chiude il menu cliccando fuori o con Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // L'avviso sparisce da solo dopo 5 secondi
  useEffect(() => {
    if (nudgeCount === null) return;
    const t = window.setTimeout(onNudgeClose, NUDGE_MS);
    return () => window.clearTimeout(t);
  }, [nudgeCount, onNudgeClose]);

  const showNudge = nudgeCount !== null && !isSignedIn && !open;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          onNudgeClose();
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={it ? "Account" : "Account"}
        title={it ? "Account" : "Account"}
        className={`relative flex h-9 items-center justify-center rounded-lg border bg-neutral-900/90 text-neutral-200 transition-all hover:border-white/30 ${
          isSignedIn ? "w-9 overflow-visible p-0" : "px-2.5"
        } ${open || showNudge ? "border-[#E21B24]/60" : "border-white/10"}`}
      >
        {isSignedIn && user?.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- foto profilo Google, piccola */}
            <img
              src={user.imageUrl}
              alt=""
              className="h-full w-full rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
            <span
              aria-hidden="true"
              className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#060709] ${
                syncStatus === "error" ? "bg-amber-500" : "bg-green-500"
              }`}
            />
          </>
        ) : (
          <User size={15} aria-hidden="true" />
        )}
      </button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 rounded-xl border border-white/15 bg-[#0d0e12]/95 p-1.5 shadow-[0_18px_40px_rgba(0,0,0,0.8)] cinematic-blur"
        >
          {isSignedIn ? (
            <>
              <div className="px-3 py-2.5">
                <p className="truncate text-sm font-bold text-white">
                  {user?.username ? `@${user.username}` : (user?.fullName ?? user?.primaryEmailAddress?.emailAddress)}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
                  {syncStatus === "error" ? (
                    <CloudOff size={13} className="text-amber-500" aria-hidden="true" />
                  ) : (
                    <Cloud size={13} className="text-green-500" aria-hidden="true" />
                  )}
                  {syncStatus === "error"
                    ? it
                      ? "Salvataggio non riuscito, riprovo alla prossima modifica"
                      : "Save failed, retrying on next change"
                    : syncStatus === "syncing"
                      ? it
                        ? "Salvataggio…"
                        : "Saving…"
                      : it
                        ? "Progressi salvati nel tuo account"
                        : "Progress saved to your account"}
                </p>
              </div>
              <div className="my-1 h-px bg-white/10" />
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setEditing(true);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-neutral-200 hover:bg-white/5"
              >
                <Pencil size={16} aria-hidden="true" />
                {it ? "Modifica profilo" : "Edit profile"}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => signOut({ redirectUrl: "/" })}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-bold text-neutral-200 hover:bg-white/5"
              >
                <LogOut size={16} aria-hidden="true" />
                {it ? "Esci" : "Sign out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login-page"
                role="menuitem"
                className="flex items-center gap-2.5 rounded-lg bg-[#E21B24]/12 px-3 py-2.5 hover:bg-[#E21B24]/20"
              >
                <LogIn size={17} className="text-[#E21B24]" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-bold text-white">
                    {it ? "Accedi" : "Log in"}
                  </span>
                  <span className="block text-[11px] font-medium text-neutral-400">
                    {it ? "Hai già un account" : "You already have an account"}
                  </span>
                </span>
              </Link>
              <Link
                href="/signup-page"
                role="menuitem"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 hover:bg-white/5"
              >
                <UserPlus size={17} className="text-neutral-200" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-bold text-white">
                    {it ? "Registrati" : "Sign up"}
                  </span>
                  <span className="block text-[11px] font-medium text-neutral-400">
                    {it ? "Crea un account" : "Create an account"}
                  </span>
                </span>
              </Link>
            </>
          )}
        </div>
      )}

      {isSignedIn && <ChooseUsernameDialog locale={locale} />}
      {editing && <EditProfileDialog locale={locale} onClosed={() => setEditing(false)} />}

      {/* Avviso dall'alto, sotto il pulsante utente: 5 secondi */}
      {showNudge && (
        <div
          role="status"
          className="nudge-in absolute right-0 top-[calc(100%+10px)] z-50 w-[min(330px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/15 bg-[#0d0e12]/95 shadow-[0_18px_40px_rgba(0,0,0,0.8),0_0_24px_rgba(226,27,36,0.2)] cinematic-blur"
        >
          <span
            aria-hidden="true"
            className="absolute -top-1.5 right-3.5 h-3 w-3 rotate-45 border-l border-t border-white/15 bg-[#0d0e12]"
          />
          <div className="relative flex items-start gap-3 p-3.5">
            <Cloud size={22} className="mt-0.5 shrink-0 text-[#E21B24]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-extrabold text-white">
                {it
                  ? `Hai segnato ${nudgeCount} titoli!`
                  : `You've marked ${nudgeCount} titles!`}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-neutral-400">
                {it
                  ? "Accedi con Google per non perderli e ritrovarli su tutti i dispositivi."
                  : "Sign in with Google to keep them and find them on all your devices."}
              </p>
              <div className="mt-2.5 flex gap-2">
                <Link
                  href="/login-page"
                  className="rounded-lg bg-[#E21B24] px-3 py-1.5 text-xs font-bold text-white shadow-[0_0_14px_rgba(226,27,36,0.55)] hover:brightness-110"
                >
                  {it ? "Accedi" : "Log in"}
                </Link>
                <button
                  type="button"
                  onClick={onNudgeClose}
                  className="rounded-lg border border-white/10 bg-neutral-900/90 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white"
                >
                  {it ? "Più tardi" : "Later"}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={onNudgeClose}
              aria-label={it ? "Chiudi" : "Close"}
              className="text-neutral-500 hover:text-white"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          {/* Tempo rimasto */}
          <div className="h-[3px] bg-white/10">
            <div className="nudge-timer h-full bg-linear-to-r from-[#8B0000] to-[#E21B24]" />
          </div>
        </div>
      )}
    </div>
  );
};
