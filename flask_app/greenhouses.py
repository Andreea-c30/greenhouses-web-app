from flask import Blueprint
from flask import jsonify, request
from sqlalchemy import desc
import base64
import random
from datetime import datetime, timedelta
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_required, get_jwt
)

from models import Greenhouse, Zone
from db import db


greenhouses = Blueprint('greenhouses', __name__)

@greenhouses.route('create-greenhouse', methods=['POST'])
@jwt_required()
def create_greenhouse():
    """
        Create the greenhouse record in the db.
    """
    if request.method == 'POST':
        if 'admin' == get_jwt()['role']:
            # Get the img
            img = request.files.get("img")
            
            # Create the greenhouse
            date = request.form.get("date")
            greenhouse = Greenhouse(
                name=request.form.get("name", default="greenhouse", type=str),
                location=request.form.get("location", default="", type=str),
                img=img.read() if img else None,
                imgPath=img.filename if img else None,
                date=datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ') if date else None
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
        return jsonify({"message": "No permissions!"}), 403


@greenhouses.route('get-greenhouses', methods=['GET'])
@jwt_required()
def get_greenhouses():
    """
        Obtain the basic data about the greenhouses like
        name, location, img.
    """
    if request.method == 'GET':
        if get_jwt()['role'] in ['admin', 'visitor']:
            greenhouses = Greenhouse.query.paginate(
                page=request.args.get('page', default=1, type=int),
                per_page=6,
            )

            greenhouses_list = []
            for greenhouse in greenhouses:
                gh_dict = {}
                # Add the id of the greenhouse
                gh_dict["greenhouse_id"] = greenhouse.id

                # Add img
                if greenhouse.img:
                    img = "data:image/jpeg;base64,"
                    img += base64.b64encode(greenhouse.img).decode("utf-8")
                else: 
                    img = None
                gh_dict["img"] = img  
                gh_dict["imgPath"] = greenhouse.imgPath
                gh_dict["name"] = greenhouse.name
                gh_dict["location"] = greenhouse.location
                gh_dict["date"] = greenhouse.date.isoformat() if greenhouse.date else None

                # Get the parameters
                for parameter in ["temperature", "humidity", "light", "ventilation"]:
                    gh_dict[parameter] = random.randint(1, 100)

                # Save the gh to the list
                greenhouses_list.append(gh_dict)     

            if greenhouses_list:
                return jsonify({
                        "greenhouses": greenhouses_list, 
                        "total_items": greenhouses.total
                    }), 200  
            return jsonify({"message": "No greenhouses!"}), 400
        return jsonify({"message": "No permissions!"}), 403
    

@greenhouses.route('update-greenhouse/<int:greenhouse_id>', methods=['PUT'])
@jwt_required()
def update_greenhouse(greenhouse_id):
    if request.method == 'PUT':
        if 'admin' == get_jwt()['role']:
            # Find it in the db
            greenhouse = Greenhouse.query.filter_by(id=greenhouse_id).first()
            if not greenhouse:
                return jsonify({"messagge": "The greenhouse doesn't exist!"}), 400

            # Change the modified values.
            name = request.form.get("name")
            if name: greenhouse.name = name
            location = request.form.get("location")
            if location: greenhouse.location = location
            img = request.files.get("img")
            if img: 
                greenhouse.img = img.read()
                greenhouse.imgPath = img.filename

            # Save the changes.
            db.session.commit()
            return jsonify({"message": "Updated successfully!"}), 200
        return jsonify({"message": "No permissions!"}), 403
    

@greenhouses.route('delete-greenhouse/<int:greenhouse_id>', methods=['DELETE'])
@jwt_required()
def delete_greenhouse(greenhouse_id):
    if request.method == 'DELETE':
        if get_jwt()['role'] == 'admin':
            row_to_delete = Greenhouse.query.get(greenhouse_id)
            if not row_to_delete:
                return jsonify({"message": "The greenhouse was already deleted!"}), 400
            db.session.delete(row_to_delete)
            db.session.commit()
            return jsonify({"message": "Greenhouse deleted successfully!"}), 200
        return jsonify({"message": "No permissions!"}), 403


@greenhouses.route('token', methods=['GET'])
def get_token():
    if request.method == 'GET':
        access_token = create_access_token(
            identity="admin", 
            expires_delta=timedelta(minutes=1),
            additional_claims={'role': request.args.get("role", type=str)},
        )
        return jsonify({"jwt": access_token}), 200