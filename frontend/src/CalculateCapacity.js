import React, { useState } from 'react';
import axios from 'axios';
import './CalculateCapacity.css'
function FiberDimensioning() {
  const [distance, setDistance] = useState('');
  const [attenuationPerKm, setAttenuationPerKm] = useState('');
  const [numConnectors, setNumConnectors] = useState('');
  const [attenuationPerConnector, setAttenuationPerConnector] = useState('');
  const [numSplices, setNumSplices] = useState('');
  const [attenuationPerSplice, setAttenuationPerSplice] = useState('');
  const [txPower, setTxPower] = useState('');
  const [rxSensitivity, setRxSensitivity] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/calculate_fiber', {
        distance: distance,
        attenuation_per_km: attenuationPerKm,
        num_connectors: numConnectors,
        attenuation_per_connector: attenuationPerConnector,
        num_splices: numSplices,
        attenuation_per_splice: attenuationPerSplice,
        tx_power: txPower,
        rx_sensitivity: rxSensitivity
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error calculating fiber dimensioning:', error);
    }
  };

  return (
    <div className="container">
    <h1>Dimensionnement de la Fibre Optique</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label>Distance (km):</label>
        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Atténuation par km (dB/km):</label>
        <input
          type="number"
          value={attenuationPerKm}
          onChange={(e) => setAttenuationPerKm(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Nombre de connecteurs:</label>
        <input
          type="number"
          value={numConnectors}
          onChange={(e) => setNumConnectors(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Atténuation par connecteur (dB):</label>
        <input
          type="number"
          value={attenuationPerConnector}
          onChange={(e) => setAttenuationPerConnector(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Nombre de soudures:</label>
        <input
          type="number"
          value={numSplices}
          onChange={(e) => setNumSplices(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Atténuation par soudure (dB):</label>
        <input
          type="number"
          value={attenuationPerSplice}
          onChange={(e) => setAttenuationPerSplice(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Puissance de transmission (dBm):</label>
        <input
          type="number"
          value={txPower}
          onChange={(e) => setTxPower(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Sensibilité du récepteur (dBm):</label>
        <input
          type="number"
          value={rxSensitivity}
          onChange={(e) => setRxSensitivity(e.target.value)}
          required
        />
      </div>
      <button type="submit">Calculer</button>
      </form>
      {result && (
        <div className="result-container">
          <h2>Résultat:</h2>
          <p className="result-highlight">Distance maximale couverte: {result.max_distance.toFixed(2)} km</p>
          {result.max_distance >= distance ? (
            <p className="result-success">
              Ce dimensionnement est possible car la distance maximale de couverture est de {result.max_distance.toFixed(2)} km ce qui est supérieur à {distance} km.
            </p>
          ) : (
            <p className="result-failure">
              Ce dimensionnement n'est pas possible car la distance maximale de couverture est de {result.max_distance.toFixed(2)} km ce qui est inférieur à {distance} km.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export default FiberDimensioning;
