import React, { useState, useEffect } from 'react';
import Logo from './components/Logo'
import Greenhouse from './components/Greenhouse'
import AddGreenhouseButton from './components/AddGreenhouseButton'
import AddGreenhouseForm from './components/AddGreenhouseForm';
import './App.css'


function App() {
  const [addGreenhouseButtonState, setAddGreenhouseButtonState] = useState(false);
  const [currentGreenhouses, setCurrentGreenhouses] = useState([]);

  useEffect(() => {
    const storedGreenhouses = localStorage.getItem('greenhouses');
    if (storedGreenhouses) {
      setCurrentGreenhouses(JSON.parse(storedGreenhouses));
    }
  }, []);

  useEffect(() => {
    if (currentGreenhouses.length != 0) {
      localStorage.setItem('greenhouses', JSON.stringify(currentGreenhouses));
    }
  }, [currentGreenhouses]);

  const deleteGreenhouse = (index) => {
    const updatedGreenhouses = [...currentGreenhouses];
    updatedGreenhouses.splice(index, 1);
    setCurrentGreenhouses(updatedGreenhouses);
  };

  const addGreenhouse = (data) => {
    const updatedGreenhouses = [...currentGreenhouses];
    updatedGreenhouses.push(data);
    setCurrentGreenhouses(updatedGreenhouses);
  };

  const handleAddGreenhouseButton = () => {
    setAddGreenhouseButtonState(true);
  };

  const closeForm = () => {
    setAddGreenhouseButtonState(false);
  };

  return (
    <div>
      <Logo />
      <div id='add-sort-buttons'>
        <AddGreenhouseButton handleAddGreenhouseButton={handleAddGreenhouseButton}/>
        {addGreenhouseButtonState && <AddGreenhouseForm closeForm={closeForm} addGreenhouse={addGreenhouse}/>} 
      </div>
      <div id='greenhouse-list'>
        {
          currentGreenhouses.map((greenhouse, index) => {
              return ( 
                <Greenhouse 
                  key={index}
                  index={index}
                  name={greenhouse.name}
                  location={greenhouse.location}
                  img={greenhouse.img}
                  onDelete={deleteGreenhouse}
                />
              );
            }
          )
        }
      </div>
    </div>
  );
}

export default App;