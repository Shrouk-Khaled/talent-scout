import styles from "./page.module.scss";
import Hero from "@/components/home/hero/Hero";
import KnowUs from "@/components/home/knowUs/KnowUs";
import Features from "@/components/home/features/Features";
import Talents from "@/components/home/talents/Talents";
import HowToStart from "@/components/home/howToStart/HowToStart";
import Packages from "@/components/home/packages/Packages";
import Questions from "@/components/home/questions/Questions";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero/>
      <KnowUs/>
      <Features/>
      <Talents/>
      <div className="app-container">
        <HowToStart/>
        <HowToStart isResearcher/>
        <Packages/>
        <Questions/>
      </div>
    </div>
  );
}
