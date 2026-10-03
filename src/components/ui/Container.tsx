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
    narrow: 'max-w-3xl 2xl:max-w-4xl',
    default: 'max-w-[1360px] 2xl:max-w-[1600px] 3xl:max-w-[1800px]',
    wide: 'max-w-[1520px] 2xl:max-w-[1800px] 3xl:max-w-[2100px]',
    full: 'max-w-full',
  }[size];

  const paddingClass = clean ? '' : 'px-3.5 sm:px-6 md:px-8 lg:px-10 2xl:px-14';

  return (
    <div
      className={`w-full mx-auto ${sizeClasses} ${paddingClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
