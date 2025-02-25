import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import "./App.css"
import ReportForm from "./components/ReportForm"
import Home from "./components/Home"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">UNCC Campus Temperature Reporter</h1>
            <nav className="mt-2">
              <Link to="/" className="text-white hover:text-blue-200 mr-4">
                Home
              </Link>
              <Link to="/report" className="text-white hover:text-blue-200">
                Report Temperature
              </Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<ReportForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

