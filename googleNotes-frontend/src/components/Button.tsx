import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    hover?: string;
    rounded?: string;
    transition?: string;
}

function Button({
    children,
    type = 'button',
    hover = 'hover:bg-gray-100',
    rounded = 'rounded-full',
    transition = 'transition',
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`p-3 ${hover} ${rounded} ${transition} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;