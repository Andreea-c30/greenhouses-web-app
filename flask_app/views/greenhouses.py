from flask import Blueprint
from flask import jsonify, request
import base64
import random
from datetime import datetime

from models import Greenhouse, Zone
from db import db


greenhouses = Blueprint('greenhouses', __name__)


@greenhouses.route('create-greenhouse', methods=['POST'])
def create_greenhouse():
    """
        Create the greenhouse record in the db.
    """
    if request.method == 'POST':
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
        db.session.commit()

        return jsonify({"id": greenhouse.id, 
                        "message": "Greenhouse created successfully"}), 200


@greenhouses.route('get-greenhouses', methods=['GET'])
def get_greenhouses():
    """
        Obtain the basic data about the greenhouses like
        name, location, img.
    """
    if request.method == 'GET':
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
        return jsonify({"message": "No greenhouses!"}), 404
    

@greenhouses.route('update-greenhouse/<int:greenhouse_id>', methods=['PUT'])
def update_greenhouse(greenhouse_id):
    if request.method == 'PUT':
        # Find it in the db
        greenhouse = Greenhouse.query.filter_by(id=greenhouse_id).first()
        if not greenhouse:
            return jsonify({"messagge": "The greenhouse doesn't exist!"}), 404

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
    

@greenhouses.route('delete-greenhouse/<int:greenhouse_id>', methods=['DELETE'])
def delete_greenhouse(greenhouse_id):
    if request.method == 'DELETE':
        row_to_delete = Greenhouse.query.get(greenhouse_id)
        if not row_to_delete:
            return jsonify({"message": "The greenhouse was already deleted!"}), 404
        db.session.delete(row_to_delete)
        db.session.commit()
        return jsonify({"message": "Greenhouse deleted successfully!"}), 200
    

@greenhouses.route('get-greenhouse/<int:greenhouse_id>', methods=['GET'])
def get_greenhouse(greenhouse_id):
    if request.method == 'GET':
        greenhouse = Greenhouse.query.filter_by(id=greenhouse_id).first()
        if not greenhouse:
            return jsonify({"messagge": "The greenhouse doesn't exist!"}), 404

        img = None
        if greenhouse.img:
                img = "data:image/jpeg;base64,"
                img += base64.b64encode(greenhouse.img).decode("utf-8")

        return jsonify({
            "name": greenhouse.name,
            "location": greenhouse.location,
            "image": img,
            "imgPath": greenhouse.imgPath,
            "date": greenhouse.date,
            "temperature": random.randint(1, 100),
            "humidity": random.randint(1, 100),
            "light": random.randint(1, 100),
            "ventilation": random.randint(1, 100)
        }), 200