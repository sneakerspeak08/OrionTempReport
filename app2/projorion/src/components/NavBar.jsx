"use client"

import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function NavBar() {
  const { user, signOut } = useAuth()

  return (
    <header style={{ backgroundColor: "#A49665" }} className="py-4 px-6 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-unc-charlotte-green hover:opacity-90 transition-opacity">
            UNC Charlotte Temperature Reporter
          </Link>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-unc-charlotte-green hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link to="/map" className="text-unc-charlotte-green hover:text-white transition-colors font-medium">
              View Map
            </Link>
            <Link to="/reports" className="text-unc-charlotte-green hover:text-white transition-colors font-medium">
              View Temperatures
            </Link>
            {user ? (
              <>
                <Link to="/report" className="text-unc-charlotte-green hover:text-white transition-colors font-medium">
                  Report Temperature
                </Link>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={signOut}
                    className="px-4 py-2 rounded bg-unc-charlotte-green text-white hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Logout
                  </button>
                  <span className="text-unc-charlotte-green">({user.email})</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-unc-charlotte-green hover:text-white transition-colors font-medium">
                  Login
                </Link>
                <Link to="/signup" className="text-unc-charlotte-green hover:text-white transition-colors font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default NavBar

