import React from 'react';
import './styles.css';

type SearchProps = {
  searchUpdated: (text : string) => void,
}

class SearchBox extends React.Component<SearchProps> {
  render() {
    return (
      <div id="search_container">
          <input
            id="search"
            type="text"
            placeholder="Search"
            autoFocus={true}
            autoComplete="off"
            onChange={(e) => this.props.searchUpdated(e.target.value)}
          />
      </div>
    );
  }
}

export default SearchBox;
