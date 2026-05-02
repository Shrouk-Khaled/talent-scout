"use client"
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallbackPage() {
    const saveUserData = useUserStore((state) => state.setUserData);
    const router = useRouter();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const res = JSON.parse(urlParams.get("data"));
        console.log(res);
        // const token = urlParams.get("token");
        // const user = urlParams.get("user");

        // if (token) {
        //     localStorage.setItem("token", token);
        //     const userData = JSON.parse(decodeURIComponent(user));
        //     saveUserData({ access_token: token, ...userData });
        //     window.location.href = "/feed";
        // } else {
        //     window.location.href = "/auth/login";
        // }

        if(res?.token_response?.access_token) {
            saveUserData(res?.token_response);
            router.push("/feed")
        } else {
            email = res?.user?.email || "";
            router.push(`/auth/signup?userId=${encodeURIComponent(res?.user?.id)}&email=${encodeURIComponent(email)}`);
        }
    }
    , []);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>جاري تسجيل الدخول...</h2>
        </div>
    );
    }
