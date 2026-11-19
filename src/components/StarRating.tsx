'use client';

import React, { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const activeRating = hoverValue !== null ? hoverValue : value;

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    setHoverValue(starIndex + (isHalf ? 0.5 : 1.0));
  };

  return (
    <div 
      className="inline-flex items-center gap-1 select-none"
      onMouseLeave={() => !readOnly && setHoverValue(null)}
      role={readOnly ? 'img' : 'slider'}
      aria-label={`Valutazione: ${activeRating} su 5 stelle`}
      aria-valuemin={0}
      aria-valuemax={5}
      aria-valuenow={activeRating}
    >
      {[0, 1, 2, 3, 4].map((index) => {
        const fillAmount = Math.max(0, Math.min(1, activeRating - index));

        return (
          <div
            key={index}
            className={`relative cursor-${readOnly ? 'default' : 'pointer'} transition-transform active:scale-90`}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={() => !readOnly && onChange?.(hoverValue ?? (index + 1))}
          >
            <svg
              className={`${starSizes[size]} text-neutral-800 transition-colors`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>

            {fillAmount > 0 && (
              <div
                className="absolute top-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${fillAmount * 100}%` }}
              >
                <svg
                  className={`${starSizes[size]} text-[#F2A900] drop-shadow-[0_0_8px_rgba(242,169,0,0.5)]`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      <span className="ml-1.5 font-mono text-xs font-semibold text-neutral-400">
        {activeRating > 0 ? activeRating.toFixed(1) : '—'}
      </span>
    </div>
  );
};