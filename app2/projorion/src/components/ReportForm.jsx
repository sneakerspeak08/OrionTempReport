"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function ReportForm() {
  const [temperatureFeeling, setTemperatureFeeling] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  // Temperature options with associated numeric values
  const temperatureOptions = [
    { value: "freezing", label: "FREEZING", temperature: 45 },
    { value: "cold", label: "COLD", temperature: 55 },
    { value: "just-right", label: "JUST RIGHT", temperature: 70 },
    { value: "hot", label: "HOT", temperature: 85 },
    { value: "sweltering", label: "SWELTERING", temperature: 95 },
  ]

  // List of UNC Charlotte campus buildings
  const campusBuildings = [
    { value: "", label: "Select a location..." },
    { value: "atkins", label: "Atkins Library" },
    { value: "barnard", label: "Barnard Building" },
    { value: "belk-gym", label: "Belk Gym" },
    { value: "bioinformatics", label: "Bioinformatics Building" },
    { value: "burson", label: "Burson Building" },
    { value: "cameron", label: "Cameron Hall" },
    { value: "cato", label: "Cato College of Education" },
    { value: "center-city", label: "Center City Building" },
    { value: "cone", label: "Cone University Center" },
    { value: "duke", label: "Duke Centennial Hall" },
    { value: "epic", label: "EPIC Building" },
    { value: "fretwell", label: "Fretwell Building" },
    { value: "friday", label: "Friday Building" },
    { value: "grigg", label: "Grigg Hall" },
    { value: "kennedy", label: "Kennedy Building" },
    { value: "macy", label: "Macy Building" },
    { value: "mceniry", label: "McEniry Building" },
    { value: "memorial-hall", label: "Memorial Hall" },
    { value: "motorsports", label: "Motorsports Research Building" },
    { value: "portal", label: "PORTAL Building" },
    { value: "prospector", label: "Prospector Building" },
    { value: "robinson", label: "Robinson Hall" },
    { value: "rowe", label: "Rowe Building" },
    { value: "smith", label: "Smith Building" },
    { value: "storrs", label: "Storrs Building" },
    { value: "student-union", label: "Student Union" },
    { value: "university-recreation-center", label: "University Recreation Center" },
    { value: "urec", label: "UREC" },
    { value: "woodward", label: "Woodward Hall" },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Find the selected option to get its temperature value
      const selectedOption = temperatureOptions.find((option) => option.value === temperatureFeeling)
      const temperatureValue = selectedOption ? selectedOption.temperature : null

      // Find the selected building label
      const selectedBuilding = campusBuildings.find((building) => building.value === location)
      const buildingLabel = selectedBuilding ? selectedBuilding.label : location

      // Create the report object with all fields for our new table
      const reportData = {
        temperature: temperatureValue,
        temperature_feeling: temperatureFeeling,
        location: location,
        location_name: buildingLabel,
        user_id: user.id,
        user_email: user.email,
      }

      console.log("Submitting to TemperatureReports table:", reportData)

      // Save to Supabase using the new table - IMPORTANT: Use "TemperatureReports", not "Reports"
      const { data, error } = await supabase
        .from("TemperatureReports") // Make sure this matches exactly the table name you created
        .insert([reportData])
        .select()

      if (error) {
        throw error
      }

      // Success - reset form and show success message
      alert(
        `Temperature report submitted successfully! Recorded as ${selectedOption.label} (${temperatureValue}°F) at ${buildingLabel}`,
      )
      setTemperatureFeeling("")
      setLocation("")

      // Navigate to reports page
      navigate("/reports")
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Failed to submit temperature report: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">Report Temperature</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-white mb-2">How does it feel?</label>
          <div className="flex flex-wrap gap-2">
            {temperatureOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`
                  flex-1 min-w-[120px] p-4 rounded-lg font-bold transition-all h-14
                  ${getTemperatureColor(option.value)}
                  ${temperatureFeeling === option.value ? "ring-4 ring-white" : "hover:opacity-90"}
                `}
                onClick={() => setTemperatureFeeling(option.value)}
              >
                {option.value === "just-right" ? <span className="whitespace-nowrap">JUST RIGHT</span> : option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-lg font-medium text-white mb-2">
            Location on Campus
          </label>
          <div className="relative">
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-lg bg-white text-unc-charlotte-green text-lg focus:ring-4 focus:ring-unc-charlotte-gold focus:ring-opacity-50 focus:outline-none transition-all appearance-none pr-10"
              required
            >
              {campusBuildings.map((building) => (
                <option key={building.value} value={building.value}>
                  {building.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-5 h-5 text-unc-charlotte-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{ backgroundColor: "#A49665" }}
          className="w-full text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors duration-200 mt-8 hover:opacity-90 focus:ring-4 focus:ring-unc-charlotte-gold focus:ring-opacity-50 focus:outline-none"
          disabled={!temperatureFeeling || !location || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  )
}

// Helper function to get appropriate background color based on temperature feeling
function getTemperatureColor(feeling) {
  switch (feeling) {
    case "freezing":
      return "bg-blue-600 text-white"
    case "cold":
      return "bg-blue-400 text-white"
    case "just-right":
      return "bg-green-500 text-white"
    case "hot":
      return "bg-orange-500 text-white"
    case "sweltering":
      return "bg-red-600 text-white"
    default:
      return "bg-gray-200 text-gray-800"
  }
}

export default ReportForm

