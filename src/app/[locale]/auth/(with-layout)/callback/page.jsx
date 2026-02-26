"use client"
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

export default function CallbackPage() {
    const saveUserData = useUserStore((state) => state.setUserData);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get("data"));
        const token = urlParams.get("token");
        const user = urlParams.get("user");

        if (token) {
            localStorage.setItem("token", token);
            const userData = JSON.parse(decodeURIComponent(user));
            saveUserData({ access_token: token, ...userData });
            window.location.href = "/feed";
        } else {
            window.location.href = "/auth/login";
        }
    }
    , []);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h2>جاري تسجيل الدخول...</h2>
        </div>
    );
    }
