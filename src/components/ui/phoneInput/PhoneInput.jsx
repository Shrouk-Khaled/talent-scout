"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./PhoneInput.module.scss";

const ReactPhoneInput = dynamic(
  () => import("react-phone-input-2").then((m) => m.default),
  { ssr: false }
);

const restLen = (v, dialCode) => {
  const digits = (v ?? "").replace(/\D/g, "");
  const dial = (dialCode ?? "").replace(/\D/g, "");
  if (!digits) return 0;
  return digits.startsWith(dial) ? digits.slice(dial.length).length : digits.length;
};

export default function PhoneInput({
  value,
  onChange,
  placeholder = "رقم الجوال",
  defaultCountry = "sa",
  required = false,
  error = "",
  className = "",
  preferredCountries = ["sa", "ae", "eg", "kw", "qa", "bh", "om"],
}) {
  const [val, setVal] = useState(value ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const [hasUserInput, setHasUserInput] = useState(false);
  const lastDialRef = useRef("");
  const inputId = useId();

  useEffect(() => {
    if (typeof value === "string") {
      setVal(value);
      setHasUserInput(restLen(value, lastDialRef.current) > 0);
    }
  }, [value]);

  const extractPhoneParts = (v, dialCode) => {
    const digits = (v ?? "").replace(/\D/g, "");    
    const dial = (dialCode ?? "").replace(/\D/g, "");
  
    if (!digits) {
      return {
        countryCode: dial ? `+${dial}` : "",
        localNumber: "",
      };
    }
  
    if (dial && digits.startsWith(dial)) {
      return {
        countryCode: `+${dial}`,              // +20
        localNumber: digits.slice(dial.length), // 1123232323
      };
    }
  
    return {
      countryCode: dial ? `+${dial}` : "",
      localNumber: digits,
    };
  };
  

  const handleChange = (v, data, _e, formattedValue) => {
    setVal(v);
  
    const dial = data?.dialCode ?? "";
    lastDialRef.current = dial;
  
    const { countryCode, localNumber } = extractPhoneParts(v, dial);
  
    setHasUserInput(localNumber.length > 0);
    // const x = {
    //   value: v,          
    //   countryCode,         
    //   localNumber,       
    //   fullNumber: `${countryCode}${localNumber}`, 
    //   data,
    //   formattedValue,
    // }
    // console.log(x);
  
    onChange?.({
      countryCode,          
      localNumber,         
    });
  };

  const handleBlur = () => {
    setIsFocused(false);
    const has = restLen(val, lastDialRef.current) > 0;
    if (hasUserInput !== has) setHasUserInput(has);
  };
  return (
    <div
      className={[styles.wrapper, error ? styles.hasError : "", className || ""].join(" ")}
      dir="ltr"
    >
      {/* <label
        dir="rtl"
        htmlFor={inputId}
        className={[
          styles.label,
          (isFocused || hasUserInput) ? styles.floated : "",
          error ? styles.labelError : "",
        ].join(" ")}
      >
        {placeholder}
        {required ? <span className={styles.req}> *</span> : null}
      </label> */}

      <ReactPhoneInput
        country={defaultCountry}
        value={val}
        onChange={handleChange}
        enableSearch
        searchPlaceholder="ابحث باسم الدولة أو كود الاتصال"
        enableAreaCodes
        disableDropdown={false}
        countryCodeEditable={false}
        placeholder=""
        preferredCountries={preferredCountries}
        containerClass={styles.container}
        inputClass={styles.input}
        buttonClass={styles.button}
        dropdownClass={styles.dropdown}
        autoFormat
        inputProps={{
          id: inputId,
          name: "phone",
          required,
          "aria-label": "Phone number",
          autoComplete: "tel",
          onFocus: () => setIsFocused(true),
          onBlur: handleBlur,
          onInput: (e) => {
            const v = e?.target?.value ?? val;
            const has = restLen(v, lastDialRef.current) > 0;
            if (hasUserInput !== has) setHasUserInput(has);
          },
        }}
      />

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
