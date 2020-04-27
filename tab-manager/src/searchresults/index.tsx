import React from 'react';
import './styles.css';
import { TabInfo } from '../types/Types';
import Tab from '../tab';

type SearchResultsProps = {
  tabs : TabInfo[],
  searchText : string,
}

class SearchResults extends React.Component<SearchResultsProps> {
  render() {
    const searchText = this.props.searchText.trim().toLowerCase();

    const tabs = this.props.tabs.filter(tab => tab.title.toLowerCase().search(searchText) >= 0);

    return (
      <div>
        { tabs.map((tab, index) =>
          <Tab key={tab.id} tab={tab} index={index} highlight={false} />
        )}
      </div>
    );
  }

  searchTextUpdated(text : string) {
    this.setState({searchText: text});
  }
}

export default SearchResults;