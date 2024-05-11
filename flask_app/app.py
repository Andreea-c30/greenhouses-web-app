from flask import Flask
from flask_migrate import Migrate
import os
import threading 
import random
import time
from flask_jwt_extended import JWTManager

import mqtt_connector
from db import db
from models import (
    Greenhouse, Parameter,
    Sensor, SensorData
)


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenhouse.db'
    db.init_app(app)

    # Manage the routes
    from greenhouses import greenhouses
    from mqtt_routes import mqtt
    app.register_blueprint(greenhouses, url_prefix='/')
    app.register_blueprint(mqtt, url_prefix='/mqtt/')

    # Init the JWT
    # Configuration
    app.config['SECRET_KEY'] = 'dasEEEDADASDASD@E#@DASD'
    app.config["JWT_SECRET_KEY"] = "DASsds2e#@e23eSDAD.ED2D2/3!@QWQ"
    app.config['JWT_TOKEN_LOCATION'] = ['headers']

    jwt = JWTManager(app)
    
    create_db(app)
    migrate = Migrate(app, db)

    return app

def create_db(app):
    if not os.path.exists("flask_app/instance/greenhouse.db"):
        with app.app_context():
            db.create_all()

            # Add initial data
            if db.session.query(Parameter).count() == 0:
                db.session.add(Parameter(name="temperature", unit="celsius"))
                db.session.add(Parameter(name="humidity", unit="%"))
                db.session.add(Parameter(name="light", unit="%"))
                db.session.add(Parameter(name="ventilation", unit="%"))
                db.session.commit()
            if db.session.query(Sensor).count() == 0:
                db.session.add(Sensor(name="NTC", parameter_id=1))
                db.session.add(Sensor(name="RTDs", parameter_id=1))
                db.session.add(Sensor(name="DHT11", parameter_id=2))
                db.session.add(Sensor(name="SHT31", parameter_id=2))
                db.session.add(Sensor(name="Photodiodes", parameter_id=3))
                db.session.add(Sensor(name="Phototransistors", parameter_id=3))
                db.session.add(Sensor(name="HVAC", parameter_id=4))
                db.session.commit()
            if db.session.query(SensorData).count() == 0:
                for i in range(20):
                    time.sleep(2)
                    db.session.add(SensorData(
                        zone_id=random.randint(1, 3), 
                        sensor_id=random.randint(1, 7), 
                        data=random.randint(1, 100)
                    ))
                    db.session.commit()      
            print("DB was created!")

if __name__ == '__main__': 
    # Start MQTT Subscriber in a separate thread 
    mqtt_thread = threading.Thread(target=mqtt_connector.run_mqtt_subscriber) 
    mqtt_thread.start() 

    create_app().run(debug=True)