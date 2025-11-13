import {
    ImagePlus,
    Pin,
    X,
    CheckSquare,
    Brush,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import NoteDown from "../components/NoteDown";
import NoteList from "../components/NoteList";
import DrawingPage from "../pages/DrawingPage";

interface ListItem {
    id: string;
    text: string;
    checked: boolean;
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
    const [isListMode, setIsListMode] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [history, setHistory] = useState<string[]>([""]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [images, setImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [items, setItems] = useState<ListItem[]>([
        { id: '1', text: '', checked: false }
    ]);

    const colors: ColorOption[] = [
        { name: 'Default', bgClass: 'bg-black', borderClass: 'border-gray-300', hex: '#ffffff' },
        { name: 'Red', bgClass: 'bg-red-500', borderClass: 'border-red-600', hex: '#ff5252' },
        { name: 'Orange', bgClass: 'bg-orange-500', borderClass: 'border-orange-600', hex: '#ffbc00' },
        { name: 'Yellow', bgClass: 'bg-yellow-500', borderClass: 'border-yellow-600', hex: '#fef9c3' },
        { name: 'Green', bgClass: 'bg-green-500', borderClass: 'border-green-600', hex: '#00c853' },
        { name: 'Blue', bgClass: 'bg-blue-500', borderClass: 'border-blue-600', hex: '#00b0ff' },
        { name: 'Purple', bgClass: 'bg-purple-500', borderClass: 'border-purple-600', hex: '#d500f9' },
        { name: 'Gray', bgClass: 'bg-gray-500', borderClass: 'border-gray-600', hex: '#8d6e63' },
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

        if (trimmedTitle || trimmedContent || images.length > 0 || items.some(item => item.text.trim())) {
            console.log('Saving note:', {
                title: trimmedTitle,
                content: trimmedContent,
                images,
                isPinned,
                bgColor,
                isListMode,
                items: isListMode ? items : undefined
            });
        }

        setIsExpanded(false);
        setTitle("");
        setIsPinned(false);
        setBgColor("bg-white");
        setImages([]);
        setHistory([""]);
        setHistoryIndex(0);
        setIsListMode(false);
        setItems([{ id: '1', text: '', checked: false }]);
        if (editorRef.current) editorRef.current.innerHTML = "";
    };

    const getCurrentBorderClass = () => {
        const currentColor = colors.find(c => c.bgClass === bgColor);
        return currentColor ? currentColor.borderClass : 'border-gray-300';
    };

    const handleListModeToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsListMode(true);
        setIsExpanded(true);
    };

    const handleTextModeToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsListMode(false);
        setIsExpanded(true);
    };
    const handleDrawingToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDrawing(true);
        setIsListMode(false);
        setIsExpanded(true);
    }

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
                            <button
                                onClick={handleListModeToggle}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="New list"
                            >
                                <CheckSquare size={20} className="text-gray-600" />
                            </button>
                            <button
                                onClick={handleDrawingToggle}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="New note with drawing"
                            >
                                <Brush size={20} className="text-gray-600" />
                            </button>
                            
                            <button
                                onClick={handleTextModeToggle}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="New note with image"
                            >
                                <ImagePlus size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isDrawing) {
        return <DrawingPage />;
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
                        
                        {isListMode ? (
                            <NoteList/>
                        ) : (
                            <div
                                ref={editorRef}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={handleInput}
                                className="w-full min-h-[60px] text-sm text-gray-800 outline-none"
                                style={{
                                    minHeight: '60px',
                                }}
                                data-placeholder="Take a note..."
                            ></div>
                        )}

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
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                        />

                        <NoteDown
                            onClose={handleClose}
                            bgColor={bgColor}
                            setBgColor={setBgColor}
                            isPinned={isPinned}
                            setIsPinned={setIsPinned}
                            fileInputRef={fileInputRef}
                            editorRef={editorRef}
                            history={history}
                            setHistory={setHistory}
                            historyIndex={historyIndex}
                            setHistoryIndex={setHistoryIndex}
                            handleUndo={handleUndo}
                            handleRedo={handleRedo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NoteCreate;