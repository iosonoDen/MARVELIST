import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';

// Indirizzo pubblico del sito: serve per gli URL assoluti delle anteprime.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'MARVELIST',
  description: 'A MARVEL movies and series watchlist',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className="bg-[#060709] text-neutral-100 antialiased min-h-screen">
        {/* Login facoltativo: il sito resta usabile senza account */}
        <ClerkProvider
          signInUrl="/login-page"
          signUpUrl="/signup-page"
          afterSignOutUrl="/"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}