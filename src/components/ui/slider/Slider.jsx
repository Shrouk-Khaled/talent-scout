'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useState } from 'react';
import styles from './Slider.module.scss';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useLocale } from 'next-intl';

const Slider = ({
  children,
  title,
  viewAllText = '',
  viewAllLink,
  variant = 'default', // 'default' or 'categories'
  showArrows = true,
  showViewAll = true,
  arrowPosition = 'top', // 'top' or 'side'
  className = '',
  slidesPerView = 'auto',
  spaceBetween = 15,
  autoplay = false,
  loop = false,
  pagination = false,
  breakpoints,
  onViewAllClick,
  ...swiperProps
}) => {
  const locale = useLocale();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const rtl = locale === 'ar';

  // Handle swiper state
  const handleSwiper = (swiper) => {
    setSwiperInstance(swiper);
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const handleViewAll = (e) => {
    if (onViewAllClick) {
      e.preventDefault();
      onViewAllClick();
    }
  };

  // Default breakpoints based on variant
  const defaultBreakpoints = variant === 'categories' 
    ? {
        320: { slidesPerView: 3.5, spaceBetween: 8 },
        480: { slidesPerView: 4.5, spaceBetween: 10 },
        640: { slidesPerView: 5.5, spaceBetween: 12 },
        768: { slidesPerView: 6.5, spaceBetween: 12 },
        1024: { slidesPerView: 7.5, spaceBetween: 12 },
        1280: { slidesPerView: 8.5, spaceBetween: 12 },
      }
    : {
        320: { slidesPerView: 1.2, spaceBetween: 12 },
        480: { slidesPerView: 1.5, spaceBetween: 14 },
        640: { slidesPerView: 2, spaceBetween: 14 },
        768: { slidesPerView: 2.5, spaceBetween: 16 },
        1024: { slidesPerView: 3, spaceBetween: 16 },
        1280: { slidesPerView: 3.5, spaceBetween: 16 },
      };

  return (
    <div 
      className={`${styles.sliderWrapper} ${styles[variant]} ${className}`} 
      dir={rtl ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      {(title || showViewAll || (showArrows && arrowPosition === 'top')) && (
        <div className={styles.header}>
          <div className={styles.titleSection}>
            {title && <h2 className={styles.title}>{title}</h2>}
            
            {showArrows && arrowPosition === 'top' && (
              <div className={styles.arrowsTop}>
                <button
                  className={`${styles.arrow} ${styles.arrowLeft} ${isBeginning ? styles.disabled : ''}`}
                  onClick={handlePrev}
                  disabled={isBeginning}
                  aria-label={rtl ? 'السابق' : 'Previous'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className={`${styles.arrow} ${styles.arrowRight} ${isEnd ? styles.disabled : ''}`}
                  onClick={handleNext}
                  disabled={isEnd}
                  aria-label={rtl ? 'التالي' : 'Next'}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {showViewAll && (
            <a 
              href={viewAllLink || '#'} 
              className={styles.viewAll}
              onClick={handleViewAll}
            >
              {viewAllText}
            </a>
          )}
        </div>
      )}

      {/* Swiper Container */}
      <div className={styles.swiperContainer}>
        {showArrows && arrowPosition === 'side' && !isBeginning && (
          <button
            className={`${styles.arrow} ${styles.arrowSideLeft}`}
            onClick={handlePrev}
            aria-label={rtl ? 'السابق' : 'Previous'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          dir={rtl ? 'rtl' : 'ltr'}
          autoplay={autoplay ? { delay: 3000, disableOnInteraction: false } : false}
          loop={loop}
          pagination={pagination ? { clickable: true } : false}
          breakpoints={breakpoints}
          onSwiper={handleSwiper}
          onSlideChange={handleSlideChange}
          className={styles.swiper}
          {...swiperProps}
        >
          {Array.isArray(children) ? (
            children.map((child, index) => (
              <SwiperSlide key={index} className={styles.swiperSlide}>
                {child}
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide className={styles.swiperSlide}>
              {children}
            </SwiperSlide>
          )}
        </Swiper>

        {showArrows && arrowPosition === 'side' && !isEnd && (
          <button
            className={`${styles.arrow} ${styles.arrowSideRight}`}
            onClick={handleNext}
            aria-label={rtl ? 'التالي' : 'Next'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Slider;