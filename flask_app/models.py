from db import db
from sqlalchemy.sql import func

class Greenhouse(db.Model):
    __tablename__ = 'greenhouses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    image = db.Column(db.LargeBinary)

    zones = db.relationship('Zone', backref='greenhouse')


class Zone(db.Model):
    __tablename__ = 'zones'

    id = db.Column(db.Integer, primary_key=True)
    gh_id = db.Column(db.Integer, db.ForeignKey('greenhouses.id'), nullable=False)
    name = db.Column(db.String)

    sensors = db.relationship('Sensor', backref='zone')


class Parameter(db.Model):
    __tablename__ = "parameters"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    unit = db.Column(db.String, nullable=False)

    sensor_type = db.relationship('SensorType', backref='parameter') 
    sensors_data = db.relationship('Sensor', backref='parameter') 


class SensorType(db.Model):
    __tablename__ = "sensor_types"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    parameter_id = db.Column(db.Integer, db.ForeignKey('parameters.id'))
    
    sensors = db.relationship('Sensor', backref='sensor_type') 


class Sensor(db.Model):
    __tablename__ = "sensors"

    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'))
    type_id = db.Column(db.Integer, db.ForeignKey('sensor_types.id'))
    data = db.Column(db.Float)
    date = db.Column(db.DateTime, default=func.now())

    parameter_id = db.Column(db.Integer, db.ForeignKey('parameters.id'))