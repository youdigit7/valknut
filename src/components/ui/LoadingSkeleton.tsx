import React from 'react';

export interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'image' | 'avatar' | 'rect';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'rect',
  width,
  height,
  className = '',
  count = 1,
}) => {
  const baseClasses = 'bg-[#151824] animate-pulse rounded-[2px] border border-white/5';

  const renderSingle = (key: number) => {
    if (variant === 'card') {
      return (
        <div key={key} className="space-y-3">
          <div className="w-full aspect-[3/4] bg-[#151824] animate-pulse rounded-[2px] border border-white/5" />
          <div className="h-4 bg-[#151824] animate-pulse rounded-[2px] w-3/4" />
          <div className="h-3 bg-[#151824] animate-pulse rounded-[2px] w-1/2" />
        </div>
      );
    }

    if (variant === 'text') {
      return (
        <div
          key={key}
          className={`${baseClasses} h-4 ${width || 'w-full'} ${className}`}
        />
      );
    }

    if (variant === 'avatar') {
      return (
        <div
          key={key}
          className={`${baseClasses} rounded-full ${width || 'w-10'} ${
            height || 'h-10'
          } ${className}`}
        />
      );
    }

    if (variant === 'image') {
      return (
        <div
          key={key}
          className={`${baseClasses} aspect-[3/4] w-full ${className}`}
        />
      );
    }

    return (
      <div
        key={key}
        style={{ width, height }}
        className={`${baseClasses} ${width ? '' : 'w-full'} ${
          height ? '' : 'h-12'
        } ${className}`}
      />
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => renderSingle(idx))}
    </>
  );
};
