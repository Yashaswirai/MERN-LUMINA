import { Router,Route,Routes } from "react-router-dom"
import RegisterLogin from "./pages/RegisterLogin"

function App() {
   return (
    <Router>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
      </Routes>
    </Router>
  )
}

export default App
