import React from 'react';
import './App.css';
import WindowsContainer from './windowscontainer'
import SearchBox from './searchbox'

function App() {
  return (
    <div className="App">
      <SearchBox />
      <WindowsContainer />
    </div>
  );
}

export default App;
