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
import './Zone.css'; 

function Zone(props) {
    const [UpdateName, setAddZone] = useState(false);
    const [addPlant, setAddPlant] = useState(false);
    const [addSensor, setAddSensor] = useState(false);
    const [EditButton, setEditButton] = useState(false);
    const [plantName, setPlantName] = useState(props.zone.plant_name);

    const handlePlantUpdate = (newPlantName) => {
        setPlantName(newPlantName);
        refreshZoneData(); 
    };

    const refreshZoneData = () => {
        props.onRefresh(); 
    };
    console.log("PLANT NAME----------", plantName)
    return (
        <div className="zone">
            <button className='button' onClick={() => {setAddZone(true)}}>
                <img src={EditIcon} className='delete-icon' alt="Edit" />
            </button>
            {UpdateName && 
                <AddZoneForm 
                      setAddZone={setAddZone}
                      zone={props.zone.zone_id}

                      name={props.zone.name}

                />
            }
            
            <button className='button' onClick={() => {props.onDelete(props.zone)}}>
                <img src={DeleteIcon} className='delete-icon' alt="Delete" />
            </button>

            <p id="zone-name">
                <img src={ZoneNameIcon} alt="Zone Name" />
                {props.zone.name}
            </p>

            <p id="zone-name" onClick={() => {setAddPlant(true)}}>
                <img src={PlantNameIcon} alt="Plant" />
                Plant: {plantName}
            </p>

            {addPlant && 
                <AddPlantForm 
                    setAddPlant={setAddPlant}
                    zone_id={props.zone.zone_id}
                    onPlantUpdate={handlePlantUpdate}
                />
            }
            
            <p id="zone-name" onClick={() => {setAddSensor(true)}}>
                <img src={SensorsIcon} alt="Sensors" />
                Sensors
            </p>
            {addSensor && 
                <AddSensorForm 
                    setAddSensor={setAddSensor}
                    zone_id={props.zone.zone_id}
                    gh_id={props.gh_id}
                />
            }

            <div className='greenhouse-parameters'>
                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={TempIcon} className='temp-icon' alt="Temperature" />
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.zone.temperature}</span>
                        <span className='ch-symbol'>°C</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={HumidityIcon} className='humidity-icon' alt="Humidity" />
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.zone.humidity}</span>
                        <span className='ch-symbol'>%</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={LightIcon} className='light-icon' alt="Light" />
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.zone.light}</span>
                        <span className='ch-symbol'>%</span>
                    </div>
                </div>

                <div className='greenhouse-temp'>
                    <div className='icon-container'>
                        <img src={plantIcon} className='wind-icon' alt="moisture" />
                    </div>
                    <div className='temp-number-symbol-container'>
                        <span className='temp-number'>{props.zone.soil_moisture}</span>
                        <span className='ch-symbol'>%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Zone;