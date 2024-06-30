from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///networks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)


@app.route('/calculate_capacity', methods=['POST'])
def calculate_capacity():
    data = request.get_json()
    distance = data['distance']
    attenuation_per_km = data['attenuation_per_km']
    num_connectors = data['num_connectors']
    attenuation_per_connector = data['attenuation_per_connector']
    num_splices = data['num_splices']
    attenuation_per_splice = data['attenuation_per_splice']
    tx_power = data['tx_power']
    rx_sensitivity = data['rx_sensitivity']

    total_attenuation = (distance * attenuation_per_km +
                         num_connectors * attenuation_per_connector +
                         num_splices * attenuation_per_splice)
    max_distance = (tx_power - rx_sensitivity) / attenuation_per_km

    result = {
        'distance': distance,
        'attenuation_per_km': attenuation_per_km,
        'num_connectors': num_connectors,
        'attenuation_per_connector': attenuation_per_connector,
        'num_splices': num_splices,
        'attenuation_per_splice': attenuation_per_splice,
        'total_attenuation': total_attenuation,
        'tx_power': tx_power,
        'rx_sensitivity': rx_sensitivity,
        'max_distance': max_distance
    }
    return jsonify(result)

@app.route('/calculate_fiber', methods=['POST'])
def calculate_fiber():
    data = request.json
    distance = float(data['distance'])
    attenuation_per_km = float(data['attenuation_per_km'])
    num_connectors = int(data['num_connectors'])
    attenuation_per_connector = float(data['attenuation_per_connector'])
    num_splices = int(data['num_splices'])
    attenuation_per_splice = float(data['attenuation_per_splice'])
    tx_power = float(data['tx_power'])  # Puissance de transmission (en dBm)
    rx_sensitivity = float(data['rx_sensitivity'])  # Sensibilité du récepteur (en dBm)

    # Calcul de la perte totale
    total_attenuation = (distance * attenuation_per_km) + \
                        (num_connectors * attenuation_per_connector) + \
                        (num_splices * attenuation_per_splice)
    
    # Calcul du budget de puissance
    power_budget = tx_power - rx_sensitivity
    max_distance = power_budget / attenuation_per_km

    return jsonify({
        'distance': distance,
        'attenuation_per_km': attenuation_per_km,
        'num_connectors': num_connectors,
        'attenuation_per_connector': attenuation_per_connector,
        'num_splices': num_splices,
        'attenuation_per_splice': attenuation_per_splice,
        'total_attenuation': total_attenuation,
        'tx_power': tx_power,
        'rx_sensitivity': rx_sensitivity,
        'max_distance': max_distance
    })

if __name__ == '__main__':
    app.run(debug=True)
