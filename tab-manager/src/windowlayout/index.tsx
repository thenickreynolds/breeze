import React from 'react';
import './styles.css';
import SearchBox from '../searchbox';
import WindowsContainer from '../windowscontainer';
import classNames from 'classnames';
import SearchResults from '../searchresults';
import Utils from '../types/Utils';
import { WindowInfo, TabInfo } from '../types/Types';

type WindowProps = {
}

type WindowState = {
    windows: WindowInfo[],
    searchTabs: TabInfo[],
    searchText: string,
    selectedTabIndex: number,
}

class WindowLayout extends React.Component<WindowProps,WindowState> {
  constructor(props : WindowProps) {
    super(props);
    this.state = { windows: [], selectedTabIndex: 0, searchText: "", searchTabs: [] };
    this.searchTextUpdated = this.searchTextUpdated.bind(this);
    this.upPressed = this.upPressed.bind(this);
    this.downPressed = this.downPressed.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }

  render() {
    return (
      <div>
        <SearchBox
          searchUpdated={this.searchTextUpdated}
          upPressed={this.upPressed}
          downPressed={this.downPressed}
          enterPressed={this.enterPressed}
        />
        <div className={classNames({ hidden: this.state.searchText.length !== 0 })}>
          <WindowsContainer windows={this.state.windows} />
        </div>
        <div className={classNames({ hidden: this.state.searchText.length === 0 })}>
          <SearchResults
            tabs={this.state.searchTabs}
            selectedTabIndex={this.state.selectedTabIndex}
          />
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
    const searchText = text.trim().toLowerCase();
    const filteredTabs = this.state.windows.flatMap(window => window.tabs).filter(tab => tab.title.toLowerCase().search(searchText) >= 0);

    this.setState({searchTabs: filteredTabs, selectedTabIndex: 0, searchText: searchText});
  }

  upPressed() {
    this.updateSelectedTabIndex(-1);
  }

  downPressed() {
    this.updateSelectedTabIndex(1);
  }

  updateSelectedTabIndex(offset: number) {
    const numSearchTabs = this.state.searchTabs.length;

    if (numSearchTabs === 0) {
      return;
    }

    const updatedSelectedTabIndex = (this.state.selectedTabIndex + offset + numSearchTabs) % numSearchTabs;
    this.setState({selectedTabIndex: updatedSelectedTabIndex});
  }

  enterPressed() {
    if (this.state.searchTabs.length > 0 && Utils.isChromeExtension()) {
      const tab = this.state.searchTabs[this.state.selectedTabIndex];
      chrome.tabs.update(tab.id, { selected: true });
      chrome.windows.update(tab.windowId, { focused: true });
    }
  }
}

export default WindowLayout;