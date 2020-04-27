import React from 'react';
import './styles.css';

function SearchBox() {
  return (
    <div id="search_container">
        <input id="search" type="text" placeholder="Search" autoFocus={true} autoComplete="off" />
    </div>
  );
}

export default SearchBox;
