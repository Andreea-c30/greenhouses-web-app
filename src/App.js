import React, { useState, useEffect } from 'react';
import Greenhouse from './components/Greenhouse'
import AddGreenhouseButton from './components/AddGreenhouseButton'
import AddGreenhouseForm from './components/AddGreenhouseForm';
import SortGreenhouses from './components/SortGreenhouses';
import ThemeMode from './components/ThemeMode';
import './App.css'


function App() {
  const [addGreenhouseButtonState, setAddGreenhouseButtonState] = useState(false);
  const [currentGreenhouses, setCurrentGreenhouses] = useState([]);
  const [sortingOption, setSortingOption] = useState('name');
  const [greenhouseToEdit, setGreenhouseToEdit] = useState(null);
  const [greenhouseToEditIndex, setGreenhouseToEditIndex] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#00AF3B');
  const [primaryLightColor, setPrimaryLightColor] = useState('#00D247');

  useEffect(() => {
    const storedGreenhouses = localStorage.getItem('greenhouses');
    if (storedGreenhouses) {
      setCurrentGreenhouses(JSON.parse(storedGreenhouses));
    }
  }, []);

  useEffect(() => {
    if (currentGreenhouses.length != 0) {
      localStorage.setItem('greenhouses', JSON.stringify(currentGreenhouses));
    } else {
      localStorage.setItem('greenhouses', []);
    }
  }, [currentGreenhouses]);

  const deleteGreenhouse = (greenhouse) => {
    const updatedGreenhouses = currentGreenhouses.filter(item => item !== greenhouse);
    setCurrentGreenhouses(updatedGreenhouses);
  };
  
  const editGreenhouse = (greenhouse) => {
    setAddGreenhouseButtonState(true);
    setGreenhouseToEdit(greenhouse);
  };

  const updateGreenhouse = (updatedGreenhouse) => {
    const updatedGreenhouses = currentGreenhouses.map(greenhouse => {
      if (greenhouse === greenhouseToEdit) {
        return updatedGreenhouse;
      }
      return greenhouse;
    });
    setCurrentGreenhouses(updatedGreenhouses);
    setGreenhouseToEdit(null);
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
    setGreenhouseToEdit(false);
  };

  function sortGreenhousesByOption(greenhouses, option) {
    return [...greenhouses].sort((a, b) => {
      if (option === 'name') {
        return a.name.localeCompare(b.name);
      } else if (option === 'location') {
        return a.location.localeCompare(b.location);
      } else if (option === 'date') {
        return new Date(b.date) - new Date(a.date);
      } else if (option === 'temperature') {
        return b.temperature - a.temperature;
      } else if (option === 'humidity') {
        return b.humidity - a.humidity;
      } else if (option === 'light') {
        return b.light - a.light;
      } else if (option === 'ventilation') {
        return b.ventilation - a.ventilation;
      }
      return 0;
    });
  }

  const handleSort = (option) => {
    setSortingOption(option);
  };


  return (
    <div style={{'--primary-color': primaryColor, '--primary-light-color': primaryLightColor}}>
      <ThemeMode 
        setPrimaryColor={setPrimaryColor}
        setPrimaryLightColor={setPrimaryLightColor}
      />
      <div id='add-sort-buttons'>
        <AddGreenhouseButton handleAddGreenhouseButton={handleAddGreenhouseButton}/>
        <SortGreenhouses handleSort={handleSort}/>
        {addGreenhouseButtonState && 
          <AddGreenhouseForm 
            closeForm={closeForm} 
            addGreenhouse={addGreenhouse}
          />
        } 
      </div>
      <div className={`greenhouse-list ${currentGreenhouses.length == 0 && 'centered-greenhouse-list'}`}>
        {currentGreenhouses.length == 0 && <span className='no-greenhouses-label'>No greenhouses</span>}
        {
          sortGreenhousesByOption(currentGreenhouses, sortingOption).map((greenhouse, index) => (
            <Greenhouse 
              key={index}
              index={index}
              onDelete={deleteGreenhouse}
              onEdit={editGreenhouse}
              greenhouse={greenhouse}
            />
          ))    
        }
        {greenhouseToEdit && 
          <AddGreenhouseForm 
            closeForm={closeForm} 
            addGreenhouse={addGreenhouse}
            greenhouseToEdit={greenhouseToEdit}
            index={greenhouseToEditIndex}
            updateGreenhouse={updateGreenhouse}
          />
        } 
      </div>
    </div>
  );
}

export default App;