import {
    SquareDashedMousePointer,
    Eraser,
    PenLine,
    Highlighter,
    Grid3x3,
    ChevronDown,
    Redo2,
    Undo2,
    Maximize,
    Minimize,
    MoreVertical,
    Check,
    Pen,
    GripHorizontal,
    Menu,
} from "lucide-react";

import Button from "../components/Button.tsx";
import { useState } from "react";
import { Dropdown, DropdownItem } from "../components/DropDown.tsx";
import ToolButton from "../components/ToolBtn.tsx";

interface ColorOption {
    name: string;
    bgClass: string;
    borderClass: string;
    hex: string;
}

interface ColorDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    selectedColor: string;
    onColorSelect: (color: ColorOption) => void;
    title: string;
}

function DrawingPage() {
    const [isEraserDropDown, setIsEraserDropDown] = useState(false);
    const [isGridDropDown, setIsGridDropDown] = useState(false);

    const [isPenColorOpen, setIsPenColorOpen] = useState(false);
    const [isMarkerColorOpen, setIsMarkerColorOpen] = useState(false);
    const [isHighlighterColorOpen, setIsHighlighterColorOpen] = useState(false);

    const [penColor, setPenColor] = useState("bg-black");
    const [markerColor, setMarkerColor] = useState("bg-black");
    const [highlighterColor, setHighlighterColor] = useState("bg-yellow-500");

    const colors: ColorOption[] = [
        { name: 'Black', bgClass: 'bg-black', borderClass: 'border-gray-300', hex: '#000000' },
        { name: 'Red', bgClass: 'bg-red-500', borderClass: 'border-red-600', hex: '#ff5252' },
        { name: 'Orange', bgClass: 'bg-orange-500', borderClass: 'border-orange-600', hex: '#ffbc00' },
        { name: 'Yellow', bgClass: 'bg-yellow-500', borderClass: 'border-yellow-600', hex: '#fef9c3' },
        { name: 'Green', bgClass: 'bg-green-500', borderClass: 'border-green-600', hex: '#00c853' },
        { name: 'Blue', bgClass: 'bg-blue-500', borderClass: 'border-blue-600', hex: '#00b0ff' },
        { name: 'Purple', bgClass: 'bg-purple-500', borderClass: 'border-purple-600', hex: '#d500f9' },
        { name: 'Gray', bgClass: 'bg-gray-500', borderClass: 'border-gray-600', hex: '#8d6e63' },
    ];

    const ColorDropdown = ({
        isOpen,
        onClose,
        selectedColor,
        onColorSelect,
        title,
    }: ColorDropdownProps) =>
        isOpen ? (
            <Dropdown onClose={onClose}>
                <div className="p-3 min-w-[280px]">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {colors.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => onColorSelect(color)}
                                className={`w-12 h-12 rounded-full ${color.bgClass} border-2 ${selectedColor === color.bgClass
                                        ? "border-blue-500 ring-2 ring-blue-300"
                                        : "border-gray-300 hover:border-gray-400"
                                    } transition-all hover:scale-110 flex items-center justify-center`}
                                title={color.name}
                            >
                                {selectedColor === color.bgClass && (
                                    <Check size={18} className="text-white" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </Dropdown>
        ) : null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="flex flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-md px-4 py-2">

                <Button title="Select Tool">
                    <SquareDashedMousePointer className="w-5 h-5 text-gray-700" />
                </Button>

                <div className="relative">
                    <Button title="Eraser">
                        <Eraser className="w-5 h-5 text-gray-700" />
                    </Button>
                    <button
                        onClick={() => setIsEraserDropDown(!isEraserDropDown)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </button>

                    {isEraserDropDown && (
                        <Dropdown onClose={() => setIsEraserDropDown(false)}>
                            <DropdownItem>Clear Page</DropdownItem>
                        </Dropdown>
                    )}
                </div>

                <div className="relative">
                    <ToolButton
                        icon={Pen}
                        onClick={() => setIsPenColorOpen(!isPenColorOpen)}
                        label="Pen Color"
                    />
                    <ColorDropdown
                        isOpen={isPenColorOpen}
                        onClose={() => setIsPenColorOpen(false)}
                        selectedColor={penColor}
                        onColorSelect={(color) => setPenColor(color.bgClass)}
                        title="Pen color"
                    />
                </div>

                <div className="relative">
                    <ToolButton
                        icon={PenLine}
                        onClick={() => setIsMarkerColorOpen(!isMarkerColorOpen)}
                        label="Marker Color"
                    />
                    <ColorDropdown
                        isOpen={isMarkerColorOpen}
                        onClose={() => setIsMarkerColorOpen(false)}
                        selectedColor={markerColor}
                        onColorSelect={(color) => setMarkerColor(color.bgClass)}
                        title="Marker color"
                    />
                </div>

                <div className="relative">
                    <ToolButton
                        icon={Highlighter}
                        onClick={() => setIsHighlighterColorOpen(!isHighlighterColorOpen)}
                        label="Highlighter Color"
                    />
                    <ColorDropdown
                        isOpen={isHighlighterColorOpen}
                        onClose={() => setIsHighlighterColorOpen(false)}
                        selectedColor={highlighterColor}
                        onColorSelect={(color) => setHighlighterColor(color.bgClass)}
                        title="Highlighter color"
                    />
                </div>

                <div className="relative">
                    <Button title="Grid View">
                        <Grid3x3 className="w-5 h-5 text-gray-700" />
                    </Button>
                    <button
                        onClick={() => setIsGridDropDown(!isGridDropDown)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </button>

                    {isGridDropDown && (
                        <Dropdown onClose={() => setIsGridDropDown(false)}>
                            <DropdownItem>
                                <Grid3x3 className="w-5 h-5" /> Grid 3x3
                            </DropdownItem>
                            <DropdownItem>
                                <GripHorizontal className="w-5 h-5" /> Dots Grid
                            </DropdownItem>
                            <DropdownItem>
                                <Menu className="w-5 h-5" /> Lines Grid
                            </DropdownItem>
                        </Dropdown>
                    )}
                </div>

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
                    <MoreVertical className="w-5 h-5 text-gray-700" />
                </Button>
            </div>
        </div>
    );
}

export default DrawingPage;
