import React, { useState } from 'react';
import Logo from './components/Logo'
import Greenhouse from './components/Greenhouse'
import './App.css'


function App() {
  const [currentGreenhouses, setCurrentGreenhouses] = useState([
    {
      name: 'Greenhouse 1',
      location: 'Chișinău',
      img: ''
    },
    {
      name: 'Greenhouse 2',
      location: 'Orhei',
      img: ''
    },
    {
      name: 'Greenhouse 3',
      location: 'SD',
      img: ''
    }
  ]);

  const deleteGreenhouse = (index) => {
    const updatedGreenhouses = [...currentGreenhouses];
    updatedGreenhouses.splice(index, 1);
    setCurrentGreenhouses(updatedGreenhouses);
  };


  return (
    <div>
      <Logo />
      <div id='greenhouse-list'>
        {
          currentGreenhouses.map((greenhouse, index) => {
              return ( 
                <Greenhouse 
                  key={index}
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