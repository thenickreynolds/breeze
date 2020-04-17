import React from 'react';
import './styles.css';
import Window from './window';
import { WindowInfo } from '../types/Types'

type WindowsProps = {

};

type WindowsState = {
  windows: WindowInfo[]
};

class WindowsContainer extends React.Component<WindowsProps, WindowsState> {
  constructor(props : WindowsProps) {
    super(props);
    this.state = { windows : [] };
  }

  render() {
    return (
      <div id="main_container">
        { this.state.windows.map(window => {
            return <Window window={window} />
        })}
      </div>
    );
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

  isInChrome() {
    return window.chrome && chrome.runtime && chrome.runtime.id;
  }

  updateTabs() {
    if (this.isInChrome()) {
      chrome.tabs.query({}, tabs => {
        this.setState(() => this.setState({ windows: this.createWindowTabsMap(tabs) }));
      });
    } else {
      // fill with some test data instead
      this.setState({ windows: this.createTestWindows() });
    }
  }

  createTestWindows() {
    let windows = [];
    let tabId = 0;
    for (let windowId = 0; windowId < 5; windowId++) {
      let tabs = [];
      for (let i = 0; i < 5; i++) {
        tabs.push({ windowId: windowId, id: tabId++, favIconUrl: '', title: 'Test title ' + tabId });
      }
      windows.push( { id: windowId, tabs: tabs });
    }
    return windows;
  }

  componentDidMount() {
    if (this.isInChrome()) {
      chrome.tabs.onCreated.addListener(() => this.updateTabs());
      chrome.tabs.onMoved.addListener(() => this.updateTabs());
      chrome.tabs.onRemoved.addListener(() => this.updateTabs());
      chrome.tabs.onDetached.addListener(() => this.updateTabs());
      chrome.tabs.onAttached.addListener(() => this.updateTabs());
    }

    this.updateTabs();
  }

  componentDidUnmount() {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
      chrome.tabs.onCreated.removeListener(() => this.updateTabs());
      chrome.tabs.onMoved.removeListener(() => this.updateTabs());
      chrome.tabs.onRemoved.removeListener(() => this.updateTabs());
      chrome.tabs.onDetached.removeListener(() => this.updateTabs());
      chrome.tabs.onAttached.removeListener(() => this.updateTabs());
    }
  }
}

export default WindowsContainer;
