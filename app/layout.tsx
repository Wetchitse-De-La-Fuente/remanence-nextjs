import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Rémanence — Studio de photographie',
  description:
    'Rémanence, studio de photographie indépendant. Portraits, éditorial, savoir-faire et instants de vie : des images sensibles, pensées pour rester.',
  icons: { icon: '/assets/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#000000' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="js">
      <body>{children}</body>
    </html>
  );
}
