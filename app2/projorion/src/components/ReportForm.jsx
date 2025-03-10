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
    <div className="max-w-xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">Report Temperature</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="temperature" className="block text-lg font-medium text-white mb-2">
            Temperature (°F)
          </label>
          <input
            type="number"
            id="temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-unc-charlotte-green text-lg focus:ring-4 focus:ring-unc-charlotte-gold focus:ring-opacity-50 focus:outline-none transition-all"
            required
            min="-20"
            max="120"
            placeholder="Enter temperature"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-medium text-white mb-2">
            Location on Campus
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-unc-charlotte-green text-lg focus:ring-4 focus:ring-unc-charlotte-gold focus:ring-opacity-50 focus:outline-none transition-all"
            required
            placeholder="e.g., Student Union, Library"
          />
        </div>

        <button
          type="submit"
          style={{ backgroundColor: "#A49665" }}
          className="w-full text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-200 mt-8 hover:opacity-90 focus:ring-4 focus:ring-unc-charlotte-gold focus:ring-opacity-50 focus:outline-none"
        >
          Submit Report
        </button>
      </form>
    </div>
  )
}

export default ReportForm

