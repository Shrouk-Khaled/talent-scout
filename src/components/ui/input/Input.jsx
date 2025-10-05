'use client';

import {useMemo, useState, useCallback, forwardRef} from 'react';
import PropTypes from 'prop-types';
import {useLocale} from 'next-intl';
import {FiX} from 'react-icons/fi';
import styles from './Input.module.scss';

const Input = forwardRef(function Input(
  {
    id,
    name,
    type = 'text',
    value,
    defaultValue = '',
    placeholder,
    label,
    hint,
    error,
    disabled = false,
    readOnly = false,
    required = false,
    autoFocus = false,
    size = 'md',        // 'sm' | 'md' | 'lg'
    fullWidth = true,
    clearable = false,
    prefix,
    suffix,
    onChange,
    onFocus,
    onBlur,
    onEnter,
    className = '',
    inputClassName = '',
    dir,                // force 'rtl' | 'ltr' (optional)
    ...rest
  },
  ref
) {
  const locale = useLocale();
  const isRTL = (dir ?? (locale === 'ar' ? 'rtl' : 'ltr')) === 'rtl';

  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const current = useMemo(() => (controlled ? value : inner), [controlled, value, inner]);

  const setVal = useCallback(
    (v) => {
      if (!controlled) setInner(v);
      onChange?.(v);
    },
    [controlled, onChange]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onEnter?.(current);
  };

  const clear = () => setVal('');

  return (
    <div className={`${styles.wrapper} ${styles[size]} ${fullWidth ? styles.full : ''} ${className}`}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label} {required ? <span className={styles.req}>*</span> : null}
        </label>
      )}

      <div
        className={[
          styles.control,
          isRTL ? styles.rtl : '',
          error ? styles.hasError : '',
          disabled ? styles.isDisabled : '',
        ].join(' ')}
      >
        {prefix ? <div className={styles.prefix}>{prefix}</div> : null}

        <input
          ref={ref}
          id={id}
          name={name}
          className={`${styles.input} ${inputClassName}`}
          type={type}
          dir={isRTL ? 'rtl' : 'ltr'}
          value={current}
          onChange={(e) => setVal(e.target.value)}
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

        {/* {clearable && !!current && !readOnly && !disabled ? (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={clear}
            aria-label={isRTL ? 'مسح' : 'Clear'}
          >
            <FiX />
          </button>
        ) : null} */}

        {suffix ? <div className={styles.suffix}>{suffix}</div> : null}
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}
      {!error && hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  );
});

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.node,
  hint: PropTypes.node,
  error: PropTypes.node,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  clearable: PropTypes.bool,
  prefix: PropTypes.node,
  suffix: PropTypes.node,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onEnter: PropTypes.func,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  dir: PropTypes.oneOf(['rtl', 'ltr']),
};

export default Input;
