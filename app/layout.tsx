import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_TC } from 'next/font/google';

const notoSansTC = Noto_Sans_TC({ 
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  title: 'PortfolioViz Pro',
  description: 'Advanced Portfolio Visualization',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className={notoSansTC.className}>{children}</body>
    </html>
  );
}