import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Providers } from './providers';
import PageTransition from '@/components/animations/PageTransition';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Platform',
  description: 'Built with Next.js and MongoDB',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={['ar', 'he'].includes(locale) ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow flex flex-col">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
