import React from 'react';
import './styles.css';
import SearchBox from '../searchbox';
import WindowsContainer from '../windowscontainer';
import classNames from 'classnames';
import SearchResults from '../searchresults';
import Utils from '../types/Utils';
import { WindowInfo } from '../types/Types';

type WindowProps = {
}

type WindowState = {
    searchText : string,
    windows: WindowInfo[],
}

class WindowLayout extends React.Component<WindowProps,WindowState> {
  constructor(props : WindowProps) {
    super(props);
    this.state = { searchText: "", windows: [] };
    this.searchTextUpdated = this.searchTextUpdated.bind(this);
  }

  render() {
    const tabs = this.state.windows.flatMap(window => window.tabs);

    return (
      <div>
        <SearchBox searchUpdated={this.searchTextUpdated} />
        <div className={classNames({ hidden: this.state.searchText.length > 0 })}>
            <WindowsContainer windows={this.state.windows} />
        </div>
        <div className={classNames({ hidden: this.state.searchText.length === 0 })}>
            <SearchResults searchText={this.state.searchText} tabs={tabs} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (Utils.isChromeExtension()) {
      chrome.tabs.onCreated.addListener(() => this.updateTabs());
      chrome.tabs.onMoved.addListener(() => this.updateTabs());
      chrome.tabs.onRemoved.addListener(() => this.updateTabs());
      chrome.tabs.onDetached.addListener(() => this.updateTabs());
      chrome.tabs.onAttached.addListener(() => this.updateTabs());
    }

    this.updateTabs();
  }

  componentWillUnmount() {
    if (Utils.isChromeExtension()) {
      chrome.tabs.onCreated.removeListener(() => this.updateTabs());
      chrome.tabs.onMoved.removeListener(() => this.updateTabs());
      chrome.tabs.onRemoved.removeListener(() => this.updateTabs());
      chrome.tabs.onDetached.removeListener(() => this.updateTabs());
      chrome.tabs.onAttached.removeListener(() => this.updateTabs());
    }
  }

  updateTabs() {
    if (Utils.isChromeExtension()) {
      chrome.tabs.query({}, tabs => {
        this.setState(() => this.setState({ windows: this.createWindowTabsMap(tabs) }));
      });
    } else {
      // fill with some test data instead
      this.setState({ windows: Utils.createTestWindows() });
    }
  }

  createWindowTabsMap(tabs : chrome.tabs.Tab[]) {
    let windowTabs = new Map<number, WindowInfo>();
    let windows : WindowInfo[] = [];

    tabs.forEach(tab => {
      if (!windowTabs.has(tab.windowId)) {
        let windowInfo = { id: tab.windowId, tabs: [] };
        windowTabs.set(tab.windowId, windowInfo);
        windows.push(windowInfo);
      }
      let tabInfo = { id: tab.id!, favIconUrl: tab.favIconUrl!, title: tab.title!, windowId : tab.windowId! };
      windowTabs.get(tab.windowId)!.tabs.push(tabInfo);
    });

    return windows;
  }

  searchTextUpdated(text : string) {
    console.log(`Search text updated: ${text}`);
    this.setState({searchText: text});
  }
}

export default WindowLayout;