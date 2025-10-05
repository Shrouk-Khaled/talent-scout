"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./Accordion.module.scss";

/**
 * items: [{ title, subtitle?, content (string | ReactNode) }]
 */
export default function Accordion({ items = [], defaultOpen = 0 }) {
  const [openIndex, setOpenIndex] = useState(
    typeof defaultOpen === "number" ? defaultOpen : -1
  );
  const contentRefs = useRef([]);

  // keep refs array length synced
  contentRefs.current = items.map((_, i) => contentRefs.current[i] ?? null);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024;
    // animate maxHeight for smooth collapse/expand
    items.forEach((_, i) => {
      const el = contentRefs.current[i];
      if (!el) return;
      if (i === openIndex) {
        // set to scrollHeight to allow transition
        el.style.maxHeight = el.scrollHeight + "px";
        el.style.paddingTop = isMobile ? '0px' : '16px';
        el.style.paddingBottom = "16px";
      } else {
        el.style.maxHeight = "0px";
        el.style.paddingTop = "0px";
        el.style.paddingBottom = "0px";
      }
    });
  }, [openIndex, items]);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    // dir="rtl" so Arabic is correct; you can remove if parent already sets it
    <div className={styles.accordion} dir="rtl" role="presentation">
      {items.map((item, idx) => {
        const isOpen = idx === openIndex;
        return (
          <div
            key={idx}
            className={`${styles.item} ${isOpen ? styles.open : ""}`}
          >
            <button
              id={`accordion-${idx}`}
              aria-controls={`panel-${idx}`}
              aria-expanded={isOpen}
              className={styles.header}
              onClick={() => toggle(idx)}
            >
              {/* arrow on the left */}

              <div className={styles.badge}>
                <span className={styles.num}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.titleBlock}>
                <p className={styles.title}>{item.title}</p>
              </div>
              <span className={styles.chev} aria-hidden>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <div
              ref={(el) => (contentRefs.current[idx] = el)}
              id={`panel-${idx}`}
              role="region"
              aria-labelledby={`accordion-${idx}`}
              className={styles.panel}
            >
              <div className={styles.panelInner}>
                {typeof item.content === "string" ? (
                  <p>{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
