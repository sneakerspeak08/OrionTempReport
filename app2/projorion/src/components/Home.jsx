import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Home() {
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2 className="text-3xl font-bold mb-6 text-unc-charlotte-gold">Current Temperature Reports</h2>

      {user ? (
        <div>
          <p className="text-white mb-4">
            Welcome back, {user.email}! View and submit temperature reports for locations across UNC
            Charlotte.
          </p>
          <Link
            to="/report"
            className="inline-block bg-unc-charlotte-gold text-unc-charlotte-green font-bold py-2 px-4 rounded hover:bg-white transition-colors"
          >
            Submit New Report
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-white mb-4">
            To view and submit temperature reports for locations across UNC Charlotte. 
            Log in or sign up.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="inline-block bg-unc-charlotte-gold text-unc-charlotte-green font-bold py-2 px-4 rounded hover:bg-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-block bg-white text-unc-charlotte-green font-bold py-2 px-4 rounded hover:bg-unc-charlotte-gold transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

