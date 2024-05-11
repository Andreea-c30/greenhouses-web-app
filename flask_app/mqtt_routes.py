from flask import Blueprint
from flask import jsonify, request
from db import db
from models import Parameter, SensorData
import random

mqtt = Blueprint('mqtt', __name__)

@mqtt.route('/get-sensor-data', methods=["POST"]) 
def get_sensor_data():
    pass
    # db.session.add(SensorData(
    #     zone_id=,
    #     sensor_id=,
    #     data=random.randint(1, 100)
    # ))


# @mqtt.route('/send-commands-to-actuators') 
# def send_commands_to_actuators():
#     pass