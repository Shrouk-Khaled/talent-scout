"use client"

import styles from "./page.module.scss";
import Hero from "@/components/home/hero/Hero";
import KnowUs from "@/components/home/knowUs/KnowUs";
import Features from "@/components/home/features/Features";
import Talents from "@/components/home/talents/Talents";
import HowToStart from "@/components/home/howToStart/HowToStart";
import Packages from "@/components/home/packages/Packages";
import Questions from "@/components/home/questions/Questions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('user-data'));
    const token = data?.state?.token;
    if (token) router.replace('/feed');
  }, [router]);

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
