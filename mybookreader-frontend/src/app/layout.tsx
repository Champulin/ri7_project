
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';
import { poppins, sofia } from './styles/fonts';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${poppins.variable} ${sofia.variable} bg-primary  min-w-[375px] m-auto`}
        >{children}</body>
      </html>
    </AuthProvider>
  );
}
