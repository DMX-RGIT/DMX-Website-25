import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ClientLayoutWrapper } from '@/components/ui/client-layout-wrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DataMatrix - RGIT Tech Committee',
  description: 'Exploring AI/ML and cutting-edge technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#030305] text-white selection:bg-[#00F0FF] selection:text-black`}>
        <div className="noise-overlay pointer-events-none"></div>
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
