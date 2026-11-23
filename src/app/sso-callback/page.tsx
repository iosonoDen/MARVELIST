import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

/** Ritorno da Google: Clerk completa l'accesso e riporta alla lista. */
export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#060709] text-neutral-400">
      <Loader2 size={28} className="animate-spin" aria-label="Accesso in corso" />
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </div>
  );
}
