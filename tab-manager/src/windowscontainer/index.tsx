import React from 'react';
import './styles.css';
import Window from './window';

let testTabs = [ "test" ];

function WindowsContainer() {
  return (
    <div id="main_container">
      <Window title="Hello" tabs={testTabs} />
      <Window title="World" tabs={testTabs} />
      <Window title="!"  tabs={testTabs} />
    </div>
  );
}

export default WindowsContainer;
