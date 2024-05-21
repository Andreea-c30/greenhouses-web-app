from flask import Blueprint, request, jsonify
from sqlalchemy.sql import func
import json
from datetime import datetime, timedelta

from models import Condition, Plant, Zone
from mqtt_connector import publish_mqtt
from db import db


zones = Blueprint('zones', __name__)

@zones.route('/create-zone', methods=['POST'])
def create_zone():
    pass


@zones.route('/get-zone', methods=['GET'])
def get_zone():
    pass


@zones.route('/update-zone', methods=['PUT'])
def update_zone():
    pass


@zones.route('/delete-zone', methods=['DELETE'])
def delete_zone():
    pass


@zones.route('/choose-plant', methods=['GET', 'POST'])
def choose_plant():
    def change_cond(plantation_date, cond_hours):
        if plantation_date + timedelta(hours=cond_hours) >= datetime.now():
            return True
        return False


    if request.method == 'GET':
        # Send the available plants from the DB.
        pass

    # This method will have to be regularly used from front so 
    # the plant would receive the correct condition based on duration 
    # of the condition from the "conditions" table.
    if request.method == 'POST': 
        # Get the plant's id from the front
        plant_id = request.args.get("plant_id", type=int)
        zone_id = request.args.get("zone_id", type=int)

        # Send the data from "conditions" table to the MCUs,
        # for the chosen plant and zone.
        zone = Zone.query.filter_by(id=zone_id).first()

        if not zone.plant_id or zone.plant_id != plant_id:
            # Add the plant to the zone
            zone.plant_id = plant_id
            zone.plantation_date = func.now()

            # Get all conditions of the plant of order 1
            conditions = Plant.query\
                .filter_by(id=plant_id, next=0)\
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

            db.session.commit()
        else:
            conditions = Plant.query.filter_by(id=plant_id).first().conditions

            # Check if the condition passed its time
            for condition in conditions:
                if change_cond(zone.plantation_date, condition.duration):
                    # Change this condition to the next one for all MCUs
                    pass

            # The format to send to the MQTT
            # {"cmd": "set_point", "value": "12.2"}