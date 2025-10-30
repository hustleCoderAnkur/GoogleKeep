import { useState } from "react";
import Dashboard from "./layout/Dashboard";
import Navbar from "./layout/Navbar";

function App() {
  const [isSideOpen, setIsSideOpen] = useState(true);

  return (
    <>
      <Navbar
        isSideOpen={isSideOpen}
        setIsSideOpen={setIsSideOpen} />
        <Dashboard isOpen={isSideOpen} />
    </>
  )
}
        
export default App;
