'use client';

import { useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Dropdown } from 'antd';
import { LuChevronDown } from 'react-icons/lu';
import styles from './Language.module.scss';
import Image from 'next/image';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

const FLAG = {
  ar: (
    <Image
      className={styles.flagImg}
      src="/images/flags/sa.png"
      alt="🇸🇦"
      width={20}
      height={15}
    />
  ),
  en: (
    <Image
      className={styles.flagImg}
      src="/images/flags/gb.png"
      alt="🇬🇧"
      width={20}
      height={15}
    />
  ),
};

const LABEL = {
  ar: 'العربية',
  en: 'English',
};

export default function Language() {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const locale = useLocale();

  const switchLanguage = (nextLocale) => {
    if (!nextLocale || nextLocale === locale) return;

    const queryString = searchParams.toString();
    const href = queryString ? `${pathname}?${queryString}` : pathname;

    router.push(href, { locale: nextLocale });
  };

  const items = useMemo(
    () => [
      {
        key: 'ar',
        label: (
          <div className={styles.menuItem}>
            <span className={styles.menuLabel}>العربية</span>
            <span className={styles.menuFlag}>{FLAG.ar}</span>
          </div>
        ),
        onClick: () => switchLanguage('ar'),
      },
      {
        key: 'en',
        label: (
          <div className={styles.menuItem}>
            <span className={styles.menuLabel}>English</span>
            <span className={styles.menuFlag}>{FLAG.en}</span>
          </div>
        ),
        onClick: () => switchLanguage('en'),
      },
    ],
    [pathname, searchParams, locale]
  );

  const isRTL = locale === 'ar';

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <button
        type="button"
        className={`${styles.trigger} ${isRTL ? styles.rtl : ''}`}
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <LuChevronDown className={styles.chev} aria-hidden />
        <span className={styles.label}>{LABEL[locale]}</span>
        <span className={styles.flag}>{FLAG[locale]}</span>
      </button>
    </Dropdown>
  );
}