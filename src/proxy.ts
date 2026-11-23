import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk legge la sessione su ogni richiesta. Nessuna pagina è protetta:
// il sito resta usabile senza account, il login serve solo a sincronizzare.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Salta i file interni di Next.js e i file statici
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)",
    // Sempre attivo per le API
    "/(api|trpc)(.*)",
  ],
};
