import { Baseline, BellPlusIcon, Bold, Brush, CaseSensitive, Clock, EllipsisVertical, FolderDownIcon, Heading1, Heading2, Image, ImagePlusIcon, Italic, MapPin, Palette, Pin, Redo2, RemoveFormattingIcon, SquareCheckIcon, Underline, Undo2, User, UserPlusIcon } from "lucide-react";
import Button from "./Button";
import { useState, useRef, useEffect } from "react";

function NoteCreate() {
    const [texts, setTexts] = useState(false);
    const [isBaselineOpen, setIsBaselineOpen] = useState(false)
    const [reminder, setReminder] = useState(false)
    const [collaborator, setCollaborator] = useState(false)
    const [image, setImage] = useState(false)
    const [archived, setArchived] = useState(false)
    const [vertical, setVertical] = useState(false)
    const [undo, setUndo] = useState(false)
    const [redo, setRedo] = useState(false)
    
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
                            className="w-full min-h-[100px] text-gray-800 outline-none mb-4 pr-8"
                            data-placeholder="Take a note..."
                        />

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <Button onClick={() => setIsBaselineOpen(!isBaselineOpen)}>
                                    <Baseline className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>

                                {isBaselineOpen && (<div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Heading1 className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                        <Heading2 className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                        <CaseSensitive className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                    </div>

                                    <div className="h-6 w-px bg-gray-300"></div>

                                    <div className="flex items-center gap-1">
                                        <Bold className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                        <Italic className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                        <Underline className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                        <RemoveFormattingIcon className="w-5 h-5 text-gray-700 cursor-pointer hover:text-gray-900" />
                                    </div>
                                </div>)}

                                <Button>
                                    <Palette className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>


                                <Button onClick={() => setReminder(!reminder)}>
                                    <BellPlusIcon className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>

                                {reminder && (
                                    <div>
                                        <h1>Reminder me later</h1>
                                        <span>Saved in google Reminders</span>
                                        <ul>
                                            <li>Tomorrow</li>
                                            <li>Next Week</li>
                                            <li>Home <span>{`location`}</span></li>
                                            <li><Clock /> Pick date & Time</li>
                                            <li><MapPin /> Pick place</li>
                                        </ul>
                                    </div>
                                )}

                                <Button onClick={() => setCollaborator(!collaborator)}>
                                    <UserPlusIcon className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>

                                {collaborator && (
                                    <div>
                                        <h1>Collaborator</h1>
                                        <ul>
                                            <li>
                                                <div>
                                                    <User />
                                                    username(Owner)
                                                    <span>user123@gmail.com</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div>
                                                    <UserPlusIcon />
                                                    <input type="email" placeholder="Person or email to share with" />
                                                </div>
                                            </li>
                                        </ul>
                                        <div>
                                            <Button>Cancel</Button>
                                            <Button>Save</Button>
                                        </div>
                                    </div>
                                    )}
                                    
                                <Button onClick={()=> setImage(!image) }>
                                    <Image className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                    </Button>
                                    
                                

                                <Button onClick={() => setArchived(!archived) }>
                                    <FolderDownIcon className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>
                                <Button onClick={() => setVertical(!vertical)}>
                                    <EllipsisVertical className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>
                                <Button onClick={() => setUndo(!undo) }>
                                    <Undo2 className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>
                                    <Button onClick={() => setRedo(!redo) }>
                                    <Redo2 className="w-5 h-5 mr-4 text-gray-600 cursor-pointer hover:text-gray-900" />
                                </Button>
                            </div>

                            <Button
                                onClick={() => setTexts(false)}
                                className="text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 px-4 py-1"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NoteCreate;