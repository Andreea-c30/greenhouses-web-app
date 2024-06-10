import React, { useState, useEffect } from "react";
import CloseFormIcon from '../../imgs/close-form-icon.png';
import './AddZoneForm.css';
import Sensor from  "./Sensor";
import SensorFr from  "./SensorFree";

function AddSensorsForm(props) {
    const [sensor, setSensor] = useState([]);
    const [selectedPlantId, setSelectedPlantId] = useState(null);
    const [submitError, setSubmitError] = useState(false);

    useEffect(() => {
        console.log("Received zone_id in AddPlantForm:", props.zone_id); // Debugging statement
        fetch('/get-free-sensors')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setSensor(data);
                if (data.length > 0) {
                    setSelectedPlantId(data[0].plant_id);
                }
            })
            .catch(error => {
                console.error('Error fetching plant data:', error);
            });
    }, [props.zone_id]);

    const handlePlantChange = (event) => {
        setSelectedPlantId(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

       
    
         
    };
   
    return (
        <div className="all-gray">
            <div className="form-rectangle-create-zone">
                <button className='close-form-button' onClick={() => { props.setAddSensor(false) }}>
                    <img src={CloseFormIcon} className='close-form-icon' alt="Close" />
                </button>
                <label className='text-label'>
                Zone's sensors :
                <Sensor 
                 sensor='temp'
                 
                 />
                </label>
                {/* list here the sensors of the zone */}
                <form onSubmit={handleSubmit}>
                    <label className='text-label'>
                         Free sensors :
                         <SensorFr 
                            sensor='temp'
                            
                            />
                    </label>
                    <button type="submit" className='save-data-create-zone'>Save</button>
                </form>
                {submitError && <div className="error-message">Please select a plant.</div>}
            </div>
        </div>
    );
}

export default AddSensorsForm;
