import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import '../globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n';

const archivo = Archivo({ subsets: ['latin'] })

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Fetch messages for the specific locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body className={archivo.className}>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
