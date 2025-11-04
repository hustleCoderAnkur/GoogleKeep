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
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

function NoteCreate() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [title, setTitle] = useState("");

    const [isReminderOpen, setIsReminderOpen] = useState(false);
    const [isCollaboratorOpen, setIsCollaboratorOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    const [history, setHistory] = useState<string[]>([""]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [showArchived, setShowArchived] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                if (isExpanded) handleClose();
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isExpanded, title]);

    useEffect(() => {
        if (isExpanded && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isExpanded]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            }
            if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            }
            if (e.key === "Escape" && isExpanded) {
                e.preventDefault();
                handleClose();
            }
        };

        if (isExpanded) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [isExpanded, historyIndex, history]);

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

    const handleClose = () => {
        const trimmedTitle = title.trim();
        const trimmedContent = editorRef.current?.textContent?.trim() || "";

        if (trimmedTitle || trimmedContent || images.length > 0) {
            console.log('Saving note:', { title: trimmedTitle, content: trimmedContent, images, isPinned });
        }

        setIsExpanded(false);
        setTitle("");
        setIsPinned(false);
        setImages([]);
        setHistory([""]);
        setHistoryIndex(0);
        setIsReminderOpen(false);
        setIsCollaboratorOpen(false);
        setIsMoreMenuOpen(false);
        if (editorRef.current) editorRef.current.innerHTML = "";
    };

    const closeAllDropdowns = () => {
        setIsReminderOpen(false);
        setIsCollaboratorOpen(false);
        setIsMoreMenuOpen(false);
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
                            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="New list">
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
                <div ref={containerRef} className="relative bg-white border border-gray-300 rounded-lg shadow-lg">
                    <button
                        onClick={() => setIsPinned(!isPinned)}
                        className="absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
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
                            className="w-full text-base font-medium text-gray-800 placeholder-gray-500 outline-none mb-3 pr-10"
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
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-2 py-2 border-t border-gray-200">
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

                            <ToolButton icon={Palette} onClick={() => { }} label="Background options" />
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
                            className="text-sm font-medium text-gray-700 hover:bg-gray-100 px-4 py-1.5 rounded transition-colors ml-2"
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

function ToolButton({ icon: Icon, onClick, disabled = false, label }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-full transition-colors ${disabled
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:bg-gray-100 cursor-pointer"
                }`}
            title={label}
        >
            <Icon size={18} className="text-gray-600" />
        </button>
    );
}

function Dropdown({ children, onClose }: any) {
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

function DropdownItem({ icon: Icon, children }: any) {
    return (
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left">
            {Icon && <Icon size={16} className="text-gray-600" />}
            {children}
        </button>
    );
}

export default NoteCreate;