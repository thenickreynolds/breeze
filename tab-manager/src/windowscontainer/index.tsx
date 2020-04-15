import React from 'react';
import './styles.css';
import Window from './window';

type WindowsProps = {

};

type WindowsState = {
  chromeTabs: chrome.tabs.Tab[]
};

class WindowsContainer extends React.Component<WindowsProps, WindowsState> {
  constructor(props : WindowsProps) {
    super(props);
    this.state = { chromeTabs: [] };
  }

  render() {
    console.log("num tabs: " + this.state.chromeTabs.length)
    let windowTabs = this.createWindowTabsMap(this.state.chromeTabs);
    
    return (
      <div id="main_container">
        { Array.from(windowTabs.keys()).map(windowId => {
            return <Window id={windowId} tabs={windowTabs.get(windowId)!} />
        })}
      </div>
    );
  }

  createWindowTabsMap(tabs : chrome.tabs.Tab[]) {
    let windowTabs = new Map<number,chrome.tabs.Tab[]>();
    tabs.forEach(tab => {
      if (!windowTabs.has(tab.windowId)) {
        windowTabs.set(tab.windowId, []);
      }
      windowTabs.get(tab.windowId)!.push(tab);
    });

    return windowTabs;
  }

  updateTabs() {
    console.log('updating tabs');
    chrome.tabs.query({}, tabs => {
      this.setState(() => this.setState({ chromeTabs: tabs }));
    });
  }

  componentDidMount() {
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
      chrome.tabs.onCreated.addListener(() => this.updateTabs());
      chrome.tabs.onMoved.addListener(() => this.updateTabs());
      chrome.tabs.onRemoved.addListener(() => this.updateTabs());
      chrome.tabs.onDetached.addListener(() => this.updateTabs());
      chrome.tabs.onAttached.addListener(() => this.updateTabs());

      this.updateTabs();
    }
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
