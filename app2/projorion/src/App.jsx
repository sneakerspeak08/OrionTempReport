import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Home from "./components/Home"
import ReportForm from "./components/ReportForm"
import Login from "./components/Login"
import Signup from "./components/Signup"
import ProjectedRoute from "./components/ProjectedRoute"
import { AuthProvider } from "./context/AuthContext"
import NavBar from "./components/NavBar"
import Reports from "./components/Reports"
import Map from "./components/Map"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: "#005035" }}>
          <NavBar />
          <main className="container mx-auto px-4 py-12">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/map" element={<Map />} />
              <Route
                path="/report"
                element={
                  <ProjectedRoute>
                    <ReportForm />
                  </ProjectedRoute>
                }
              />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App

