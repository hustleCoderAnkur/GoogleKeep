import {
    Bell,
    Clock,
    MoreVertical,
    Archive,
    Image,
    ImagePlus,
    MapPin,
    Palette,
    Pin,
    Redo2,
    X,
    CheckSquare,
    Brush,
    Undo2,
    User,
    UserPlus,
    Type,
    Heading1,
    Heading2,
    CaseSensitive,
    Bold,
    Italic,
    Underline,
    RemoveFormatting,
    Check,
    Plus,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface ListItem {
    id: string;
    text: string;
    checked: boolean;
}

interface ToolButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    onClick: () => void;
    disabled?: boolean;
    label: string;
}

interface DropdownProps {
    children: React.ReactNode;
    onClose: () => void;
}

interface DropdownItemProps {
    icon?: React.ComponentType<{ size?: number; className?: string }>;
    children: React.ReactNode;
}

interface FormatButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
}

interface ColorOption {
    name: string;
    bgClass: string;
    borderClass: string;
    hex: string;
}

function NoteCreate() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [title, setTitle] = useState("");
    const [bgColor, setBgColor] = useState("bg-white");

    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isTextFormatOpen, setIsTextFormatOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);

    const [history, setHistory] = useState<string[]>([""]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [showArchived, setShowArchived] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    const colors: ColorOption[] = [
        { name: 'Default', bgClass: 'bg-white', borderClass: 'border-gray-300', hex: '#ffffff' },
        { name: 'Red', bgClass: 'bg-red-100', borderClass: 'border-red-200', hex: '#fee2e2' },
        { name: 'Orange', bgClass: 'bg-orange-100', borderClass: 'border-orange-200', hex: '#ffedd5' },
        { name: 'Yellow', bgClass: 'bg-yellow-100', borderClass: 'border-yellow-200', hex: '#fef9c3' },
        { name: 'Green', bgClass: 'bg-green-100', borderClass: 'border-green-200', hex: '#dcfce7' },
        { name: 'Teal', bgClass: 'bg-teal-100', borderClass: 'border-teal-200', hex: '#ccfbf1' },
        { name: 'Blue', bgClass: 'bg-blue-100', borderClass: 'border-blue-200', hex: '#dbeafe' },
        { name: 'Purple', bgClass: 'bg-purple-100', borderClass: 'border-purple-200', hex: '#f3e8ff' },
        { name: 'Pink', bgClass: 'bg-pink-100', borderClass: 'border-pink-200', hex: '#fce7f3' },
        { name: 'Gray', bgClass: 'bg-gray-100', borderClass: 'border-gray-300', hex: '#f3f4f6' },
    ];

    const handleInput = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            const content = editorRef.current?.innerHTML || "";
            if (content !== history[historyIndex]) {
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(content);

                if (newHistory.length > 50) {
                    newHistory.shift();
                } else {
                    setHistoryIndex(prev => prev + 1);
                }
                setHistory(newHistory);
            }
        }, 300);
    }, [history, historyIndex]);

    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            const prevIndex = historyIndex - 1;
            setHistoryIndex(prevIndex);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[prevIndex];
            }
        }
    }, [historyIndex, history]);

    const handleRedo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const nextIndex = historyIndex + 1;
            setHistoryIndex(nextIndex);
            if (editorRef.current) {
                editorRef.current.innerHTML = history[nextIndex];
            }
        }
    }, [historyIndex, history]);

    const handleArchive = () => {
        setShowArchived(true);
        setTimeout(() => {
            setShowArchived(false);
            handleClose();
        }, 2000);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    return;
                }
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        setImages((prev) => [...prev, event.target?.result as string]);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleColorSelect = (color: ColorOption) => {
        setBgColor(color.bgClass);
        setIsColorOpen(false);
    };

    const handleClose = () => {
        const trimmedTitle = title.trim();
        const trimmedContent = editorRef.current?.textContent?.trim() || "";

        if (trimmedTitle || trimmedContent || images.length > 0) {
            console.log('Saving note:', { title: trimmedTitle, content: trimmedContent, images, isPinned, bgColor });
        }

        setIsExpanded(false);
        setTitle("");
        setIsPinned(false);
        setBgColor("bg-white");
        setImages([]);
        setHistory([""]);
        setHistoryIndex(0);
        setIsReminderOpen(false);
        setIsCollaboratorOpen(false);
        setIsMoreMenuOpen(false);
        setIsTextFormatOpen(false);
        setIsColorOpen(false);
        if (editorRef.current) editorRef.current.innerHTML = "";
    };

    const closeAllDropdowns = () => {
        setIsReminderOpen(false);
        setIsCollaboratorOpen(false);
        setIsMoreMenuOpen(false);
        setIsTextFormatOpen(false);
        setIsColorOpen(false);
    };

    const getCurrentBorderClass = () => {
        const currentColor = colors.find(c => c.bgClass === bgColor);
        return currentColor ? currentColor.borderClass : 'border-gray-300';
    };

    if (!isExpanded) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16">
                <div className="w-full max-w-2xl px-4">
                    <div
                        onClick={() => setIsExpanded(true)}
                        className="flex items-center justify-between cursor-text bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow"
                    >
                        <p className="text-gray-600 text-base">Take a note...</p>
                        <div className="flex items-center gap-4">
                            <button onClick={()=>List} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="New list">
                                <CheckSquare size={20} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="New note with drawing">
                                <Brush size={20} className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="New note with image">
                                <ImagePlus size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-16">
            <div className="w-full max-w-2xl px-4">
                <div ref={containerRef} className={`relative ${bgColor} border ${getCurrentBorderClass()} rounded-lg shadow-lg transition-colors`}>
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className="absolute top-3 right-3 p-2 hover:bg-gray-200 hover:bg-opacity-10 rounded-full transition-colors z-10"
                        title={isPinned ? "Unpin note" : "Pin note"}
                    >
                        <Pin size={18} className={`${isPinned ? "fill-gray-700" : ""} text-gray-600`} />
                    </button>

                    <div className="p-4 pb-3">
                        <input
                            ref={titleRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            className={`w-full text-base font-medium text-gray-800 placeholder-gray-500 outline-none mb-3 pr-10 ${bgColor} bg-transparent`}
                        />

                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            onInput={handleInput}
                            className="w-full min-h-[60px] text-sm text-gray-800 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500"
                            data-placeholder="Take a note..."
                        />

                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative group">
                                        <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-gray-500 bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-2 py-2 border-t border-gray-200 border-opacity-60">
                        <div className="flex items-center relative">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <div className="relative">
                                <ToolButton
                                    icon={Type}
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setIsTextFormatOpen(!isTextFormatOpen);
                                    }}
                                    label="Text formatting"
                                />
                                {isTextFormatOpen && (
                                    <Dropdown onClose={() => setIsTextFormatOpen(false)}>
                                        <div className="p-2">
                                            <div className="flex items-center gap-1 mb-2 pb-2 border-b border-gray-200">
                                                <FormatButton icon={Heading1} label="Heading 1" />
                                                <FormatButton icon={Heading2} label="Heading 2" />
                                                <FormatButton icon={CaseSensitive} label="Normal text" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <FormatButton icon={Bold} label="Bold" />
                                                <FormatButton icon={Italic} label="Italic" />
                                                <FormatButton icon={Underline} label="Underline" />
                                                <FormatButton icon={RemoveFormatting} label="Remove formatting" />
                                            </div>
                                        </div>
                                    </Dropdown>
                                )}
                            </div>

                            <div className="relative">
                                <ToolButton
                                    icon={Bell}
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setIsReminderOpen(!isReminderOpen);
                                    }}
                                    label="Remind me"
                                />
                                {isReminderOpen && (
                                    <Dropdown onClose={() => setIsReminderOpen(false)}>
                                        <div className="p-3 min-w-[280px]">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Remind me</h3>
                                            <p className="text-xs text-gray-500 mb-3">Saved in Google Reminders</p>
                                            <div className="space-y-1">
                                                <DropdownItem icon={Clock}>Later today, 8:00 PM</DropdownItem>
                                                <DropdownItem icon={Clock}>Tomorrow, 8:00 AM</DropdownItem>
                                                <DropdownItem icon={Clock}>Next week, Mon, 8:00 AM</DropdownItem>
                                                <DropdownItem icon={Clock}>Pick date & time</DropdownItem>
                                                <DropdownItem icon={MapPin}>Pick place</DropdownItem>
                                            </div>
                                        </div>
                                    </Dropdown>
                                )}
                            </div>

                            <div className="relative">
                                <ToolButton
                                    icon={UserPlus}
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setIsCollaboratorOpen(!isCollaboratorOpen);
                                    }}
                                    label="Collaborator"
                                />
                                {isCollaboratorOpen && (
                                    <Dropdown onClose={() => setIsCollaboratorOpen(false)}>
                                        <div className="p-4 min-w-[320px]">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Collaborators</h3>
                                            <div className="flex items-center gap-2 mb-3">
                                                <User size={20} className="text-gray-600" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">You (Owner)</p>
                                                    <p className="text-xs text-gray-500">user@example.com</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 border-t pt-3">
                                                <UserPlus size={20} className="text-gray-600" />
                                                <input
                                                    type="email"
                                                    placeholder="Person or email to share with"
                                                    className="flex-1 text-sm outline-none"
                                                />
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <button className="px-4 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                                <button className="px-4 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Save</button>
                                            </div>
                                        </div>
                                    </Dropdown>
                                )}
                            </div>

                            <div className="relative">
                                <ToolButton
                                    icon={Palette}
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setIsColorOpen(!isColorOpen);
                                    }}
                                    label="Background options"
                                />
                                {isColorOpen && (
                                    <Dropdown onClose={() => setIsColorOpen(false)}>
                                        <div className="p-3 min-w-[280px]">
                                            <h3 className="text-sm font-medium text-gray-700 mb-3">Background color</h3>
                                            <div className="grid grid-cols-5 gap-2">
                                                {colors.map((color) => (
                                                    <button
                                                        key={color.name}
                                                        onClick={() => handleColorSelect(color)}
                                                        className={`w-12 h-12 rounded-full ${color.bgClass} border-2 ${bgColor === color.bgClass
                                                            ? 'border-blue-500 ring-2 ring-blue-300'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                            } transition-all hover:scale-110 flex items-center justify-center`}
                                                        title={color.name}
                                                    >
                                                        {bgColor === color.bgClass && (
                                                            <Check size={18} className="text-gray-700" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Dropdown>
                                )}
                            </div>

                            <ToolButton
                                icon={Image}
                                onClick={() => fileInputRef.current?.click()}
                                label="Add image"
                            />
                            <ToolButton icon={Archive} onClick={handleArchive} label="Archive" />

                            <div className="relative">
                                <ToolButton
                                    icon={MoreVertical}
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setIsMoreMenuOpen(!isMoreMenuOpen);
                                    }}
                                    label="More"
                                />
                                {isMoreMenuOpen && (
                                    <Dropdown onClose={() => setIsMoreMenuOpen(false)}>
                                        <div className="py-2 min-w-[200px]">
                                            <DropdownItem>Delete note</DropdownItem>
                                            <DropdownItem>Add label</DropdownItem>
                                            <DropdownItem>Add drawing</DropdownItem>
                                            <DropdownItem>Make a copy</DropdownItem>
                                            <DropdownItem>Show checkboxes</DropdownItem>
                                            <DropdownItem>Copy to Google Docs</DropdownItem>
                                            <DropdownItem>Version history</DropdownItem>
                                        </div>
                                    </Dropdown>
                                )}
                            </div>

                            <ToolButton
                                icon={Undo2}
                                onClick={handleUndo}
                                disabled={historyIndex === 0}
                                label="Undo (Ctrl+Z)"
                            />
                            <ToolButton
                                icon={Redo2}
                                onClick={handleRedo}
                                disabled={historyIndex >= history.length - 1}
                                label="Redo (Ctrl+Y)"
                            />
                        </div>

                        <button
                            onClick={handleClose}
                            className="text-sm font-medium text-gray-700 hover:bg-gray-100 hover:bg-opacity-10 px-4 py-1.5 rounded transition-colors ml-2"
                        >
                            Close
                        </button>
                    </div>

                    {showArchived && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-6 py-3 rounded shadow-xl z-50 animate-fade-in">
                            Note archived
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

    function List() {
        const [items, setItems] = useState<ListItem[]>([
            { id: '1', text: '', checked: false }
        ]);

        const addItem = () => {
            const newItem: ListItem = {
                id: Date.now().toString(),
                text: '',
                checked: false
            };
            setItems([...items, newItem]);
        };

        const removeItem = (id: string) => {
            setItems(items.filter(item => item.id !== id));
        };

        const toggleCheck = (id: string) => {
            setItems(items.map(item =>
                item.id === id ? { ...item, checked: !item.checked } : item
            ));
        };

        const updateText = (id: string, text: string) => {
            setItems(items.map(item =>
                item.id === id ? { ...item, text } : item
            ));
        };

        return (
            <div className="w-full max-w-2xl mx-auto p-4">
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 group">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleCheck(item.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateText(item.id, e.currentTarget.textContent || '')}
                                className={`flex-1 outline-none px-2 py-1 rounded hover:bg-gray-50 focus:bg-gray-50 min-h-6 ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'
                                    }`}
                                data-placeholder="List item"
                            />
                            <button
                                onClick={() => removeItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                            >
                                <X size={16} className="text-gray-600" />
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={addItem}
                    className="flex items-center gap-2 mt-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
                >
                    <Plus size={16} />
                    List Item
                </button>
            </div>
        );
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

    function DropdownItem({ icon: Icon, children }: DropdownItemProps) {
        return (
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left">
                {Icon && <Icon size={16} className="text-gray-600" />}
                {children}
            </button>
        );
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


export default NoteCreate;