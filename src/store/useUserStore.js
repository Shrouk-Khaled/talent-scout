"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      // userData:
      //   typeof window != undefined
      //     ? JSON.parse(localStorage.getItem("user-data"))?.state || null
      //     : null,
      userData: null,
      token: null,
      info: null,

      setUserData: (data) =>
        set({
          userData: data,
          token: data?.access_token,
        }),

      setUserInfo: (data) =>
        set({
          info: data,
        }),

      clearUserData: () =>
        set({
          userData: null,
        }),
    }),
    {
      name: "user-data",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
