import React, { useState } from 'react';
import './AddGreenhouseForm.css'
import CloseFormIcon from '../imgs/close-form-icon.png'
import UploadIcon from '../imgs/upload-icon.png'


function AddGreenhouseForm(props) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(null);

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
    props.addGreenhouse({
      name: name,
      location: location,
      img: image ? image: null
    });

    // Reset form fields
    setName('');
    setLocation('');
    setImage(null);
    setImagePath(null);
    props.closeForm();
  };
  console.log(image)

  return (
    <div className='all-gray'>
      <div className='form-rectangle'>
        <button className='close-form-button' onClick={props.closeForm}>
          <img src={CloseFormIcon} className='close-form-icon'/>
        </button>
        {/* <span className='form-labels'>Name:</span> */}
        <form>
          <label>
            Name:
            <input className='text-input' type="text" value={name} onChange={handleNameChange} />
          </label>

          <label>
            Location:
            <input className='text-input' type="text" value={location} onChange={handleLocationChange} />
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
