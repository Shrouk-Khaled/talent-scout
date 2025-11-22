"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialSignupData = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  phone: "",
  age: "",
  country: "",
  city: "",
};

export const useSignupStore = create(
  persist(
    (set, get) => ({
      signupData: initialSignupData,

      updateSignupData: (partialData) =>
        set({
          signupData: {
            ...get().signupData,
            ...partialData,
          },
        }),

      resetSignup: () =>
        set({
          signupData: initialSignupData,
        }),
    }),
    {
      name: "signup-data",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
