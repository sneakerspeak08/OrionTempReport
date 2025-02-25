"use client"

import { useState } from "react"

function ReportForm() {
  const [temperature, setTemperature] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log("Submitting:", { temperature, location })
      alert("Temperature report submitted successfully!")
      setTemperature("")
      setLocation("")
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to submit temperature report")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Report Temperature</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
            Temperature (°F)
          </label>
          <input
            type="number"
            id="temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            min="-20"
            max="120"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location on Campus
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            placeholder="e.g., Student Union, Library"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Report
        </button>
      </form>
    </div>
  )
}

export default ReportForm

