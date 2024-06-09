import React, { useState } from "react";
import CloseFormIcon from '../../imgs/close-form-icon.png'
import './AddZoneForm.css'


function AddZoneForm(props) {
    const [name, setName] = useState("");
    const [submitError, setSubmitError] = useState(false);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    
        if (!name){
          setSubmitError(true);
          return;
        }
    
        fetch(`/create-zone`, {
            method: 'POST',
            headers: {  
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "gh_id": props.greenhouseId,
                "name": name
            })
        })
        .then (res => {
            if (!res.ok) { 
                throw new Error;
            }
            return res.json();
        })
        .then (data => {
            console.log('Success: ', data);
        })
        .catch(error => {
            console.error(error);
        });
    
        setName('');
        setSubmitError(false);
        props.setAddZone(false);
    };

    return (
        <div className="all-gray">
            <div className="form-rectangle-create-zone">
                <button className='close-form-button' onClick={() => {props.setAddZone(false)}}>
                    <img src={CloseFormIcon} className='close-form-icon'/>
                </button>
                <form>
                    <label className='text-label'>
                        Zone name:
                        <input className='text-input' type="text" value={name} onChange={handleNameChange} />
                        {!name && submitError && <label className='invalid-label'>Invalid name</label>}
                    </label>
                    <button type="submit" className='save-data-create-zone' onClick={handleSubmit}>Save</button>
                </form>
            </div>
        </div>
    );
}

export default AddZoneForm;