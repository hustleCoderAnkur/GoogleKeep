interface FormatButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
}

function FormatButton({ icon: Icon, label }: FormatButtonProps) {
    return (
        <button
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title={label}
        >
            <Icon size={18} className="text-gray-700" />
        </button>
    );
}

export default FormatButton