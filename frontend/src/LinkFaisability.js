import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

function LinkFeasibility() {
  const [formData, setFormData] = useState({
    attenuation_per_km: '',
    num_connectors: '',
    attenuation_per_connector: '',
    num_splices: '',
    attenuation_per_splice: '',
    tx_power: '',
    rx_sensitivity: ''
  });
  const [points, setPoints] = useState([]);
  const [step, setStep] = useState(1); // Étape actuelle (1 pour placer les points, 2 pour saisir les données)
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLinkSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (step === 1) {
      if (points.length !== 2) {
        setError('Veuillez sélectionner exactement deux points sur la carte.');
        return;
      }
      const distance = calculateDistance(points[0], points[1]);
      try {
        const response = await axios.post('http://localhost:5000/calculate_fiber', {
          ...formData,
          distance: distance.toFixed(2),
          attenuation_per_km: formData.attenuation_per_km,
          num_connectors: formData.num_connectors,
          attenuation_per_connector: formData.attenuation_per_connector,
          num_splices: formData.num_splices,
          attenuation_per_splice: formData.attenuation_per_splice,
          tx_power: formData.tx_power,
          rx_sensitivity: formData.rx_sensitivity
        });

        const totalAttenuation = response.data.total_attenuation;
        const powerBudget = response.data.tx_power - response.data.rx_sensitivity;

        if (totalAttenuation <= powerBudget) {
          setMessage('Liaison possible');
        } else {
          setMessage('Liaison impossible !!! Veuillez vérifier vos paramètres');
        }
      } catch (error) {
        setError('Erreur lors du calcul de la faisabilité de la liaison.');
        console.error('Error calculating link feasibility:', error);
      }
    }
  };

  const calculateDistance = (pointA, pointB) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (pointB.lat - pointA.lat) * Math.PI / 180;
    const dLon = (pointB.lng - pointA.lng) * Math.PI / 180;
    const lat1 = pointA.lat * Math.PI / 180;
    const lat2 = pointB.lat * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return R * c; // Distance in km
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        if (points.length < 2) {
          setPoints([...points, event.latlng]);
        } else {
          setPoints([event.latlng]);
          setStep(2); // Passer à l'étape 2 après avoir placé deux points
        }
      },
    });
    return null;
  };

  return (
    <div className="container">
      <h1>{step === 1 ? 'Placer les Points' : 'Saisir les Données'}</h1>
      {step === 1 && (
        <MapContainer center={[14.6928, -17.4467]} zoom={13} className="map" style={{ height: '400px', width: '600px'}}>
          <MapClickHandler />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point, index) => (
            <Marker key={index} position={point} icon={defaultIcon}>
              <Popup>Point {index + 1}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
      {step === 2 && (
        <form onSubmit={handleLinkSubmit}>
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
      )}
      {error && <p className="error">{error}</p>}
      {message && (
        <p className={message === 'Liaison possible' ? 'success' : 'error'}>
          {message}
        </p>
      )}
    </div>
  );
}

export default LinkFeasibility;
