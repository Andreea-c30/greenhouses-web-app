from flask import Blueprint
from flask import jsonify, request
from db import db
from models import Parameter, Sensor
import random

mqtt = Blueprint('mqtt', __name__)

@mqtt.route('/get-sensor-data', methods=["POST"]) 
def get_sensor_data():

    while True:
        db.session.add(Sensor(
            data=331245.2,
            parameter_id=1,
        ))
        db.session.commit()
    return "HELOADAADSADS"

# @mqtt.route('/send-commands-to-actuators') 
# def send_commands_to_actuators():
#     pass
