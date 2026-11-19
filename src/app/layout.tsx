import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MARVELIST — Cinematic MCU Architecture & Watchlist',
  description: 'Traccia la visione canonica del Marvel Cinematic Universe con statistiche in tempo reale, timeline in-universe e preview trailer.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="dark">
      <body className="bg-[#060709] text-neutral-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}