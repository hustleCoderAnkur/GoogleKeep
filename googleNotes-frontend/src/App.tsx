import { useState } from "react"
import Dashboard from "./components/Dashboard"
import Navbar from "./components/Navbar"

function App() {

  const [ isSideOpen, setIsSideOpen ]  = useState(true)

  return (
    <>
      <Navbar
        isSideOpen={isSideOpen}
        setIsSideOpen={setIsSideOpen}
        />
      <Dashboard isOpen={isSideOpen} />
    </>
  )
}

export default App