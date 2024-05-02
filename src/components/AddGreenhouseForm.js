import React, { useState } from 'react';
import './AddGreenhouseForm.css'
import CloseFormIcon from '../imgs/close-form-icon.png'
import UploadIcon from '../imgs/upload-icon.png'


function AddGreenhouseForm(props) {
  const [name, setName] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.name : "");
  const [location, setLocation] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.location : "");
  const [image, setImage] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.img: null);
  const [submitError, setSubmitError] = useState(false);
  const [imagePath, setImagePath] = useState(props.greenhouseToEdit ? props.greenhouseToEdit.imgPath : "");

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImagePath(event.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!(name && location)){
      setSubmitError(true);
      return;
    } 

    props.addGreenhouse({
      "name": name,
      "location": location,
      "imgPath": imagePath,
      "img": image ? image: null,
      "date": new Date(),
      "temperature": getRandomInt(1, 100),
      "humidity": getRandomInt(1, 100),
      "light": getRandomInt(1, 100),
      "wind": getRandomInt(1, 100)
    });

    // Reset form fields
    setName('');
    setLocation('');
    setImage(null);
    setImagePath(null);
    setSubmitError(false);
    props.closeForm();
    props.setTriggerSorting(!props.triggerSorting);
  };

  return (
    <div className='all-gray'>
      <div className='form-rectangle'>
        <button className='close-form-button' onClick={props.closeForm}>
          <img src={CloseFormIcon} className='close-form-icon'/>
        </button>
        <form>
          <label className='text-label'>
            Name:
            <input className='text-input' type="text" value={name} onChange={handleNameChange} />
            {!name && submitError && <label className='invalid-label'>Invalid name</label>}
          </label>
          <label className='text-label'>
            Location:
            <input className='text-input' type="text" value={location} onChange={handleLocationChange} />
            {!location && submitError && <label className='invalid-label'>Invalid location</label>}
          </label>

          <label className="img-upload">
            <img src={UploadIcon}/>
            Upload image
            <input type="file" onChange={handleImageChange}/>
          </label>
          {image ? (
              <div className='file-name-container'>
                <span className='file-name'>File name: </span>
                <span>{imagePath.name}</span>
              </div>
            ):(
              <div className='file-name-container'>
                <span className='file-name'>No file chosen!</span>
              </div>
            )
          }
          <button type="submit" className='save-data' onClick={handleSubmit}>Save</button>
        </form>
      </div>
    </div>
  );
}

export default AddGreenhouseForm;
