from db import db
from sqlalchemy.sql import func


class Greenhouse(db.Model):
    __tablename__ = 'greenhouses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    image = db.Column(db.LargeBinary)

    zones = db.relationship(
        'Zone', 
        backref='greenhouse', 
        cascade="all, delete"
    )


class Zone(db.Model):
    __tablename__ = 'zones'

    id = db.Column(db.Integer, primary_key=True)
    gh_id = db.Column(db.Integer, db.ForeignKey('greenhouses.id'), nullable=False)
    name = db.Column(db.String)
    plant_id = db.Column(db.Integer, db.ForeignKey('plants.id'))

    sensor_data = db.relationship(
        'SensorData', 
        backref='zone', 
        cascade="all, delete"
    )


class Parameter(db.Model):
    __tablename__ = "parameters"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    unit = db.Column(db.String, nullable=False)

    sensors = db.relationship('Sensor', backref='parameter') 


class Sensor(db.Model):
    __tablename__ = "sensors"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    parameter_id = db.Column(db.Integer, db.ForeignKey('parameters.id'))
    
    sensor_data = db.relationship('SensorData', backref='sensor') 


class SensorData(db.Model):
    __tablename__ = "sensor_data"

    id = db.Column(db.Integer, primary_key=True)
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'))
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensors.id'))
    data = db.Column(db.Float)
    date = db.Column(db.DateTime, default=func.now())


class Plant(db.Model):
    __tablename__ = "plants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    zone = db.relationship('Zone', uselist=False, backref='plant')