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
  const [sortingOption, setSortingOption] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#00AF3B');
  const [primaryLightColor, setPrimaryLightColor] = useState('#00D247');
  const [toggleLight, setToggleLight] = useState(true);

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
    if (currentGreenhouses.length != 0)  {
      sortGreenhouses();
    }
  }, [sortingOption]);

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

  const sortGreenhouses = () => {
    let sortedArray = [...currentGreenhouses];
    if (sortingOption === 'alphabetical') {
      sortedArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortingOption === 'location') {
      sortedArray.sort((a, b) => a.location.localeCompare(b.location));
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