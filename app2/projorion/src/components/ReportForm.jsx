"use client"

import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const BUILDING_COORDINATES = {
  atkins: [35.305809638726224, -80.73216064203982],
  barnard: [35.30674, -80.73315],
  "belk-gym": [35.30548, -80.73452],
  bioinformatics: [35.31235, -80.74212],
  burson: [35.30768, -80.73252],
  cameron: [35.30703, -80.73358],
  cato: [35.30742, -80.73098],
  "center-city": [35.22735, -80.83721],
  cone: [35.30548, -80.73315],
  duke: [35.31235, -80.73452],
  epic: [35.30987, -80.74212],
  fretwell: [35.30548, -80.73252],
  friday: [35.30674, -80.73358],
  grigg: [35.31235, -80.73098],
  kennedy: [35.30768, -80.73721],
  macy: [35.30703, -80.73452],
  mceniry: [35.30742, -80.73252],
  "memorial-hall": [35.30548, -80.73358],
  motorsports: [35.31235, -80.73098],
  portal: [35.30987, -80.73721],
  prospector: [35.30768, -80.73452],
  robinson: [35.30703, -80.73252],
  rowe: [35.30742, -80.73358],
  smith: [35.30548, -80.73098],
  storrs: [35.30674, -80.73721],
  "student-union": [35.30987, -80.73452],
  "university-recreation-center": [35.30768, -80.73252],
  urec: [35.30703, -80.73358],
  woodward: [35.307045385840325, -80.73576861445225],
}

function ReportForm() {
  const [temperatureFeeling, setTemperatureFeeling] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const temperatureOptions = [
    { value: "freezing", label: "FREEZING", temperature: 45 },
    { value: "cold", label: "COLD", temperature: 55 },
    { value: "just-right", label: "JUST RIGHT", temperature: 70 },
    { value: "hot", label: "HOT", temperature: 85 },
    { value: "sweltering", label: "SWELTERING", temperature: 95 },
  ]

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const findNearestBuilding = (userLat, userLon) => {
    let nearestBuilding = null
    let shortestDistance = Number.POSITIVE_INFINITY

    Object.entries(BUILDING_COORDINATES).forEach(([buildingCode, coords]) => {
      const distance = calculateDistance(userLat, userLon, coords[0], coords[1])

      if (distance < shortestDistance) {
        shortestDistance = distance
        nearestBuilding = buildingCode
      }
    })

    return nearestBuilding
  }

  const getUserLocation = () => {
    setIsLocating(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })

        const nearestBuilding = findNearestBuilding(latitude, longitude)
        if (nearestBuilding) {
          setLocation(nearestBuilding)
        }

        setIsLocating(false)
      },
      (error) => {
        let errorMessage = "Unable to get your location"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable"
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out"
            break
        }

        setLocationError(errorMessage)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const selectedOption = temperatureOptions.find((option) => option.value === temperatureFeeling)
      const temperatureValue = selectedOption ? selectedOption.temperature : null

      const selectedBuilding = campusBuildings.find((building) => building.value === location)
      const buildingLabel = selectedBuilding ? selectedBuilding.label : location

      const reportData = {
        temperature: temperatureValue,
        temperature_feeling: temperatureFeeling,
        location: location,
        location_name: buildingLabel,
        user_id: user.id,
        user_email: user.email,
      }

      console.log("Submitting to TemperatureReports table:", reportData)

      const { data, error } = await supabase.from("TemperatureReports").insert([reportData]).select()

      if (error) {
        throw error
      }

      alert(
        `Temperature report submitted successfully! Recorded as ${selectedOption.label} (${temperatureValue}°F) at ${buildingLabel}`,
      )
      setTemperatureFeeling("")
      setLocation("")
      setUserLocation(null)

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
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="location" className="block text-lg font-medium text-white">
              Location on Campus
            </label>
            <button
              type="button"
              onClick={getUserLocation}
              disabled={isLocating}
              className="text-sm bg-unc-charlotte-gold text-unc-charlotte-green px-3 py-1 rounded-md hover:bg-opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            >
              {isLocating ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-unc-charlotte-green"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Locating...
                </span>
              ) : (
                "Use My Location"
              )}
            </button>
          </div>

          {locationError && <div className="mb-2 text-red-300 text-sm">{locationError}</div>}

          {userLocation && (
            <div className="mb-2 text-green-300 text-sm">Location found! Nearest building selected.</div>
          )}

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

