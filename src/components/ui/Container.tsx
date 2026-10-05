import React from 'react';
import { Container as MuiContainer } from '@mui/material';
import type { ContainerProps as MuiContainerProps } from '@mui/material';

export interface ContainerProps extends Omit<MuiContainerProps, 'maxWidth'> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
  clean?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  clean = false,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-3xl 2xl:max-w-4xl',
    default: 'max-w-[1360px] 2xl:max-w-[1600px] 3xl:max-w-[1800px]',
    wide: 'max-w-[1520px] 2xl:max-w-[1800px] 3xl:max-w-[2100px]',
    full: 'max-w-full',
  }[size];

  const paddingClass = clean ? '!px-0' : 'px-3.5 sm:px-6 md:px-8 lg:px-10 2xl:px-14';

  return (
    <MuiContainer
      disableGutters
      maxWidth={false}
      className={`w-full mx-auto ${sizeClasses} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </MuiContainer>
  );
};
