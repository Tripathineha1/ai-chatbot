import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Chatbot Admin Panel',
  description: 'Intercom-like AI chatbot admin panel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <title>SuperJinni - AI Customer Support</title>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 