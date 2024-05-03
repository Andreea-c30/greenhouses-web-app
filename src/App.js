import React, { useState, useEffect } from 'react';
import Logo from './components/Logo'
import DarkLogo from './components/DarkLogo'
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
  const [primaryColor, setPrimaryColor] = useState('#00AF3B');
  const [primaryLightColor, setPrimaryLightColor] = useState('#00D247');
  const [toggleLight, setToggleLight] = useState(true);
  const [triggerSorting, setTriggerSorting] = useState(false);
  const [greenhouseToEdit, setGreenhouseToEdit] = useState(null);
  const [greenhouseToEditIndex, setGreenhouseToEditIndex] = useState(null);


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

  useEffect(() => {
    if (currentGreenhouses.length !== 0) {
      sortGreenhouses();
    }
  }, []);

  useEffect(() => {
    if (currentGreenhouses.length != 0)  {
      sortGreenhouses();
    }
  }, [sortingOption, triggerSorting]);

  const deleteGreenhouse = (index) => {
    const updatedGreenhouses = [...currentGreenhouses];
    updatedGreenhouses.splice(index, 1);
    setCurrentGreenhouses(updatedGreenhouses);
  };

  const editGreenhouse = (index) => {
    setAddGreenhouseButtonState(true);
    setGreenhouseToEdit(currentGreenhouses[index]);
    setGreenhouseToEditIndex(index);
  };

  const updateGreenhouse = (index, name, location, imgPath, img) => {
    let updatedGreenhouses = [...currentGreenhouses];
    updatedGreenhouses[index].name = name 
    updatedGreenhouses[index].location = location 
    updatedGreenhouses[index].imgPath = imgPath 
    updatedGreenhouses[index].img = img 
    setCurrentGreenhouses(updatedGreenhouses);
    setGreenhouseToEdit(null);
    setGreenhouseToEditIndex(null);
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

  const sortGreenhouses = () => {
    let sortedArray = [...currentGreenhouses];
    if (sortingOption === 'name') {
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortingOption === 'location') {
      sortedArray.sort((a, b) => a.location.localeCompare(b.location));
    } else if (sortingOption === 'date') {
      sortedArray.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
    } else if (sortingOption === 'temperature') {
      sortedArray.sort((a, b) => b.temperature - a.temperature);
    } else if (sortingOption === 'humidity') {
      sortedArray.sort((a, b) => b.humidity - a.humidity);
    } else if (sortingOption === 'light') {
      sortedArray.sort((a, b) => b.light - a.light);
    } else if (sortingOption === 'ventilation') {
      sortedArray.sort((a, b) => b.ventilation - a.ventilation);
    }
    setCurrentGreenhouses(sortedArray);
  };

  const handleSort = (option) => {
    setSortingOption(option);
  };

  const onChangeColor = () => {
    setToggleLight(!toggleLight);
    if (toggleLight) {
      setPrimaryColor("#005B1F");
      setPrimaryLightColor("#007c2a");
    } else {
      setPrimaryColor("#00AF3B");
      setPrimaryLightColor("#00D247");
    }
  };

  return (
    <div style={{'--primary-color': primaryColor, '--primary-light-color': primaryLightColor}}>
      {!toggleLight ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')}
      {!toggleLight ? (<DarkLogo/>):(<Logo/>) }
      <ThemeMode onChangeColor={onChangeColor} toggleLight={toggleLight}/>
      <div id='add-sort-buttons'>
        <AddGreenhouseButton handleAddGreenhouseButton={handleAddGreenhouseButton}/>
        <SortGreenhouses handleSort={handleSort}/>
        {addGreenhouseButtonState && 
          <AddGreenhouseForm 
            closeForm={closeForm} 
            addGreenhouse={addGreenhouse}
            setTriggerSorting={setTriggerSorting}
            triggerSorting={triggerSorting}
          />
        } 
      </div>
      <div className={`greenhouse-list ${currentGreenhouses.length == 0 && 'centered-greenhouse-list'}`}>
        {currentGreenhouses.length == 0 && <span className='no-greenhouses-label'>No greenhouses</span>}
        {
          currentGreenhouses.map((greenhouse, index) => {
              return ( 
                <Greenhouse 
                  key={index}
                  index={index}
                  onDelete={deleteGreenhouse}
                  onEdit={editGreenhouse}
                  greenhouse={greenhouse}
                />
              );
            }
          )
        }
        {greenhouseToEdit && 
          <AddGreenhouseForm 
            closeForm={closeForm} 
            addGreenhouse={addGreenhouse}
            setTriggerSorting={setTriggerSorting}
            triggerSorting={triggerSorting}
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