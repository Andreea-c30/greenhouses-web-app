import React from 'react';
import Logo from './components/Logo'
import Greenhouse from './components/Greenhouse'
import './App.css'

function app() {
  return (
    <div>
      <Logo />
      <Greenhouse />
      <div id='greenhouse-list'>
      </div>
    </div>
  );
}

export default app;