'use client';

import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className='bg-slate-500' >{children}</body>
      </html>
    </AuthProvider>
  );
}
