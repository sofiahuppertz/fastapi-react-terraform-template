import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 rounded-2xl shadow-smflex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-satoshi';
  
  const variants = {
    primary: 'bg-teal-200 hover:bg-teal-300 text-white shadow-sm',
    secondary: 'bg-white hover:bg-grey-50 text-grey-500 border border-grey-100 shadow-sm',
    danger: 'bg-red-200 hover:bg-red-300 text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}