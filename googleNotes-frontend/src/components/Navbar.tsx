import { Menu, RotateCw, Search, Grid2X2, CirclePlusIcon, Rows2, Settings, Grip, CircleUser } from "lucide-react"
import { useState } from "react"

interface MenuBarProps{
    isSideOpen: boolean,
    setIsSideOpen: (value: boolean) => void
}

function Navbar({ isSideOpen, setIsSideOpen }: MenuBarProps) {
    const [row, setRow] = useState(true)
    return (
        <>
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2">

                    <div className="flex items-center gap-4 flex-1">

                        <button onClick={() => setIsSideOpen(!isSideOpen)} className="p-3 hover:bg-gray-100 rounded-full transition">
                            <Menu size={24} className="text-gray-700"/>
                        </button>

                        <img src="/keepLogo.png" alt="Keep Logo" className="w-10 h-10"/>
                        <h1 className="text-xl text-gray-700 font-normal">Keep</h1>
                        <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 flex-1 max-w-2xl hover:bg-gray-200 transition">
                            <Search size={20} className="text-gray-600 mr-3"/>

                            <input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent outline-none w-full text-gray-700"
                            />
                        </div>

                        <button className="p-3 hover:bg-gray-100 rounded-full transition">
                            <CirclePlusIcon size={25} className="text-gray-700"/>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">

                        <button onClick={()=>setRow(!row)} className="p-3 hover:bg-gray-100 rounded-full transition flex items-center gap-1">
                            {row ?
                                (<Rows2 size={20} className="text-gray-700" />):
                                (<Grid2X2 size={20} className="text-gray-700" />)
                            }
                        </button>

                        <button className="p-3 hover:bg-gray-100 rounded-full transition">
                            <Grip size={20} className="text-gray-700" />
                        </button>

                        <button className="p-3 hover:bg-gray-100 rounded-full transition">
                            <RotateCw size={20} className="text-gray-700" />
                        </button>

                        <button className="p-3 hover:bg-gray-100 rounded-full transition">
                            <Settings size={20} className="text-gray-700" />
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-full transition">
                            <CircleUser size={32} className="text-gray-700" />
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar

