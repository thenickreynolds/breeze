import React from 'react';
import './styles.css';

type SearchProps = {
  searchUpdated: (text : string) => void,
  upPressed: () => void,
  downPressed: () => void,
  enterPressed: () => void,
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
            onKeyDown={(e) => this.keyPressed(e)}
          />
      </div>
    );
  }

  keyPressed(event: React.KeyboardEvent) {
    let cancel = false;

    switch (event.key) {
      case "ArrowUp":
        this.props.upPressed();
        cancel = true;
        break;
      case "ArrowDown":
        this.props.downPressed();
        cancel = true;
        break;
      case "Enter":
        this.props.enterPressed();
        cancel = true;
    }

    if (cancel) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}

export default SearchBox;
