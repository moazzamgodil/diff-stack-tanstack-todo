import type { Metadata } from 'next';

import QueryProvider from './providers/QueryProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'TanStack Todo',
  description: 'Todo application'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <QueryProvider>
            {children}
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}