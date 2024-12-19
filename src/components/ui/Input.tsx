import React from 'react';
import { cn } from '../../utils/cn';

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "block w-full rounded-lg border-gray-300 shadow-sm",
        "focus:border-blue-500 focus:ring-blue-500",
        "disabled:bg-gray-50 disabled:text-gray-500",
        className
      )}
      {...props}
    />
  );
}