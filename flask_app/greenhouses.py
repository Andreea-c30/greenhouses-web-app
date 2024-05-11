from flask import Blueprint
from flask import jsonify, request
from sqlalchemy import desc
import base64
import random
import datetime
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_required, get_jwt
)

from models import (
    Greenhouse, SensorData, 
    Sensor, Parameter,
    Zone
)
from db import db


greenhouses = Blueprint('greenhouses', __name__)

@greenhouses.route('create-greenhouse', methods=['POST'])
@jwt_required()
def create_greenhouse():
    """
        Create the greenhouse record in the db.
    """
    if request.method == 'POST':
        # Get the image
        image = request.files.get("image")

        # Create the greenhouse
        greenhouse = Greenhouse(
            name=request.form.get("name", default="greenhouse", type=str),
            location=request.form.get("location", default="", type=str),
            image=image.read()
        )
        db.session.add(greenhouse)
        db.session.flush()

        # Make a default zone
        zone = Zone(
            gh_id=greenhouse.id,
            name="Zone 1",
        )
        db.session.add(zone)
        db.session.commit()

        # Send the data back?
        greenhouse_dict = {}
        greenhouse_dict["id"] = greenhouse.id

        return jsonify(greenhouse_dict), 200


@greenhouses.route('get-greenhouses', methods=['GET'])
@jwt_required()
def get_greenhouses():
    """
        Obtain the basic data about the greenhouses like
        name, location, image.
    """
    if request.method == 'GET':
        greenhouses = Greenhouse.query.paginate(
            page=request.args.get('page', default=1, type=int),
            per_page=request.args.get('per_page', default=6, type=int),
        )

        greenhouses_list = []
        for greenhouse in greenhouses:
            gh_dict = {}

            # Add the id of the greenhouse
            gh_dict["greenhouse_id"] = greenhouse.id

            # Add image
            if greenhouse.image:
                image = base64.b64encode(greenhouse.image).decode("utf-8")
            else: 
                image = None
            gh_dict["image"] = image  

            # Add the name of the gh
            gh_dict["name"] = greenhouse.name

            # Add the location of the gh
            gh_dict["location"] = greenhouse.location

            # Get the parameters
            for parameter in ["temperature", "humidity", "light", "ventilation"]:
                gh_dict[parameter] = random.randint(1, 100)
                # temp, count = 0, 0
                # for zone in greenhouse.zones:
                #     par_val = SensorData.query.filter_by(zone_id=zone.id) \
                #     .join(Sensor, Sensor.id == SensorData.sensor_id) \
                #     .join(Parameter, Parameter.id == Sensor.parameter_id) \
                #     .filter(Parameter.name == parameter) \
                #     .order_by(SensorData.date.desc()).first()
                #     if par_val: 
                #          temp += par_val.data
                #          count += 1
                # gh_dict[parameter] = temp/count if count != 0 else 0

            # Save the gh to the list
            greenhouses_list.append(gh_dict)     

        if greenhouses_list:
            return jsonify(greenhouses_list), 200  
        return jsonify({"message": "No greenhouses!"}), 400
    

@greenhouses.route('update-greenhouse/<int:greenhouse_id>', methods=['PUT'])
@jwt_required()
def update_greenhouse(greenhouse_id):
    if request.method == 'PUT':
        # Find it in the db
        greenhouse = Greenhouse.query.filter_by(id=greenhouse_id).first()

        # Change the modified values.
        name = request.form.get("name")
        if name: greenhouse.name = name
        location = request.form.get("location")
        if location: greenhouse.location = location
        image = request.files.get("image")
        if image: greenhouse.image = image.read()

        # Save the changes.
        db.session.commit()
        return jsonify({"message": "Updated successfully!"}), 200
    

@greenhouses.route('delete-greenhouse/<int:greenhouse_id>', methods=['DELETE'])
@jwt_required()
def delete_greenhouse(greenhouse_id):
    if request.method == 'DELETE':
        print(get_jwt())
        row_to_delete = Greenhouse.query.get(greenhouse_id)
        if not row_to_delete:
            return jsonify({"message": "The greenhouse was already deleted!"}), 400
        db.session.delete(row_to_delete)
        db.session.commit()
        return jsonify({"message": "Greenhouse deleted successfully!"}), 200
    

@greenhouses.route('token', methods=['GET'])
def get_token():
    if request.method == 'GET':
        access_token = create_access_token(
            identity="admin", 
            expires_delta=datetime.timedelta(minutes=1),
            additional_claims={'permissions': ['read', 'delete']},
        )
        return jsonify({"jwt": access_token}), 200


# @greenhouses.route('/read-greenhouse/<int:greenhouse_id>', methods=['GET'])
# def read_greenhouse(greenhouse_id):
#     """
#         Get all the data about a greenhouse specifically the dashboard 
#         data.
#     """     
#     pass # pbl endpoint