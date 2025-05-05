"use client"

import { useState, useEffect } from "react"
import "leaflet/dist/leaflet.css" // renders tiles correctly
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import PropTypes from "prop-types"
import { useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet.heat"
import { supabase } from "../lib/supabase"

// Building coordinates mapping
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

// Create heat map layer
const HeatmapLayer = ({ data }) => {
  const map = useMap() // Get access to the existing map instance

  useEffect(() => {
    if (!map || !data || data.length === 0) return

    // Create a heatmap layer
    const heatLayer = L.heatLayer(data, {
      radius: 25, // Adjusts the spread of the heat
      blur: 8, // Softens the heat
      maxZoom: 10,
    }).addTo(map)

    return () => {
      map.removeLayer(heatLayer) // Cleanup
    }
  }, [map, data])

  return null
}

// Define prop types for HeatmapLayer
HeatmapLayer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.number, PropTypes.number])),
  ).isRequired,
}

const Map = () => {
  const [heatmapData, setHeatmapData] = useState([])
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)

  // Function to normalize temperature to a 0-1 scale for heatmap intensity
  const normalizeTemperature = (temp) => {
    // Assuming temperature range from 40-100°F
    const min = 40
    const max = 100
    return Math.max(0, Math.min(1, (temp - min) / (max - min)))
  }

  useEffect(() => {
    const fetchTemperatureData = async () => {
      try {
        setLoading(true)

        // Fetch all temperature reports
        const { data: reports, error } = await supabase
          .from("TemperatureReports")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) throw error

        // Group by location and calculate averages
        const buildingsMap = {}

        reports.forEach((report) => {
          if (!buildingsMap[report.location]) {
            buildingsMap[report.location] = {
              location: report.location,
              location_name: report.location_name,
              temperatures: [],
              coordinates: BUILDING_COORDINATES[report.location] || null,
            }
          }

          buildingsMap[report.location].temperatures.push(report.temperature)
        })

        // Calculate averages and format data for map
        const heatData = []
        const markerData = []

        Object.values(buildingsMap).forEach((building) => {
          // Skip buildings without coordinates
          if (!building.coordinates) return

          const sum = building.temperatures.reduce((acc, temp) => acc + temp, 0)
          const avgTemp = building.temperatures.length > 0 ? Math.round(sum / building.temperatures.length) : 0

          // Add to heatmap data
          heatData.push([building.coordinates[0], building.coordinates[1], normalizeTemperature(avgTemp)])

          // Add to markers
          markerData.push({
            position: building.coordinates,
            name: building.location_name,
            temperature: avgTemp,
          })
        })

        setHeatmapData(heatData)
        setMarkers(markerData)
      } catch (error) {
        console.error("Error fetching temperature data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemperatureData()
  }, [])

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <MapContainer center={[35.305, -80.732]} zoom={16} style={{ height: "500px", width: "80vw" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {heatmapData.length > 0 && <HeatmapLayer data={heatmapData} />}

          {/* Render Markers */}
          {markers.map((marker, index) => (
            <Marker key={index} position={marker.position}>
              <Popup>
                <strong>{marker.name}</strong> <br />
                Overall temp: {marker.temperature}°F
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  )
}

export default Map

