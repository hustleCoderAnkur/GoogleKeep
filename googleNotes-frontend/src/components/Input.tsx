import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    background?: string;
    outline?: string;
}

function Input({
    type = "text",
    background = "bg-transparent",
    outline = "outline-none",
    className = "",
    ...props
}: InputProps) {
    return (
        <input
            type={type}
            className={`${background} ${outline} w-full text-gray-700 ${className}`}
            {...props}
        />
    );
}

export default Input;
