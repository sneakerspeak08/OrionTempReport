"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage("")
    setLoading(true)

    if (!email.endsWith("@charlotte.edu")) {
      setError("Only @charlotte.edu email addresses are allowed to register")
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password)
      if (error) throw error

      setMessage("Registration successful! Please check your email for verification.")
      setTimeout(() => navigate("/login"), 5000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-unc-charlotte-green">Sign Up</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-unc-charlotte-green mb-1">
            Email (must be @charlotte.edu)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-unc-charlotte-gold focus:border-unc-charlotte-gold text-unc-charlotte-green"
            required
            placeholder="your.name@charlotte.edu"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-unc-charlotte-green mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-unc-charlotte-gold focus:border-unc-charlotte-gold text-unc-charlotte-green"
            required
            minLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>
        <button
          type="submit"
          className="w-full bg-unc-charlotte-green text-white font-bold py-2 px-4 rounded hover:bg-unc-charlotte-gold hover:text-unc-charlotte-green transition-colors"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-unc-charlotte-green">
          Already have an account?{" "}
          <Link to="/login" className="text-unc-charlotte-gold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup

