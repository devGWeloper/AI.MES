import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthWrapper from '@/components/AuthWrapper';
import SecurityProvider from '@/components/SecurityProvider';

export const metadata: Metadata = {
  title: 'AI MES - Manufacturing Execution System',
  description: 'AI-powered Manufacturing Execution System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="font-inter relative"> 
        {/* decorative blurred gradients */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
        </div>
        <SecurityProvider>
          <AuthProvider>
            <AuthWrapper>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </AuthWrapper>
          </AuthProvider>
        </SecurityProvider>
      </body>
    </html>
  );
}