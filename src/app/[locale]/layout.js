import "@/styles/globals.scss";
import '@ant-design/v5-patch-for-react-19'; 
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routes";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import MobileHeader from "@/components/common/mobileHeader/MobileHeader";

export const metadata = {
  title: "Talent Scout",
  description: "Find the best talent",
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <div>
          <NextIntlClientProvider locale={locale}>
            <div className="app-container">
              <div className="webHeader">
                <Header/>
              </div>
              <div className={"mobileHeader"}>
                <MobileHeader/>
              </div>
            </div>
            <div style={{backgroundColor: "#F6F9FF"}}>
              {children}
            </div>
            <Footer/>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
