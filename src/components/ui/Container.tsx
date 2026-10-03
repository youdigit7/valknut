import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
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
    narrow: 'max-w-3xl',
    default: 'max-w-[1360px]',
    wide: 'max-w-[1520px]',
    full: 'max-w-full',
  }[size];

  const paddingClass = clean ? '' : 'px-5 sm:px-8 lg:px-10';

  return (
    <div
      className={`w-full mx-auto ${sizeClasses} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
