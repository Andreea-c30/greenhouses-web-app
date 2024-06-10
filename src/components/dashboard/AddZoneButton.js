// AddZoneButton.js
import React, { useState } from "react";
import './AddZoneButton.css';
import AddZoneButtonIcon from '../../imgs/add-zone-button-icon.png'
import AddZoneForm from './AddZoneForm'

function AddZoneButton(props) {
    const [addZone, setAddZone] = useState(false);

    return (
        <>
            <div id="add-zone-button-container" onClick={() => {setAddZone(true)}}>
                <img src={AddZoneButtonIcon} alt="Add Zone" />
                <span>Add zone</span>
            </div>
            {addZone && 
                <AddZoneForm 
                    setAddZone={setAddZone} 
                    greenhouseId={props.greenhouseId}
                    updateZones={props.updateZones} 
                />
            }
        </>
    );
}

export default AddZoneButton;
