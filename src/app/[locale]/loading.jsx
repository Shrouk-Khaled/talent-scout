"use client"

import Lottie from "lottie-react";
import sparkelsAnimation from "@/animations/sparkels.json";

export default function Loading() {
  return (
    <div className="global-loader">
      <div className="global-loader__content">
        <Lottie
          animationData={sparkelsAnimation}
          loop
          autoplay
          className="global-loader__animation"
        />
      </div>
    </div>
  );
}
