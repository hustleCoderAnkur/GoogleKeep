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
import { useEffect,useCallback, useRef, useState } from "react";
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

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen');
    const [history, setHistory] = useState<string[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);
    
    const [isEraserDropDown, setIsEraserDropDown] = useState(false);
    const [isGridDropDown, setIsGridDropDown] = useState(false);
    const [isPenColorOpen, setIsPenColorOpen] = useState(false);
    const [isMarkerColorOpen, setIsMarkerColorOpen] = useState(false);
    const [isHighlighterColorOpen, setIsHighlighterColorOpen] = useState(false);
    const [penColor, setPenColor] = useState('#000000');
    const [markerColor, setMarkerColor] = useState('#000000');
    const [highlighterColor, setHighlighterColor] = useState('#fef9c3');
    const [screen, setScreen] = useState(false);
    const [more, setMore] = useState(false);
    const [gridType, setGridType] = useState('none');
    
    
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
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        if (screen) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - 20;
        } else {
            canvas.width = window.innerWidth - 40;
            canvas.height = window.innerHeight - 220;
        }

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        drawGrid();
        saveToHistory();
    }, [screen]);  

    const saveToHistory = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(canvas.toDataURL());
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    }
    
    const drawGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const tempData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(tempData, 0, 0);

        if (gridType === 'none') return;

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        const spacing = 40;

        if (gridType === 'lines') {
            for (let i = 0; i < canvas.width; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }

        } else if (gridType === 'dots') {
            ctx.fillStyle = '#e0e0e0';
            for (let x = 0; x < canvas.width; x += spacing) {
                for (let y = 0; y < canvas.height; y += spacing) {
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

        } else if (gridType === 'grid') {
            for (let i = 0; i < canvas.width; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, canvas.height);
                ctx.stroke();
            }
            for (let i = 0; i < canvas.height; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(canvas.width, i);
                ctx.stroke();
            }
        }

    }, [gridType]);

    const getMouse = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null
        const rect = canvas?.getBoundingClientRect();
        
        
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (tool === 'select') return;
        const pos = getMouse(e);
        if (!pos) return
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }
    
    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || tool === 'select') return;
        
        const pos = getMouse(e)
        if(!pos) return
        const ctx = canvasRef.current?.getContext('2d');
        if(!ctx) return

        if (tool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
        
        if (tool === 'pen') {
            ctx.strokeStyle = penColor;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 1;
        } else if(tool === 'marker'){
            ctx.strokeStyle = markerColor;
            ctx.lineWidth = 5;
            ctx.globalAlpha = 1;
            
        } else if(tool === 'highlighterColor'){
            ctx.strokeStyle = highlighterColor;
            ctx.lineWidth = 20;
            ctx.globalAlpha = 0.3;
        }
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        
    }
    
    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveToHistory();
            drawGrid()
        }
    };
    
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return
        const ctx = canvas.getContext('2d');
        if(!ctx) return
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
        drawGrid();
    };
    
    const undo = () => {
        const canvas = canvasRef.current;
        if (!canvas) return
        if (historyStep > 0) {
            const newStep = historyStep - 1;
            setHistoryStep(newStep);
            const img = new Image();
            img.src = history[newStep];
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                drawGrid();
            };
        }
    };
    
    const redo = () => {
        const canvas = canvasRef.current;
        if (!canvas) return
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1;
            setHistoryStep(newStep);
            const img = new Image();
            img.src = history[newStep];
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                if (!ctx) return
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                drawGrid();
            };
        }
    };
    
    const exportAsImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = canvas.toDataURL();
        link.click();
    };
    
    
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
            <div className="flex flex-col items-center bg-white p-4">

            <div className="flex flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg shadow-md px-4 py-2">

                <Button title="Select Tool" onClick={() => setTool("select")}>
                    <SquareDashedMousePointer className="w-5 h-5 text-gray-700" />
                </Button>

                <div className="relative">
                    <Button title="Eraser" onClick={() => setTool("eraser")}>
                        <Eraser className="w-5 h-5 text-gray-700" />
                    </Button>

                    <button
                        onClick={() => setIsEraserDropDown(!isEraserDropDown)}
                        className=" hover:bg-gray-100 rounded-full transition"
                        >
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </button>

                    {isEraserDropDown && (
                        <Dropdown onClose={() => setIsEraserDropDown(false)}>
                            <DropdownItem onClick={clearCanvas}>Clear Page</DropdownItem>
                        </Dropdown>
                    )}
                </div>

                <div className="relative">
                    <ToolButton
                        icon={Pen}
                        onClick={() => { setIsPenColorOpen(!isPenColorOpen); setTool("pen"); }}
                        label="Pen Color"
                        />
                    <ColorDropdown
                        isOpen={isPenColorOpen}
                        onClose={() => setIsPenColorOpen(false)}
                        selectedColor={penColor}
                        onColorSelect={(color) => setPenColor(color.hex)}
                        title="Pen color"
                        />
                </div>

                <div className="relative">
                    <ToolButton
                        icon={PenLine}
                        onClick={() => { setIsMarkerColorOpen(!isMarkerColorOpen); setTool("marker"); }}
                        label="Marker Color"
                        />
                    <ColorDropdown
                        isOpen={isMarkerColorOpen}
                        onClose={() => setIsMarkerColorOpen(false)}
                        selectedColor={markerColor}
                        onColorSelect={(color) => setMarkerColor(color.hex)}
                        title="Marker color"
                        />
                </div>

                <div className="relative">
                    <ToolButton
                        icon={Highlighter}
                        onClick={() => { setIsHighlighterColorOpen(!isHighlighterColorOpen); setTool("highlighter"); }}
                        label="Highlighter Color"
                        />
                    <ColorDropdown
                        isOpen={isHighlighterColorOpen}
                        onClose={() => setIsHighlighterColorOpen(false)}
                        selectedColor={highlighterColor}
                        onColorSelect={(color) => setHighlighterColor(color.hex)}
                        title="Highlighter color"
                        />
                </div>

                <div className="relative">
                    <Button title="Grid View">
                        <Grid3x3 className="w-5 h-5 text-gray-700" />
                    </Button>
                    <button
                        onClick={() => setIsGridDropDown(!isGridDropDown)}
                        className=" hover:bg-gray-100 rounded-full transition"
                        >
                        <ChevronDown className="w-5 h-5 text-gray-700" />
                    </button>

                    {isGridDropDown && (
                        <Dropdown onClose={() => setIsGridDropDown(false)}>
                            <DropdownItem onClick={() => setGridType("grid")}>
                                <Grid3x3 className="w-5 h-5" /> Grid 3x3
                            </DropdownItem>

                            <DropdownItem onClick={() => setGridType("dots")}>
                                <GripHorizontal className="w-5 h-5" /> Dots Grid
                            </DropdownItem>

                            <DropdownItem onClick={() => setGridType("lines")}>
                                <Menu className="w-5 h-5" /> Lines Grid
                            </DropdownItem>

                            <DropdownItem onClick={() => setGridType("none")}>
                                None
                            </DropdownItem>
                        </Dropdown>
                    )}
                </div>


                <div className="mx-2 border-l border-gray-300 h-6" />

                <Button title="Redo" onClick={redo}>
                    <Redo2 className="w-5 h-5 text-gray-700" />
                </Button>

                <Button title="Undo" onClick={undo}>
                    <Undo2 className="w-5 h-5 text-gray-700" />
                </Button>

                <div className="mx-2 border-l border-gray-300 h-6" />

                <div onClick={() => setScreen(!screen)}>
                    {screen ? (
                        <Button title="Maximize">
                            <Maximize className="w-5 h-5 text-gray-700" />
                        </Button>
                    ) : (
                        <Button title="Minimize">
                            <Minimize className="w-5 h-5 text-gray-700" />
                        </Button>
                    )}
                </div>

                <div className="relative">
                    <Button
                        onClick={() => setMore(!more)}
                        title="More"
                        className="p-2 rounded-xl hover:bg-gray-100 transition"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-700" />
                    </Button>

                    {more && (
                        <div className="absolute right-0 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 animate-fade">
                            <Dropdown onClose={() => setMore(false)}>
                                <DropdownItem onClick={clearCanvas}>New Drawing</DropdownItem>
                                <DropdownItem onClick={exportAsImage}>Export as Image</DropdownItem>
                                <DropdownItem onClick={clearCanvas}>Delete Current Drawing</DropdownItem>
                            </Dropdown>
                        </div>
                    )}
                </div>

            </div>

            <canvas
                ref={canvasRef}
                className="mt-4 border border-gray-300 rounded-md bg-white"
                onMouseDown={(e) => { setIsDrawing(true); startDrawing(e); }}
                onMouseMove={(e) => draw(e)}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                />
        </div>
    );   
}
export default DrawingPage
    
