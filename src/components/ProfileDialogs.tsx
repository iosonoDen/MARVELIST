"use client";

import { useUser } from "@clerk/nextjs";
import { Camera, Check, Loader2, X } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cleanUsername, nextUsernameChange, USERNAME_RE } from "@/lib/username";
import type { SupportedLocale } from "@/types/mcu";

const CLOSE_MS = 220;
const MAX_PHOTO_MB = 5;
const SKIP_KEY = "marvelist:username-later";

/* ------------------------------------------------------------------ */
/* Popup al centro con sfondo sfocato, animato in apertura e chiusura  */
/* ------------------------------------------------------------------ */

interface ModalProps {
  label: string;
  /** Chiamata a fine animazione di chiusura. */
  onClosed: () => void;
  dismissable?: boolean;
  children: (close: () => void) => React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ label, onClosed, dismissable = true, children }) => {
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setClosing(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onClosed, reduce ? 0 : CLOSE_MS);
  }, [onClosed]);

  const closeRef = useRef(close);
  useEffect(() => {
    closeRef.current = dismissable ? close : () => {};
  }, [close, dismissable]);

  // Blocca lo scorrimento della pagina, Esc chiude, il focus va nel popup (una volta sola)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("input:not([disabled]), button")?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={dismissable ? close : undefined}
        className={`absolute inset-0 bg-[#060709]/70 backdrop-blur-md ${closing ? "modal-fade-out" : "modal-fade-in"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={`relative w-full max-w-sm rounded-2xl border border-white/12 bg-[#0d0e12] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.8)] ${
          closing ? "modal-out" : "modal-in"
        }`}
      >
        {children(close)}
      </div>
    </div>,
    document.body,
  );
};

/* ------------------------------------------------------------------ */
/* Campi                                                                */
/* ------------------------------------------------------------------ */

type Check = "same" | "invalid" | "checking" | "available" | "taken";

/** Controlla mentre scrivi se l'username è libero (con un piccolo ritardo). */
function useUsernameCheck(value: string, current: string): Check {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const valid = USERNAME_RE.test(value);
  const known = value in results;

  useEffect(() => {
    if (!valid || known || value === current) return;
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      fetch(`/api/profile/username?u=${encodeURIComponent(value)}`, { signal: ctrl.signal })
        .then((r) => (r.ok ? r.json() : null))
        .then((d: { available?: boolean } | null) => {
          if (d) setResults((prev) => ({ ...prev, [value]: Boolean(d.available) }));
        })
        .catch(() => {});
    }, 400);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [value, valid, known, current]);

  if (value === current) return "same";
  if (!valid) return "invalid";
  if (!known) return "checking";
  return results[value] ? "available" : "taken";
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-neutral-900 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 transition-colors duration-150 focus:border-[#E21B24] focus:outline-none disabled:opacity-50";

const Field: React.FC<{
  label: React.ReactNode;
  hint?: React.ReactNode;
  children: (id: string) => React.ReactNode;
}> = ({ label, hint, children }) => {
  const id = useId();
  return (
    <div className="mt-3">
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-neutral-400">
        {label}
      </label>
      {children(id)}
      {hint && <div className="mt-1.5 text-xs">{hint}</div>}
    </div>
  );
};

const UsernameField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  check: Check;
  locked: Date | null;
  it: boolean;
  locale: SupportedLocale;
}> = ({ value, onChange, check, locked, it, locale }) => {
  const date = locked?.toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "long" });
  const hint = locked ? (
    <span className="text-neutral-500">
      {it ? `Potrai cambiarlo di nuovo dal ${date}` : `You can change it again from ${date}`}
    </span>
  ) : check === "invalid" && value ? (
    <span className="text-neutral-500">
      {it ? "Da 3 a 20 caratteri: lettere, numeri, _ e ." : "3 to 20 characters: letters, numbers, _ and ."}
    </span>
  ) : check === "checking" ? (
    <span className="text-neutral-500">{it ? "Controllo…" : "Checking…"}</span>
  ) : check === "available" ? (
    <span className="flex items-center gap-1 text-[#4cc38a]">
      <Check size={13} aria-hidden="true" />
      {it ? "Disponibile" : "Available"}
    </span>
  ) : check === "taken" ? (
    <span className="text-[#e5484d]">{it ? "Già preso, provane un altro" : "Already taken, try another"}</span>
  ) : (
    <span className="text-neutral-500">
      {it ? "Puoi cambiarlo una volta al mese" : "You can change it once a month"}
    </span>
  );
  return (
    <Field label="Username" hint={hint}>
      {(id) => (
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-neutral-500">@</span>
          <input
            id={id}
            value={value}
            disabled={Boolean(locked)}
            onChange={(e) => onChange(cleanUsername(e.target.value))}
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={20}
            className={`${inputClass} pl-8`}
          />
        </div>
      )}
    </Field>
  );
};

const errorText = (code: string, it: boolean, locale: SupportedLocale, nextAt?: string) => {
  if (code === "taken") return it ? "Questo username è già preso." : "This username is already taken.";
  if (code === "invalid") return it ? "Username non valido." : "Invalid username.";
  if (code === "too_soon" && nextAt) {
    const d = new Date(nextAt).toLocaleDateString(locale === "it" ? "it-IT" : "en-GB", { day: "numeric", month: "long" });
    return it ? `Potrai cambiare username dal ${d}.` : `You can change your username from ${d}.`;
  }
  return it ? "Non è stato possibile salvare. Riprova." : "Could not save. Please try again.";
};

async function saveUsername(username: string) {
  const res = await fetch("/api/profile/username", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  if (!res.ok) {
    const d = (await res.json().catch(() => ({}))) as { error?: string; nextAt?: string };
    throw Object.assign(new Error(d.error ?? "failed"), { code: d.error ?? "failed", nextAt: d.nextAt });
  }
}

const PrimaryButton: React.FC<{ busy: boolean; disabled?: boolean; children: React.ReactNode }> = ({
  busy,
  disabled,
  children,
}) => (
  <button
    type="submit"
    disabled={busy || disabled}
    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E21B24] px-4 py-2.5 text-sm font-bold text-white transition-[filter,transform] duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
  >
    {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Modifica profilo                                                     */
/* ------------------------------------------------------------------ */

export const EditProfileDialog: React.FC<{ locale: SupportedLocale; onClosed: () => void }> = ({
  locale,
  onClosed,
}) => {
  const it = locale === "it";
  const { user } = useUser();
  const current = user?.username ?? "";
  const [username, setUsername] = useState(current);
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [photo, setPhoto] = useState<{ file: File; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const check = useUsernameCheck(username, current);
  const locked = nextUsernameChange(user?.publicMetadata?.usernameChangedAt, Boolean(current));

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo.url);
  }, [photo]);

  if (!user) return null;

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_PHOTO_MB * 1024 * 1024) {
      setError(it ? `Scegli un'immagine fino a ${MAX_PHOTO_MB} MB.` : `Choose an image up to ${MAX_PHOTO_MB} MB.`);
      return;
    }
    setError(null);
    setPhoto({ file, url: URL.createObjectURL(file) });
  };

  const usernameChanged = username !== current;
  const canSave =
    firstName.trim().length > 0 && (!usernameChanged || check === "available" || check === "checking");

  return (
    <Modal label={it ? "Modifica profilo" : "Edit profile"} onClosed={onClosed} dismissable={!busy}>
      {(close) => (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!canSave || busy) return;
            setBusy(true);
            setError(null);
            try {
              if (usernameChanged) await saveUsername(username);
              const first = firstName.trim();
              const last = lastName.trim();
              if (first !== (user.firstName ?? "") || last !== (user.lastName ?? "")) {
                await user.update({ firstName: first, lastName: last });
              }
              if (photo) await user.setProfileImage({ file: photo.file });
              await user.reload();
              close();
            } catch (err) {
              const { code, nextAt } = err as { code?: string; nextAt?: string };
              setError(errorText(code ?? "failed", it, locale, nextAt));
              setBusy(false);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">{it ? "Modifica profilo" : "Edit profile"}</h2>
            <button
              type="button"
              onClick={close}
              disabled={busy}
              aria-label={it ? "Chiudi" : "Close"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 transition-colors duration-150 hover:bg-white/5 hover:text-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label={it ? "Cambia foto profilo" : "Change profile photo"}
              className="group/av relative h-20 w-20 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E21B24]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- anteprima locale o foto Clerk */}
              <img
                src={photo?.url ?? user.imageUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full border-2 border-white/15 object-cover transition-[filter] duration-200 group-hover/av:brightness-75"
              />
              <span className="absolute -right-0.5 -bottom-0.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0d0e12] bg-[#E21B24] text-white">
                <Camera size={13} aria-hidden="true" />
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={pickPhoto} />
          </div>

          <UsernameField
            value={username}
            onChange={setUsername}
            check={check}
            locked={locked}
            it={it}
            locale={locale}
          />
          <Field label={it ? "Nome" : "First name"}>
            {(id) => (
              <input
                id={id}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={40}
                autoComplete="given-name"
                className={inputClass}
              />
            )}
          </Field>
          <Field
            label={
              <>
                {it ? "Cognome" : "Last name"}{" "}
                <span className="text-neutral-600">{it ? "(facoltativo)" : "(optional)"}</span>
              </>
            }
          >
            {(id) => (
              <input
                id={id}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={40}
                autoComplete="family-name"
                placeholder={it ? "Cognome" : "Last name"}
                className={inputClass}
              />
            )}
          </Field>

          {error && (
            <p role="alert" className="mt-3 text-xs text-[#e5484d]">
              {error}
            </p>
          )}

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={close}
              disabled={busy}
              className="flex-1 rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-sm font-bold text-neutral-200 transition-colors duration-150 hover:border-white/30"
            >
              {it ? "Annulla" : "Cancel"}
            </button>
            <PrimaryButton busy={busy} disabled={!canSave}>
              {it ? "Salva" : "Save"}
            </PrimaryButton>
          </div>
        </form>
      )}
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Primo accesso: scegli l'username                                     */
/* ------------------------------------------------------------------ */

const readSkip = () => {
  try {
    return window.sessionStorage.getItem(SKIP_KEY) === "1";
  } catch {
    return false;
  }
};

/** Si apre da solo se l'utente collegato non ha ancora un username. */
export const ChooseUsernameDialog: React.FC<{ locale: SupportedLocale }> = ({ locale }) => {
  const it = locale === "it";
  const { user, isLoaded } = useUser();
  const [done, setDone] = useState(false);
  const [skipped] = useState(() => typeof window !== "undefined" && readSkip());
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const check = useUsernameCheck(username, "");

  if (!isLoaded || !user || user.username || skipped || done) return null;

  return (
    <Modal
      label={it ? "Scegli il tuo username" : "Choose your username"}
      onClosed={() => setDone(true)}
      dismissable={false}
    >
      {(close) => (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (check !== "available" || busy) return;
            setBusy(true);
            setError(null);
            try {
              await saveUsername(username);
              await user.reload();
              close();
            } catch (err) {
              const { code, nextAt } = err as { code?: string; nextAt?: string };
              setError(errorText(code ?? "failed", it, locale, nextAt));
              setBusy(false);
            }
          }}
        >
          <h2 className="text-base font-bold text-white">{it ? "Scegli il tuo username" : "Choose your username"}</h2>
          <p className="mt-1 text-sm leading-snug text-neutral-400">
            {it
              ? "È il nome che vedranno gli altri. Il tuo nome di Google resta privato."
              : "This is the name others will see. Your Google name stays private."}
          </p>
          <UsernameField
            value={username}
            onChange={setUsername}
            check={check}
            locked={null}
            it={it}
            locale={locale}
          />
          {error && (
            <p role="alert" className="mt-3 text-xs text-[#e5484d]">
              {error}
            </p>
          )}
          <div className="mt-5 flex">
            <PrimaryButton busy={busy} disabled={check !== "available"}>
              {it ? "Continua" : "Continue"}
            </PrimaryButton>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              try {
                window.sessionStorage.setItem(SKIP_KEY, "1");
              } catch {
                /* ignora */
              }
              close();
            }}
            className="mt-3 w-full text-center text-xs text-neutral-500 transition-colors duration-150 hover:text-neutral-300"
          >
            {it ? "Più tardi" : "Later"}
          </button>
        </form>
      )}
    </Modal>
  );
};
