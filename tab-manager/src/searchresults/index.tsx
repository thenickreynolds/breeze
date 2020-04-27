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
    console.log(`Filtering to "${this.props.searchText}" and found ${tabs.length} tabs`);

    return (
      <div>
        { tabs.map((tab, index) =>
          <Tab key={tab.id} tab={tab} index={index} highlight={false} />
        )}
      </div>
    );
  }

  searchTextUpdated(text : string) {
    console.log(`Search text updated: ${text}`);
    this.setState({searchText: text});
  }
}

export default SearchResults;