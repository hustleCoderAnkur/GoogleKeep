interface ToolButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick: () => void;
    disabled?: boolean;
    label: string;
}

function ToolButton({ icon: Icon, onClick, disabled = false, label }: ToolButtonProps) {
        return (
            <button
                onClick={onClick}
                disabled={disabled}
                className={`p-2 rounded-full transition-colors ${disabled
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-200 hover:bg-opacity-10 cursor-pointer"
                    }`}
                title={label}
            >
                <Icon size={18} className="text-gray-600" />
            </button>
        );
}
    export default ToolButton