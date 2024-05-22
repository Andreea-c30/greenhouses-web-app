from mqtt_connector import run_mqtt_subscriber, publish_mqtt
import threading
import json

mqtt_thread = threading.Thread(target=run_mqtt_subscriber)
mqtt_thread.start() 
publish_mqtt("microlab/agro/green_house/air_hum_ctrl", json.dumps({"cmd": "set_point", "value": "13.2"}))