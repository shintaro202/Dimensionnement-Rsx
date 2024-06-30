from flask import Blueprint, request, jsonify
from .models import CapacityCalculation, FiberOpticCalculation
from . import db

main = Blueprint('main', __name__)

@main.route('/calculate_capacity', methods=['POST'])
def calculate_capacity():
    data = request.get_json()
    num_users = data['num_users']
    bandwidth_per_user = data['bandwidth_per_user']
    contention_ratio = data['contention_ratio']

    total_capacity = num_users * bandwidth_per_user / contention_ratio

    new_calculation = CapacityCalculation(
        num_users=num_users,
        bandwidth_per_user=bandwidth_per_user,
        contention_ratio=contention_ratio,
        total_capacity=total_capacity
    )
    db.session.add(new_calculation)
    db.session.commit()

    return jsonify({
        'num_users': num_users,
        'bandwidth_per_user': bandwidth_per_user,
        'contention_ratio': contention_ratio,
        'total_capacity': total_capacity
    }), 201

@main.route('/calculate_fiber', methods=['POST'])
def calculate_fiber():
    data = request.get_json()
    distance = data['distance']
    attenuation_per_km = data['attenuation_per_km']
    num_connectors = data['num_connectors']
    attenuation_per_connector = data['attenuation_per_connector']
    num_splices = data['num_splices']
    attenuation_per_splice = data['attenuation_per_splice']

    total_attenuation = (
        distance * attenuation_per_km +
        num_connectors * attenuation_per_connector +
        num_splices * attenuation_per_splice
    )

    new_calculation = FiberOpticCalculation(
        distance=distance,
        attenuation_per_km=attenuation_per_km,
        num_connectors=num_connectors,
        attenuation_per_connector=attenuation_per_connector,
        num_splices=num_splices,
        attenuation_per_splice=attenuation_per_splice,
        total_attenuation=total_attenuation
    )
    db.session.add(new_calculation)
    db.session.commit()

    return jsonify({
        'distance': distance,
        'attenuation_per_km': attenuation_per_km,
        'num_connectors': num_connectors,
        'attenuation_per_connector': attenuation_per_connector,
        'num_splices': num_splices,
        'attenuation_per_splice': attenuation_per_splice,
        'total_attenuation': total_attenuation
    }), 201
