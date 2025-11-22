import Footer from "@/components/common/footer/Footer";
import Header from "@/components/common/header/Header";
import MobileHeader from "@/components/common/mobileHeader/MobileHeader";

export default function MainLayout({ children }) {
  return (
    <>
  <div className="app-container">
              <div className="webHeader">
                <Header />
              </div>
              <div className={"mobileHeader"}>
                <MobileHeader />
              </div>
            </div>
      <main>{children}</main>
      <Footer />
    </>
  );
}
