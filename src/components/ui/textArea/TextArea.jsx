"use client"

import styles from "./TextArea.module.scss";

export default function TextArea({
    id,
    name,
    value,
    defaultValue,
    placeholder,
    label,
    hint,
    error,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    rows = 4,
    maxLength,
    minLength,
    fullWidth = false,
    className = "",
    inputClassName = "",
    dir,
    onChange,
    onFocus,
    onBlur,
    onEnter,
    ...rest
    }) {
    const isRTL = dir === "rtl";
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && onEnter) {
        onEnter(e);
        }
    };
    
    return (
        <div className={styles.textArea}>
            <textarea
                id={id}
                name={name}
                value={value}
                defaultValue={defaultValue}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoFocus={autoFocus}
                rows={rows}
                maxLength={maxLength}
                minLength={minLength}
                className={`${styles.input} ${fullWidth ? styles.fullWidth : ""} ${isRTL ? styles.rtl : ""} ${inputClassName}`}
                dir={dir}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                onKeyDown={handleKeyDown}
                {...rest}
            />
        </div>
    );
    }