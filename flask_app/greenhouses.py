from flask import Blueprint
from flask import jsonify, request
from sqlalchemy import desc


from models import Greenhouse, Sensor, SensorType, Parameter
from db import db
import base64


greenhouses = Blueprint('greenhouses', __name__)

@greenhouses.route('create-greenhouse', methods=['POST'])
def create_greenhouse():
    """
        Create the greenhouse record in the db.
    """
    if request.method == 'POST':
        files_values = list(request.files.values())
        if not files_values:
            image = None
        else:
            image = files_values[0].read()
        greenhouse = Greenhouse(
            name=request.form.get("name", default="greenhouse", type=str),
            location=request.form.get("location", default="", type=str),
            image=image
        )
        db.session.add(greenhouse)
        db.session.commit()
        return jsonify({"message": "Greenhouse was saved in the DB!"})


@greenhouses.route('/get-greenhouses', methods=['GET'])
def get_greenhouses():
    """
        Obtain the basic data about the greenhouses like
        name, location and image.
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

            # Get the parameter values
            for parameter in ["temperature", "humidity", "light", "ventilation"]:
                parameter_record = Parameter.query.filter_by(name=parameter).first()
                sensor_data = Sensor.query.filter_by(parameter_id=parameter_record.id).\
                    order_by(Sensor.date.desc()).first().data
                gh_dict[parameter] = sensor_data

            # Save the gh to the list
            greenhouses_list.append(gh_dict)     

        if greenhouses_list:
            return jsonify(greenhouses_list), 200  
        return jsonify({"message": "No greenhouses!"}), 400
    

@greenhouses.route('/update-greenhouse', methods=['PUT'])
def update_greenhouse():
    pass


@greenhouses.route('/delete-greenhouse', methods=['DELETE'])
def delete_greenhouse():
    pass


@greenhouses.route('/read-greenhouse/<int:greenhouse_id>', methods=['GET'])
def read_greenhouse(greenhouse_id):
    """
        Get all the data about a greenhouse specifically the dashboard 
        data.
    """     
    pass # pbl endpoint