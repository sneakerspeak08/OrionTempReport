"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Reported" },
  { value: "oldest", label: "Oldest Reported" },
  { value: "hottest", label: "Hottest to Coldest" },
  { value: "coldest", label: "Coldest to Hottest" },
]

export default function ReportsPage() {
  const [buildingReports, setBuildingReports] = useState([])
  const [sortedReports, setSortedReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedBuilding, setExpandedBuilding] = useState(null)
  const [detailedReports, setDetailedReports] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [sortOption, setSortOption] = useState("latest")

  useEffect(() => {
    fetchBuildingAverages()
  }, [])

 
  useEffect(() => {
    sortReports(sortOption)
  }, [buildingReports, sortOption])

  const sortReports = (option) => {
    if (!buildingReports.length) return

    const sorted = [...buildingReports]

    switch (option) {
      case "latest":
        // Sort by most recently reported (default)
        sorted.sort((a, b) => new Date(b.lastReported) - new Date(a.lastReported))
        break
      case "oldest":
        // Sort by oldest reported
        sorted.sort((a, b) => new Date(a.lastReported) - new Date(b.lastReported))
        break
      case "hottest":
        // Sort by temperature (highest to lowest)
        sorted.sort((a, b) => b.averageTemperature - a.averageTemperature)
        break
      case "coldest":
        // Sort by temperature (lowest to highest)
        sorted.sort((a, b) => a.averageTemperature - b.averageTemperature)
        break
      default:
        // Default to latest reported
        sorted.sort((a, b) => new Date(b.lastReported) - new Date(a.lastReported))
    }

    setSortedReports(sorted)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  const fetchBuildingAverages = async () => {
    setLoading(true)
    try {
      console.log("Fetching from TemperatureReports table")

      const { data: reports, error } = await supabase
        .from("TemperatureReports")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      console.log("Fetched reports:", reports)


      const buildingsMap = {}

      reports.forEach((report) => {
        if (!buildingsMap[report.location]) {
          buildingsMap[report.location] = {
            location: report.location,
            location_name: report.location_name,
            temperatures: [],
            reportCount: 0,
            lastReported: report.created_at,
          }
        }

        buildingsMap[report.location].temperatures.push(report.temperature)
        buildingsMap[report.location].reportCount++

        if (new Date(report.created_at) > new Date(buildingsMap[report.location].lastReported)) {
          buildingsMap[report.location].lastReported = report.created_at
        }
      })


      const buildingData = Object.values(buildingsMap).map((building) => {
        const sum = building.temperatures.reduce((acc, temp) => acc + temp, 0)
        const avgTemp = building.temperatures.length > 0 ? Math.round(sum / building.temperatures.length) : 0

        return {
          location: building.location,
          location_name: building.location_name,
          averageTemperature: avgTemp,
          reportCount: building.reportCount,
          lastReported: building.lastReported,
        }
      })

      setBuildingReports(buildingData)
    } catch (error) {
      console.error("Error fetching building averages:", error)
      alert("Failed to load reports: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchBuildingDetails = async (location) => {
    if (expandedBuilding === location) {
      // If already expanded, collapse it
      setExpandedBuilding(null)
      setDetailedReports([])
      return
    }

    setLoadingDetails(true)
    setExpandedBuilding(location)

    try {
      const { data, error } = await supabase
        .from("TemperatureReports") 
        .select("*")
        .eq("location", location)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        throw error
      }

      setDetailedReports(data)
    } catch (error) {
      console.error("Error fetching building details:", error)
      alert("Failed to load building details: " + error.message)
    } finally {
      setLoadingDetails(false)
    }
  }

  const getTemperatureColor = (temp) => {
    if (temp <= 50) return "text-blue-600"
    if (temp <= 60) return "text-blue-400"
    if (temp <= 80) return "text-green-500"
    if (temp <= 90) return "text-orange-500"
    return "text-red-600"
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-4xl font-bold text-center mb-8 text-white">Campus Temperature Reports</h2>

      {/* Sorting dropdown */}
      <div className="mb-6">
        <div className="flex items-center justify-end">
          <label htmlFor="sort-select" className="mr-2 text-white font-medium">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortOption}
              onChange={handleSortChange}
              className="bg-white text-unc-charlotte-green py-2 px-4 pr-8 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-unc-charlotte-gold"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedReports.length > 0 ? (
            sortedReports.map((building) => (
              <div key={building.location} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fetchBuildingDetails(building.location)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-unc-charlotte-green">{building.location_name}</h3>
                    <div className={`text-2xl font-bold ${getTemperatureColor(building.averageTemperature)}`}>
                      {building.averageTemperature}°F
                    </div>
                  </div>
                  <div className="mt-2 text-gray-600">
                    <p>
                      {building.reportCount} reports • Last updated {new Date(building.lastReported).toLocaleString()}
                    </p>
                  </div>
                </div>

                {expandedBuilding === building.location && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <h4 className="font-bold mb-2 text-unc-charlotte-green">Recent Reports</h4>

                    {loadingDetails ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-unc-charlotte-green"></div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {detailedReports.map((report) => (
                          <div key={report.id} className="bg-white p-2 rounded border border-gray-200">
                            <div className="flex justify-between">
                              <span className={`font-bold ${getTemperatureColor(report.temperature)}`}>
                                {report.temperature}°F ({report.temperature_feeling.toUpperCase()})
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(report.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">Reported by: {report.user_email}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center text-white text-xl p-8 bg-unc-charlotte-green bg-opacity-30 rounded-lg">
              No temperature reports found. Be the first to submit a report!
            </div>
          )}
        </div>
      )}
    </div>
  )
}

