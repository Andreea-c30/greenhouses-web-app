from flask import Blueprint, request, jsonify
from sqlalchemy.sql import func
import json
from datetime import datetime, timedelta

from models import Condition, Plant, Zone, SensorData, Parameter
from mqtt_connector import publish_mqtt
from db import db


zones = Blueprint('zones', __name__)

@zones.route('/create-zone', methods=['POST'])
def create_zone():
    if request.method == 'POST':
        gh_id = request.form.get("gh_id")
        if not gh_id or not isinstance(gh_id, int):
            return jsonify({"message": "Invalid greenhouse id!"})
        
        name = request.form.get("name")
        if not name or not isinstance(name, str):
            return jsonify({"message": "Invalid zone name!"})
        
        zone = Zone(
            gh_id=gh_id,
            name=name
        )
        db.session.add(zone)
        db.session.commit()

        return jsonify({"message": "Zone created successfully!"})


@zones.route('/get-zones', methods=['GET'])
def get_zone():
    if request.method == 'GET':
        gh_id = request.form.get("gh_id")
        if not gh_id or not isinstance(gh_id, int):
            return jsonify({"message": "Invalid greenhouse id!"})
        
        zones = Zone.query.filter_by(gh_id=gh_id).all()
        if zones:
            zones_data = {}
            for zone in zones:
                zone_dict = {}
                zone_dict["name"] = zone.name
                if zone.plant_id:
                    zone_dict["plant_name"] = zone.plant.name
                if zone.plantation_date:
                    zone_dict["plantation_date"] = zone.plantation_date.isoformat()

                # Add the sensors data
                for sensor in zone.sensors:
                    sensor_data = {}
                    sensor_data["name"] = sensor.name
                    sensor_data["parameter_name"] = sensor.parameter.name
                    zone_dict[sensor.id] = sensor_data

                # Add the averages of every parameter that exist for this zone
                parameter_averages = db.session.query(
                    Parameter.name, 
                    func.avg(SensorData.data).label('average_data')
                ) \
                .join(SensorData, Parameter.id == SensorData.parameter_id) \
                .filter(SensorData.gh_id == gh_id) \
                .filter(SensorData.zone_id == zone.id) \
                .group_by(Parameter.name) \
                .all()

                zone_dict["parameters_averages"] = parameter_averages
                zones_data[zone.id] = zone_dict
            
            return jsonify(zones_data), 200
        else:
            return jsonify({"message": "No zones!"}), 404


@zones.route('/update-zone', methods=['PUT'])
def update_zone():
    pass


@zones.route('/delete-zone', methods=['DELETE'])
def delete_zone():
    pass


@zones.route('/choose-plant', methods=['GET', 'POST'])
def choose_plant():
    if request.method == 'GET':
        # Send the available plants from the DB.
        plants = Plant.query.all()
        plants_data = [(plant.id, plant.name) for plant in plants]
        return jsonify(plants_data), 200

    if request.method == 'POST': 
        # Get the plant's id from the front
        plant_id = request.args.get("plant_id", type=int)
        zone_id = request.args.get("zone_id", type=int)

        # Get the zone record from the db
        zone = Zone.query.filter_by(id=zone_id).first()

        if not zone.plant_id or zone.plant_id != plant_id:
            # Add the plant to the zone
            zone.plant_id = plant_id
            zone.plantation_date = func.now()

            # Get all conditions of the plant of order 1
            conditions = Plant.query\
                .filter_by(id=plant_id, order=1)\
                .first().conditions

            # Send the plants' conditions to the MQTT
            for condition in conditions:
                # Build the command
                command = {"cmd": "set_point", "value": str(condition.value)}

                # Get the topic and publish the command
                for sensor in zone.sensors:
                    if condition.parameter_id == sensor.parameter_id:
                        # Send the command
                        publish_mqtt(sensor.mqtt_topic, json.dumps(command))

            # Save the changes to db
            db.session.commit()

            return jsonify({"message": "Planted!"}), 200
        return jsonify({"message": "Already planted!"}), 204



# @zones.route('/check-plant-condition', methods=['GET', 'POST'])
# def check_plant():
#     def change_cond(plantation_date, cond_hours):
#     if plantation_date + timedelta(hours=cond_hours) >= datetime.now():
#         return True
#     return False
#     # Consider the case when the plant has already been planted
#     # and you have to check if you have to change the parameter's
#     # condition. For instance, if the humidity has to change to
#     # another value because the plant might not need as much of it.

#     # Get all conditions of the plant by its id
#     conditions = Plant.query.filter_by(id=plant_id).first().conditions

#     # Check if the condition passed its time
#     for condition in conditions:
#         if change_cond(zone.plantation_date, condition.duration):
#             # Change this condition to the next one for all MCUs
#             pass

#     # The format to send to the MQTT
#     # {"cmd": "set_point", "value": "12.2"}