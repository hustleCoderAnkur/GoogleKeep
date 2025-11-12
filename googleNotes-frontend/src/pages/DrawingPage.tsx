import {
    SquareDashedMousePointer,
    Eraser,
    PenIcon,
    PenOffIcon,
    Highlighter,
    Grid3X3Icon,
    ChevronDown,
    Redo2,
    Undo2,
    Maximize,
    Minimize,
    EllipsisVertical,
} from "lucide-react";
import Button from "../components/Button.tsx"
import { useState } from "react";
import { Dropdown, DropdownItem } from "../components/DropDown.tsx";



function DrawingPage() {
    const [isDropDown, setIsDropDown] = useState(false);

    return (
        <>
            <div className="flex flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-md px-4 py-2">
                <Button title="Select Tool">
                    <SquareDashedMousePointer className="w-5 h-5 text-gray-700" />
                </Button>

                <Button title="Eraser">
                    <Eraser className="w-5 h-5 text-gray-700" />
                    <Button onClick={() => setIsDropDown(!isDropDown)} title="More Options">
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </Button>
                </Button>
                {isDropDown && (
                    <Dropdown onClose={() => setIsDropDown(false)}>
                        <DropdownItem>clear Page</DropdownItem>
                    </Dropdown>
                )}

                <Button title="Pen">
                    <PenIcon className="w-5 h-5 text-gray-700" />
                    <Button onClick={() => setIsDropDown(!isDropDown)} title="More Options">
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </Button>
                </Button>
                
                {isDropDown && (
                    <Dropdown onClose={() => setIsDropDown(false)}>
                        <DropdownItem></DropdownItem>
                    </Dropdown>
                )}

                <Button title="Pen Off">
                    <PenOffIcon className="w-5 h-5 text-gray-700" />
                    <Button onClick={() => setIsDropDown(!isDropDown)} title="More Options">
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </Button>
                </Button>
                {isDropDown && (
                    <Dropdown onClose={() => setIsDropDown(false)}>
                        <DropdownItem></DropdownItem>
                    </Dropdown>     
                )}

                <Button title="Highlighter">
                    <Highlighter className="w-5 h-5 text-gray-700" />
                    <Button onClick={() => setIsDropDown(!isDropDown)} title="More Options">
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </Button>
                </Button>
                {isDropDown && (
                    <Dropdown onClose={() => setIsDropDown(false)}>
                        <DropdownItem></DropdownItem>
                    </Dropdown>
                )}

                <Button title="Grid View">
                    <Grid3X3Icon className="w-5 h-5 text-gray-700" />
                    <Button onClick={() => setIsDropDown(!isDropDown)} title="More Options">
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </Button>
                </Button>
                {isDropDown && (
                    <Dropdown onClose={() => setIsDropDown(false)}>
                        <DropdownItem></DropdownItem>
                    </Dropdown>
                )}

                <div className="mx-2 border-l border-gray-300 h-6" />

                <Button title="Redo">
                    <Redo2 className="w-5 h-5 text-gray-700" />
                </Button>

                <Button title="Undo">
                    <Undo2 className="w-5 h-5 text-gray-700" />
                </Button>

                <div className="mx-2 border-l border-gray-300 h-6" />

                <Button title="Maximize">
                    <Maximize className="w-5 h-5 text-gray-700" />
                </Button>

                <Button title="Minimize">
                    <Minimize className="w-5 h-5 text-gray-700" />
                </Button>

                <Button title="More">
                    <EllipsisVertical className="w-5 h-5 text-gray-700" />
                </Button>
            </div>
        </>
    );
}

export default DrawingPage;

