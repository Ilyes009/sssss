import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const Button = ({ 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled,
  children,
  ...props 
}: ButtonProps) => {
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg font-medium transition-all",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        {
          'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500': variant === 'primary',
          'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500': variant === 'success',
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
        },
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };