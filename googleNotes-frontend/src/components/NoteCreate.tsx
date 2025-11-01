import { Baseline, BellPlusIcon, Brush, EllipsisVertical, FolderDownIcon, Image, ImagePlusIcon, Palette, Pin, Redo2, SquareCheckIcon, Undo2, UserPlusIcon } from "lucide-react";
import Button from "./Button";
import { useState, useRef, useEffect } from "react";

function NoteCreate() {
    const [texts, setTexts] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (texts && editorRef.current) {
            editorRef.current.focus();
        }
    }, [texts]);

    return (
        <div className="flex items-center justify-center mx-2">
            <div className="w-full max-w-2xl px-4">
                {!texts ? (
                    <div
                        onClick={() => setTexts(true)}
                        className="flex items-center justify-between cursor-text bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow"
                    >
                        <p className="text-gray-600 text-sm">Take a note...</p>
                        <div className="flex items-center gap-2">
                            <Button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                                <SquareCheckIcon size={20} className="text-gray-700" />
                            </Button>
                            <Button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                                <Brush size={20} className="text-gray-700" />
                            </Button>
                            <Button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                                <ImagePlusIcon size={20} className="text-gray-700" />
                            </Button>
                        </div>
                    </div>
                ) : (
                        <div className="relative bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                            
                        <div className="absolute top-2 right-2">
                            <Pin className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
                        </div>

                        <div
                            ref={editorRef}
                            contentEditable
                            suppressContentEditableWarning
                            className="w-full min-h-[100px] text-gray-800 outline-none mb-4"
                            data-placeholder="Take a note..."
                            >
    
                            <h1>Title</h1>
                            <p>take a note...</p>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200">

                            <div className="flex items-center gap-3">
                                <Baseline className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <Palette className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <BellPlusIcon className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <UserPlusIcon className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <Image className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <FolderDownIcon className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <EllipsisVertical className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <Undo2 className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                <Redo2 className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                            </div>

                            <Button
                                onClick={() => setTexts(false)}
                                className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 px-4 py-1"
                                >
                                Close
                            </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NoteCreate;