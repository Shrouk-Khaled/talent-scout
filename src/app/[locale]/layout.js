import "@/styles/globals.scss";
import "@ant-design/v5-patch-for-react-19";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routes";
import "react-phone-input-2/lib/style.css";
import "antd/dist/reset.css";
import AntdRegistry from "./AntdRegistry";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const metadata = {
  metadataBase: new URL("https://talent-scout-mu.vercel.app"), // important for absolute OG URLs
  title: {
    default: "Talent Scout",
    template: "%s | Talent Scout",
  },
  description: "Find the best talent",
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      ar: "/ar",
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Talent Scout",
    title: "Talent Scout",
    description: "Find the best talent",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Talent Scout",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talent Scout",
    description: "Find the best talent",
    images: ["/images/logo.png"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <AntdRegistry>
          <div>
            <NextIntlClientProvider locale={locale}>
              <div>{children}</div>
            </NextIntlClientProvider>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
