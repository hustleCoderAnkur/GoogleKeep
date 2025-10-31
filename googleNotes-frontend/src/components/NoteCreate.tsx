import { Brush, ImagePlusIcon, SquareCheckIcon } from "lucide-react"
import Button from "./Button"
import { useState } from "react"

function NoteCreate() {

    const [texts,setTexts] = useState(false)

    return (
        <>
            <div className="flex items-center justify-center mx-2">
                <div className="w-full max-w-2xl px-4">
                      
                    <div className="flex items-center justify-between cursor-text bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow">
                        <p onClick={() => setTexts(!texts)} className="text-gray-600 text-sm">Take a note...</p>
                        {texts && (
                            <textarea
                                className="w-full border rounded p-2 mt-2"
                                rows={4}
                                placeholder="Type your note..."
                            />
                        )}
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
                </div>
            </div>
        </>
    )
}

export default NoteCreate