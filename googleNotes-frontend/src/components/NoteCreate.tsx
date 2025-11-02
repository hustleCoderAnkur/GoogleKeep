import {
    Baseline,
    Bell,
    Brush,
    MoreVertical,
    Archive,
    Image,
    ImagePlus,
    Palette,
    Pin,
    Redo2,
    CheckSquare,
    Undo2,
    UserPlus
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

interface Note {
    id: string;
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface NoteCreateProps {
    onSave?: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel?: () => void;
    className?: string;
}

function NoteCreate({ onSave, onCancel, className = "" }: NoteCreateProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Focus title input when expanded
    useEffect(() => {
        if (isExpanded && titleRef.current) {
            titleRef.current.focus();
        }
    }, [isExpanded]);

    // Close note when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isExpanded &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                handleClose();
            }
        };

        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isExpanded, title, content]);

    const handleExpand = useCallback(() => {
        setIsExpanded(true);
    }, []);

    const handleClose = useCallback(() => {
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        // Save note if there's any content
        if ((trimmedTitle || trimmedContent) && onSave) {
            onSave({
                title: trimmedTitle,
                content: trimmedContent,
                isPinned
            });
        }

        // Reset state
        setIsExpanded(false);
        setTitle("");
        setContent("");
        setIsPinned(false);

        if (contentRef.current) {
            contentRef.current.textContent = "";
        }

        onCancel?.();
    }, [title, content, isPinned, onSave, onCancel]);

    const togglePin = useCallback(() => {
        setIsPinned(prev => !prev);
    }, []);

    const handleContentInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
        setContent(e.currentTarget.textContent || "");
    }, []);

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    }, []);

    const handleTitleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            contentRef.current?.focus();
        }
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        // Save on Cmd/Ctrl + Enter
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            handleClose();
        }
        // Close on Escape
        if (e.key === "Escape") {
            e.preventDefault();
            handleClose();
        }
    }, [handleClose]);

    if (!isExpanded) {
        return (
            <div className={`flex items-center justify-center mx-2 ${className}`}>
                <div className="w-full max-w-2xl px-4">
                    <div
                        onClick={handleExpand}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleExpand();
                            }
                        }}
                        className="flex items-center justify-between cursor-text bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Create a new note"
                    >
                        <p className="text-gray-600 text-sm">Take a note...</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Create checklist"
                            >
                                <CheckSquare size={20} className="text-gray-700" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Create drawing"
                            >
                                <Brush size={20} className="text-gray-700" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Add image"
                            >
                                <ImagePlus size={20} className="text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center mx-2 ${className}`}>
            <div className="w-full max-w-2xl px-4">
                <div
                    ref={containerRef}
                    className="relative bg-white border border-gray-300 rounded-lg shadow-md p-4"
                    onKeyDown={handleKeyDown}
                >
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={togglePin}
                            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isPinned
                                    ? "text-blue-600 hover:bg-blue-50"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            aria-label={isPinned ? "Unpin note" : "Pin note"}
                            aria-pressed={isPinned}
                        >
                            <Pin className={`w-5 h-5 ${isPinned ? "fill-current" : ""}`} />
                        </button>
                    </div>

                    <input
                        ref={titleRef}
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onKeyDown={handleTitleKeyDown}
                        placeholder="Title"
                        className="w-full text-lg font-semibold text-gray-800 outline-none mb-2 pr-10 placeholder-gray-400"
                        aria-label="Note title"
                    />

                    <div
                        ref={contentRef}
                        contentEditable
                        onInput={handleContentInput}
                        suppressContentEditableWarning
                        className="w-full min-h-[100px] text-gray-800 outline-none mb-4 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
                        data-placeholder="Take a note..."
                        role="textbox"
                        aria-label="Note content"
                        aria-multiline="true"
                    />

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1 flex-wrap">
                            <IconButton icon={Baseline} label="Text formatting" />
                            <IconButton icon={Palette} label="Background color" />
                            <IconButton icon={Bell} label="Add reminder" />
                            <IconButton icon={UserPlus} label="Add collaborator" />
                            <IconButton icon={Image} label="Add image" />
                            <IconButton icon={Archive} label="Archive" />
                            <IconButton icon={MoreVertical} label="More options" />
                            <IconButton icon={Undo2} label="Undo" />
                            <IconButton icon={Redo2} label="Redo" />
                        </div>

                        <button
                            onClick={handleClose}
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded transition-colors ml-2 flex-shrink-0"
                            aria-label="Close note editor"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                        Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> to close or{" "}
                        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⌘/Ctrl</kbd> +{" "}
                        <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> to save
                    </p>
                )}
            </div>
        </div>
    );
}

interface IconButtonProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    onClick?: () => void;
}

function IconButton({ icon: Icon, label, onClick }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label={label}
            title={label}
        >
            <Icon size={18} className="text-gray-600" />
        </button>
    );
}

// Example usage wrapper
export default function App() {
    const [notes, setNotes] = useState<Note[]>([]);

    const handleSaveNote = (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newNote: Note = {
            ...noteData,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        setNotes(prev => noteData.isPinned ? [newNote, ...prev] : [...prev, newNote]);
        console.log('Note saved:', newNote);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <NoteCreate onSave={handleSaveNote} />

            {notes.length > 0 && (
                <div className="max-w-2xl mx-auto mt-8 px-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Notes</h2>
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <div
                                key={note.id}
                                className="bg-white border border-gray-300 rounded-lg shadow-sm p-4"
                            >
                                {note.isPinned && (
                                    <div className="flex items-center gap-1 text-blue-600 text-sm mb-2">
                                        <Pin size={14} className="fill-current" />
                                        <span className="font-medium">Pinned</span>
                                    </div>
                                )}
                                {note.title && (
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        {note.title}
                                    </h3>
                                )}
                                {note.content && (
                                    <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}