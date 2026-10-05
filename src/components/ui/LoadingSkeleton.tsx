import React from 'react';
import { Skeleton, Box } from '@mui/material';

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
  const baseClasses = 'bg-[#151824] rounded-[2px] border border-white/5';

  const renderSingle = (key: number) => {
    if (variant === 'card') {
      return (
        <Box key={key} className="space-y-3">
          <Skeleton variant="rectangular" className={`${baseClasses} w-full aspect-[3/4]`} sx={{ bgcolor: '#151824' }} />
          <Skeleton variant="text" className={`${baseClasses} h-4 w-3/4`} sx={{ bgcolor: '#151824' }} />
          <Skeleton variant="text" className={`${baseClasses} h-3 w-1/2`} sx={{ bgcolor: '#151824' }} />
        </Box>
      );
    }

    if (variant === 'text') {
      return (
        <Skeleton
          key={key}
          variant="text"
          className={`${baseClasses} h-4 ${width || 'w-full'} ${className}`}
          sx={{ bgcolor: '#151824' }}
        />
      );
    }

    if (variant === 'avatar') {
      return (
        <Skeleton
          key={key}
          variant="circular"
          className={`${baseClasses} ${width || 'w-10'} ${height || 'h-10'} ${className}`}
          sx={{ bgcolor: '#151824' }}
        />
      );
    }

    if (variant === 'image') {
      return (
        <Skeleton
          key={key}
          variant="rectangular"
          className={`${baseClasses} aspect-[3/4] w-full ${className}`}
          sx={{ bgcolor: '#151824' }}
        />
      );
    }

    return (
      <Skeleton
        key={key}
        variant="rectangular"
        width={width}
        height={height || 48}
        className={`${baseClasses} ${width ? '' : 'w-full'} ${className}`}
        sx={{ bgcolor: '#151824' }}
      />
    );
  };

  return (
    <>
      {Array.from({ length: count }).map((_, idx) => renderSingle(idx))}
    </>
  );
};
