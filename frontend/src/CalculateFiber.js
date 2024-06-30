import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CalculateFiber.css'; // Votre fichier CSS personnalisé pour la carte
import L from 'leaflet';

// Assurez-vous d'importer les images nécessaires
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function CalculateFiber() {
  const [formData, setFormData] = useState({
    distance: '',
    attenuation_per_km: '',
    num_connectors: '',
    attenuation_per_connector: '',
    num_splices: '',
    attenuation_per_splice: '',
    tx_power: '',
    rx_sensitivity: ''
  });
  const [result, setResult] = useState(null);
  const [center, setCenter] = useState([14.6928, -17.4467]); // Centre de la carte (Dakar)
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFiberSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/calculate_fiber', formData);
      setResult(response.data);
      const coverageRadius = response.data.max_distance; // Utilisez la distance maximale de couverture pour définir le rayon
      const coveragePolygon = generateCoveragePolygon(center, coverageRadius);
      setPolygonPoints(coveragePolygon);
    } catch (error) {
      setError('Erreur lors du calcul du dimensionnement de la fibre.');
      console.error('Error calculating fiber dimensioning:', error);
    }
  };

  const generateCoveragePolygon = (center, radius) => {
    const points = [];
    const earthRadius = 6371; // Rayon de la Terre en kilomètres
    const angularRadius = radius / earthRadius;

    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2;
      const latitude = center[0] + angularRadius * (180 / Math.PI) * Math.cos(angle);
      const longitude = center[1] + (angularRadius * (180 / Math.PI) / Math.cos(center[0] * Math.PI / 180)) * Math.sin(angle);
      points.push([latitude, longitude]);
    }
    return points;
  };

  useEffect(() => {
    if (result) {
      const coverageRadius = result.max_distance;
      const coveragePolygon = generateCoveragePolygon(center, coverageRadius);
      setPolygonPoints(coveragePolygon);
    }
  }, [center, result]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setCenter([event.latlng.lat, event.latlng.lng]);
      },
    });
    return null;
  };

  return (
    <div className="container">
      <h1>Dimensionnement de la Fibre Optique</h1>
      <form onSubmit={handleFiberSubmit}>
        <input
          type="number"
          name="distance"
          placeholder="Distance (km)"
          value={formData.distance}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="attenuation_per_km"
          placeholder="Atténuation par km (dB)"
          value={formData.attenuation_per_km}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="num_connectors"
          placeholder="Nombre de connecteurs"
          value={formData.num_connectors}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="attenuation_per_connector"
          placeholder="Atténuation par connecteur (dB)"
          value={formData.attenuation_per_connector}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="num_splices"
          placeholder="Nombre de soudures"
          value={formData.num_splices}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="attenuation_per_splice"
          placeholder="Atténuation par soudure (dB)"
          value={formData.attenuation_per_splice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="tx_power"
          placeholder="Puissance de transmission (dBm)"
          value={formData.tx_power}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rx_sensitivity"
          placeholder="Sensibilité du récepteur (dBm)"
          value={formData.rx_sensitivity}
          onChange={handleChange}
          required
        />
        <button type="submit">Calculer</button>
      </form>

      {error && <p className="error">{error}</p>}
      
      <MapContainer center={center} zoom={13} className="map">
        <MapClickHandler />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={defaultIcon}>
          <Popup>Point de départ</Popup>
        </Marker>
        {polygonPoints.length > 0 && (
          <Polygon positions={polygonPoints} pathOptions={{ color: 'orange' }} />
        )}
      </MapContainer>

      {result && (
        <div className="result">
          <h2>Résultat:</h2>
          <p>Distance maximale couverte: {result.max_distance.toFixed(2)} km</p>
          <p>Atténuation par km: {result.attenuation_per_km} dB/km</p>
          <p>Nombre de connecteurs: {result.num_connectors}</p>
          <p>Atténuation par connecteur: {result.attenuation_per_connector} dB</p>
          <p>Nombre de soudures: {result.num_splices}</p>
          <p>Atténuation par soudure: {result.attenuation_per_splice} dB</p>
          <p>Atténuation totale: {result.total_attenuation} dB</p>
        </div>
      )}
    </div>
  );
}

export default CalculateFiber;
