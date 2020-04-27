import React from 'react';
import './styles.css';
import Window from './window';
import { WindowInfo } from '../types/Types'
import Utils from '../types/Utils';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

type WindowsProps = {

};

type WindowsState = {
  windows: WindowInfo[]
};

class WindowsContainer extends React.Component<WindowsProps, WindowsState> {
  constructor(props : WindowsProps) {
    super(props);
    this.state = { windows : [] };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  render() {
    return (
      <div id="main_container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          { this.state.windows.map(window => {
            return <Window key={window.id} window={window} />
          })}
        </DragDropContext>
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

  onDragEnd(result : DropResult) {
    const tabId = Number(result.draggableId);
    const windowId = Number(result.destination?.droppableId);

    const tabs = this.state.windows.flatMap(window => window.tabs);
    const tab = tabs.find(tab => tab.id === tabId);

    console.log(`Moving tab ${tabId} to window ${windowId}`);

    if (Utils.isChromeExtension() && tab && result.destination) {
      chrome.tabs.move(tabId, {windowId: windowId, index: result.destination.index});
    }
  }
}

export default WindowsContainer;
