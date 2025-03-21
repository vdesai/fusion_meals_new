import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  size = 'default', 
  className = '',
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-400",
    ghost: "hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-400",
    link: "text-blue-600 hover:underline focus-visible:ring-blue-600 p-0 h-auto",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-8 py-1 px-3 text-sm",
    lg: "h-12 py-3 px-6 text-lg",
  };
  
  const finalClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
};

export default Button; 