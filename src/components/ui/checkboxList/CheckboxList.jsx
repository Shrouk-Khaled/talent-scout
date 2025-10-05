"use client";

import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox } from "antd";
import styles from "./CheckboxList.module.scss";

export default function CheckboxList({
  title,
  options,
  value,
  defaultValue,
  onChange,
  className = "",
  maxVisible = 3,
  moreLabel = "رؤية المزيد", 
  lessLabel = "رؤية أقل",
}) {
  const controlled = value !== undefined;
  const [inner, setInner] = useState(new Set(defaultValue ?? []));
  const selected = useMemo(
    () => (controlled ? new Set(value) : inner),
    [controlled, value, inner]
  );

  // expanded/collapsed state
  const [expanded, setExpanded] = useState(false);

  const toggle = (val, checked) => {
    const next = new Set(selected);
    if (checked) next.add(val);
    else next.delete(val);
    const arr = Array.from(next);
    if (!controlled) setInner(next);
    onChange?.(arr);
  };

  const hasOverflow = options?.length > maxVisible;
  const visibleOptions =
    expanded || !hasOverflow ? options : options.slice(0, maxVisible);
  const hiddenCount = hasOverflow ? options.length - maxVisible : 0;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {title && <div className={styles.title}>{title}</div>}

      <div
        className={`${styles.list} ${
          !expanded && hasOverflow ? styles.collapsed : ""
        }`}
      >
        {visibleOptions?.map((opt) => {
          const checked = selected.has(opt.value);
          return (
            <label key={String(opt.value)} className={styles.item}>
              <Checkbox
                checked={checked}
                disabled={opt.disabled}
                onChange={(e) => toggle(opt.value, e.target.checked)}
              />
              <span className={styles.text}>{opt.label}</span>
            </label>
          );
        })}
      </div>

      {hasOverflow && (
        <button
          type="button"
          className={styles.moreBtn}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded
            ? lessLabel
            : `${moreLabel}${hiddenCount > 0 ? ` (${hiddenCount})` : ""}`}
        </button>
      )}
    </div>
  );
}

CheckboxList.propTypes = {
  title: PropTypes.node,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  defaultValue: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onChange: PropTypes.func,
  className: PropTypes.string,
  maxVisible: PropTypes.number,
  moreLabel: PropTypes.string,
  lessLabel: PropTypes.string,
};
