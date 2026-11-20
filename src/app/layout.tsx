import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
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
        {children}
      </body>
    </html>
  );
}