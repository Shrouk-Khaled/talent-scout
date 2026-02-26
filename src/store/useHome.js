"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useHomeStore = create(
  persist(
    (set, get) => ({
      categories: [],

      setHomeData: (data) =>
        set({
          categories: data?.categories
        }),

      clearHomeData: () =>
        set({
            categories: null,
        }),
    }),
    {
      name: "home-data",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
