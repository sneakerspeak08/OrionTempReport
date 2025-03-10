import 'leaflet/dist/leaflet.css'; // renders tiles correctly
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import PropTypes from 'prop-types';
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";


// Process coords and temps from database
// average temps per building to display on map
// convert temps to 0-1 ratio
const temps = [
  [35.307045385840325, -80.73576861445225, .9], // woodward (average temps per building?)
  [35.305809638726224, -80.73216064203982, .4], //Atkins
];

const markers = [
  { position: [35.307045385840325, -80.73576861445225], name: "Woodward", temperature: 90 },
  { position: [35.305809638726224, -80.73216064203982], name: "Atkins", temperature: 87 },
];


// Create heat map layer
const HeatmapLayer = ({ data }) => {
  const map = useMap(); // Get access to the existing map instance

  useEffect(() => {
    if (!map) return;

    // Create a heatmap layer
    const heatLayer = L.heatLayer(data, {
      radius: 25,  // Adjusts the spread of the heat
      blur: 8,    // Softens the heat
      maxZoom: 10,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer); // Cleanup
    };
  }, [map, data]);

  return null;
};

const Map = () => (  
  <MapContainer center={[35.305, -80.732]} zoom={16} style={{ height: "500px", width: "80vw" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <HeatmapLayer data={temps} />

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
  
);

export default Map;

// Define prop types for HeatmapLayer
HeatmapLayer.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.number,
        PropTypes.number
      ])
    )
  ).isRequired,
};