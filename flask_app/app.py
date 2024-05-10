from flask import Flask
from flask_migrate import Migrate
import os
import threading 

import mqtt_connector
from db import db
 

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenhouse.db'
    db.init_app(app)

    # Manage the routes
    from greenhouses import greenhouses
    from mqtt_routes import mqtt
    app.register_blueprint(greenhouses, url_prefix='/')
    app.register_blueprint(mqtt, url_prefix='/mqtt/')

    # Mange the models
    from models import Greenhouse
    create_db(app)
    migrate = Migrate(app, db)

    return app

def create_db(app):
    if not os.path.exists("flask_app/instance/greenhouse.db"):
        with app.app_context():
            db.create_all()
            print("DB was created!")
            

if __name__ == '__main__': 
    # Start MQTT Subscriber in a separate thread 
    mqtt_thread = threading.Thread(target=mqtt_connector.run_mqtt_subscriber) 
    mqtt_thread.start() 

    create_app().run(debug=True)