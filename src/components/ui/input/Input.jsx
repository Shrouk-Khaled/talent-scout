'use client';

import {useMemo, useState, useCallback, forwardRef} from 'react';
import {useLocale} from 'next-intl';
import styles from './Input.module.scss';

const Input = forwardRef(function Input(props, ref) {
  const {
    id, name, type = 'text',
    value,          // لو متحكم فيه من برّا
    defaultValue = '',
    placeholder, label, hint, error,
    disabled = false, readOnly = false, required = false, autoFocus = false,
    size = 'md', fullWidth = true, clearable = false, prefix, suffix,
    onChange, onFocus, onBlur, onEnter,
    className = '', inputClassName = '',
    BoxStyle,
    dir, ...rest
  } = props;

  const locale = useLocale();
  const isRTL = (dir ?? (locale === 'ar' ? 'rtl' : 'ltr')) === 'rtl';

  // controlled لو فيه value، غير كده uncontrolled
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);

  // القيمة الفعلية دايمًا string ('' بدل undefined)
  const current = useMemo(() => (controlled ? value : inner) ?? '', [controlled, value, inner]);

  const handleChange = useCallback((e) => {
    const v = e?.target?.value ?? '';
    if (!controlled) setInner(v);   // خزّن داخليًا لو مش controlled
    onChange?.(e);                  // مهم: رجّع الحدث لـ AntD
  }, [controlled, onChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onEnter?.(current);
  };

  return (
    <div className={`${styles.wrapper} ${styles[size]} ${fullWidth ? styles.full : ''} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required ? <span className={styles.req}>*</span> : null}
        </label>
      )}

      <div className={[
        styles.control,
        isRTL ? styles.rtl : '',
        error ? styles.hasError : '',
        disabled ? styles.isDisabled : '',
      ].join(' ')} style={BoxStyle}>
        {prefix ? <div className={styles.prefix}>{prefix}</div> : null}

        <input
          ref={ref}
          id={id}
          name={name}
          className={`${styles.input} ${inputClassName}`}
          type={type}
          dir={isRTL ? 'rtl' : 'ltr'}
          value={current}             
          onChange={handleChange}      
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          {...rest}
        />

        {suffix ? <div className={styles.suffix}>{suffix}</div> : null}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}
      {!error && hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
});
export default Input;
