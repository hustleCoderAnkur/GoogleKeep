import { useState } from "react";
import Dashboard from "./layout/Dashboard";
import Navbar from "./layout/Navbar";
import NotePage from "./pages/notesPage";

function App() {
  const [isSideOpen, setIsSideOpen] = useState(true);

  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
        />

        <div className="flex flex-1 overflow-hidden">
          <Dashboard isOpen={isSideOpen} />
          <main className="flex-1 p-4 overflow-y-auto">
            <NotePage />
          </main>
        </div>
      </div>
    </>
  )
}
        
export default App;
