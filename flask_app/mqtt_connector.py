from paho.mqtt import client as mqtt_client 
import mqtt_access
import random
import json

from db import db
from models import Zone

# MQTT Broker details 
broker = mqtt_access.host
port = mqtt_access.port 
topic = "/greenhouse/temp_sensor"
client_id = f'subscribe-{random.randint(0, 1000)}' 
username = mqtt_access.username
password = mqtt_access.password
 
# Set to store received messages 
received_messages = set() 
 
def connect_mqtt(): 
    def on_connect(client, userdata, flags, rc): 
        if rc == 0: 
            print("Connected to MQTT Broker!") 
        else: 
            print(f"Failed to connect, return code {rc}\n")
 
    client = mqtt_client.Client(client_id) 
    client.username_pw_set(username, password) 
    client.tls_set(ca_certs='./IoT.crt')
    client.on_connect = on_connect 
    client.connect(broker, port) 
    return client 
 
def subscribe(client): 
    def on_message(client, userdata, msg): 
        message = msg.payload.decode() 
        if message not in received_messages: 
            print(f"Received `{message}` from `{msg.topic}` topic") 
            received_messages.add(message)
            message = json.loads(message)

            # Add the data into the db
            # Expect: greenhouse_id, zone_id, sensor_id, data


    client.subscribe(topic) 
    client.on_message = on_message 
 
def run_mqtt_subscriber(): 
    client = connect_mqtt() 
    client.loop_start()  # Start the loop to receive messages 
    subscribe(client) 