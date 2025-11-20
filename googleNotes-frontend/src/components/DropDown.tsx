import { useRef, useEffect } from "react";


interface DropdownProps {
    children: React.ReactNode;
    onClose: () => void;
}

interface DropdownItemProps {
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    children: React.ReactNode;
    onClick?: () => void;
}

function Dropdown({ children, onClose }: DropdownProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [onClose]);

    return (
        <div
            ref={ref}
            className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-xl z-50"
        >
            {children}
        </div>
    );
}

function DropdownItem({ icon: Icon, children, onClick }: DropdownItemProps) {
    return (
        <button
            onClick={onClick}   // <-- ADDED THIS
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
        >
            {Icon && <Icon size={16} className="text-gray-600" />}
            {children}
        </button>
    );
}

export {
    Dropdown,
    DropdownItem
};