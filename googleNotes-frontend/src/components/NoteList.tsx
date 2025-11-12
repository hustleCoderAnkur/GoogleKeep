import { Plus, X } from "lucide-react";
import { useState } from "react";
function NoteList() {

    interface ListItem {
        id: string;
        text: string;
        checked: boolean;
    }

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
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
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
        <>
            <div className="w-full">
                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3 group">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleCheck(item.id)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <input
                                type="text"
                                value={item.text}
                                onChange={(e) => updateText(item.id, e.target.value)}
                                placeholder="List item"
                                className={`flex-1 outline-none px-2 py-1 rounded hover:bg-gray-50 focus:bg-gray-50 bg-transparent ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'
                                    }`}
                            />
                            <button
                                onClick={() => removeItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                                disabled={items.length === 1}
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
        </>
    )
}



export default NoteList