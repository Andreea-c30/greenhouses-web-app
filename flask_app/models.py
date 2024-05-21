from db import db
from sqlalchemy.sql import func


class Greenhouse(db.Model):
    __tablename__ = 'greenhouses'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    location = db.Column(db.String)
    img = db.Column(db.LargeBinary)
    date = db.Column(db.DateTime, default=func.now())
    imgPath = db.Column(db.String)

    zones = db.relationship(
        'Zone', 
        backref='greenhouse', 
        cascade="all, delete"
    )

    sensors = db.relationship(
        'Sensor', 
        backref='greenhouse', 
        cascade="all, delete"
    )

    sensors_data = db.relationship(
        'SensorData',
        backref='greenhouse',
        cascade="all, delete"
    )


class Zone(db.Model):
    __tablename__ = 'zones'

    id = db.Column(db.Integer, primary_key=True)
    gh_id = db.Column(db.Integer, db.ForeignKey('greenhouses.id'))
    name = db.Column(db.String)
    plant_id = db.Column(db.Integer, db.ForeignKey('plants.id'))

    sensors_data = db.relationship(
        'SensorData', 
        backref='zone', 
        cascade="all, delete"
    )

    sensors = db.relationship(
        'Sensor', 
        backref='zone', 
        cascade="all, delete"
    )


class Parameter(db.Model):
    __tablename__ = "parameters"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    unit = db.Column(db.String)

    sensors = db.relationship('Sensor', backref='parameter') 
    conditions = db.relationship('Condition', backref='parameter')
    sensors_data = db.relationship('SensorData', backref='parameter')


class Sensor(db.Model):
    __tablename__ = "sensors"

    id = db.Column(db.Integer, primary_key=True)
    gh_id = db.Column(db.Integer, db.ForeignKey('greenhouses.id'))
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'))
    name = db.Column(db.String)
    parameter_id = db.Column(db.Integer, db.ForeignKey('parameters.id'))
    mqtt_topic = db.Column(db.String)
    
    sensor_data = db.relationship('SensorData', backref='sensor') 


class SensorData(db.Model):
    __tablename__ = "sensors_data"

    id = db.Column(db.Integer, primary_key=True)
    gh_id = db.Column(db.Integer, db.ForeignKey('greenhouses.id'))
    zone_id = db.Column(db.Integer, db.ForeignKey('zones.id'))
    sensor_id = db.Column(db.Integer, db.ForeignKey('sensors.id'))
    data = db.Column(db.Float)
    date = db.Column(db.DateTime, default=func.now())
    parameter_id = db.Column(db.Integer, db.ForeignKey('parameters.id'))


class Plant(db.Model):
    __tablename__ = "plants"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)

    zone = db.relationship('Zone', uselist=False, backref='plant')
    conditions = db.relationship('Condition', backref='plant')


class Condition(db.Model):
    __tablename__ = "conditions"

    plant_id = db.Column(db.Integer, db.ForeignKey('plants.id'), primary_key=True)
    parameter_id = db.Column(db.Integer, db.ForeignKey('parameters.id'), primary_key=True)
    name = db.Column(db.String)
    duration = db.Column(db.Time)