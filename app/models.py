from . import db

class CapacityCalculation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    num_users = db.Column(db.Integer, nullable=False)
    bandwidth_per_user = db.Column(db.Float, nullable=False)
    contention_ratio = db.Column(db.Float, nullable=False)
    total_capacity = db.Column(db.Float, nullable=False)

class FiberOpticCalculation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    distance = db.Column(db.Float, nullable=False)
    attenuation_per_km = db.Column(db.Float, nullable=False)
    num_connectors = db.Column(db.Integer, nullable=False)
    attenuation_per_connector = db.Column(db.Float, nullable=False)
    num_splices = db.Column(db.Integer, nullable=False)
    attenuation_per_splice = db.Column(db.Float, nullable=False)
    total_attenuation = db.Column(db.Float, nullable=False)
