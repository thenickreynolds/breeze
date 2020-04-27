import React from 'react';
import './styles.css';
import { TabInfo } from '../types/Types';
import Tab from '../tab';

type SearchResultsProps = {
  tabs : TabInfo[],
  selectedTabIndex : number,
}

class SearchResults extends React.Component<SearchResultsProps> {
  constructor(props : SearchResultsProps) {
    super(props);
    this.state = { selectedTabIndex: 0 };
  }

  render() {
    if (this.props.tabs.length === 0) {
      return (<div className="results_text">No results found</div>)
    }

    return (
      <div>
        { this.props.tabs.map((tab, index) =>
          <Tab
            key={tab.id}
            tab={tab}
            index={index}
            outline={index === this.props.selectedTabIndex}
          />
        )}
      </div>
    );
  }
}

export default SearchResults;