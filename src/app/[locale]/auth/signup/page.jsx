"use client"
import Image from "next/image";
import styles from "./page.module.scss";
import { Progress } from "antd";
import StepOne from "@/components/signup/stepone/StepOne";
import { useRouter, useSearchParams } from "next/navigation";
import StepTwo from "@/components/signup/steptwo/StepTwo";
import { useEffect, useState } from "react";
import StepThree from "@/components/signup/stepThree/StepThree";
import StepFour from "@/components/signup/stepFour/StepFour";
import StepFive from "@/components/signup/stepFive/StepFive";
import StepTwoResearcher from "@/components/signup/stepTwoResercher/StepTwoResearcher";
import Language from "../../../../components/common/language/Language";

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const step = searchParams.get("step") || "1";
    const user_role = searchParams.get("user_role");
    const user_type = searchParams.get("user_type");
    const [currentStep, setCurrentStep] = useState(step);
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        setCurrentStep(step);
        handleProgressChange();
    }, [step]);

    const handleProgressChange = () => {
        if (step === "1") {
            setProgressPercent(20);
        } else if (step === "2") {
            if(user_role === "2"){
                setProgressPercent(70);
            } else {
                setProgressPercent(40);
            }
        } else if (step === "3") {
            if(user_role === "2"){
                setProgressPercent(100);
            } else {
                setProgressPercent(60);
            }
        } else if (step === "4") {
            setProgressPercent(80)
        } else if (step === "5") {
            setProgressPercent(100);
        }
    }

    return (
        <div className={styles.mainPage}>
            <header>
                <Image src="/images/logo.png" alt="Logo" width={200} height={60} onClick={() => {
                    router.push("/")
                }} className={styles.logo}/>
                <h4>
                    الخطوة {currentStep} {currentStep > 1 && "/"} {currentStep > 1 ? (user_role === "2" ? 3 : 5) : ''}
                </h4>
                <Language />
            </header>
            <div className={styles.progress}>
                <Progress
                    percent={progressPercent}
                    showInfo={false}
                    size={"small"}
                    trailColor="#F3F3F3"
                    strokeColor={"#EE1D70"}
                />
            </div>
            <div className={styles.main}>
                {currentStep === "1" && <StepOne />}
                {currentStep === "2" && (user_type === "2" ? <StepTwoResearcher/> : <StepTwo/>)}
                {currentStep === "3" && <StepThree/>}
                {currentStep === "4" && <StepFour/>}
                {currentStep === "5" && <StepFive/>}
            </div>
        </div>
    );
}
