import React from 'react';
import { useMotorDebounce } from '../../hooks/useMotorDebounce';

export interface DebouncedTouchableProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onPress?: () => void;
  debounceMs?: number;
  activeScale?: boolean;
  minTouchSize?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const DebouncedTouchable: React.FC<DebouncedTouchableProps> = ({
  onPress,
  debounceMs = 300,
  activeScale = true,
  minTouchSize = 'md',
  className = '',
  children,
  onClick,
  disabled,
  ...props
}) => {
  const handleDebouncedPress = useMotorDebounce(() => {
    if (disabled) return;
    if (onPress) {
      onPress();
    }
  }, debounceMs);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    handleDebouncedPress();
    if (onClick) {
      onClick(e);
    }
  };

  const minSizeClass = {
    sm: 'min-h-[44px] min-w-[44px]',
    md: 'min-h-[48px] min-w-[48px]',
    lg: 'min-h-[64px] min-w-[64px]',
  }[minTouchSize];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center font-medium rounded-xl select-none
        transition-all duration-150 ease-out focus:outline-none focus:ring-4 focus:ring-blue-400/50
        touch-manipulation cursor-pointer
        ${activeScale ? 'active:scale-95 active:brightness-90' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${minSizeClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
