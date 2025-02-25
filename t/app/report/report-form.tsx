"use client"

import type React from "react"

import { useState } from "react"

export function ReportForm() {
  const [temperature, setTemperature] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/temperature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ temperature, location }),
      })

      if (response.ok) {
        // Reset form
        setTemperature("")
        setLocation("")
        alert("Temperature report submitted successfully!")
      } else {
        throw new Error("Failed to submit temperature report")
      }
    } catch (error) {
      console.error("Error submitting temperature:", error)
      alert("Failed to submit temperature report")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="temperature" className="block mb-2 font-medium">
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
        <label htmlFor="location" className="block mb-2 font-medium">
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
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Submit Report
      </button>
    </form>
  )
}

