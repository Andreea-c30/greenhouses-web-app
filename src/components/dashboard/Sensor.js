import React, { useState, useEffect } from "react";
import ZoneNameIcon from '../../imgs/zone_name.png';
import PlantNameIcon from '../../imgs/plant_selec.png';
import SensorsIcon from '../../imgs/sens_selec.png';
import TempIcon from '../../imgs/temperature-dash-icon.png';
import HumidityIcon from '../../imgs/humidity-dash-icon.png';
import LightIcon from '../../imgs/light-dash-icon.png';
import plantIcon from '../../imgs/plant.png';
import DeleteIcon from '../../imgs/delete-icon.png';
import EditIcon from '../../imgs/edit-icon.png';
import AddPlantForm from './AddPlantForm';
import AddSensorForm from './AddSensorsForm';
import AddZoneForm from './AddZoneForm';
import './Sensor.css'; 

function Sensor(props) {
   


    return (
        <div >
                     
            <p id="sensor-name">
            <button id='button' onClick={() => {props.onDelete(props.sensor)}}>
                <img src={DeleteIcon} className='delete-icon' alt="Delete" />
            </button>
              TEMOER
           {props.sensors.name}
            </p>

        

        </div>
    );
}

export default Sensor;
