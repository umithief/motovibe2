
import React from 'react';
import { useAppSounds } from '../hooks/useAppSounds';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disableSound?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled,
  disableSound = false,
  onClick,
  ...props 
}) => {
  const { playClick } = useAppSounds();
  
  // Added hover:scale-105 and maintained active:scale-95 for tactile feel
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 rounded-xl";
  
  const variants = {
    // Golden Yellow Primary (Dark Text for contrast)
    primary: "bg-moto-accent text-surface hover:bg-moto-accent-hover shadow-lg shadow-moto-accent/20 hover:shadow-moto-accent/40",
    
    // Dark Gray Secondary
    secondary: "bg-surface text-text-main hover:bg-surface-hover shadow-md border border-border",
    
    // Cyber/Gradient (Gold)
    cyber: "bg-gradient-to-r from-moto-accent to-yellow-400 text-surface hover:to-moto-accent shadow-lg",
    
    // Outline
    outline: "bg-transparent border-2 border-border text-text-muted hover:border-moto-accent hover:text-moto-accent hover:bg-moto-accent/10",
    
    // Ghost
    ghost: "bg-transparent text-text-muted hover:text-moto-accent hover:bg-moto-accent/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading && !disableSound) {
      playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      <span className={`flex items-center gap-2`}>
        {isLoading ? (
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </span>
    </button>
  );
};
