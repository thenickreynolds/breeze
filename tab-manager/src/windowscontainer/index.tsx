import React from 'react';
import './styles.css';
import Window from '../window';
import { WindowInfo } from '../types/Types'
import Utils from '../types/Utils';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

type WindowsProps = {
  windows: WindowInfo[],
};

class WindowsContainer extends React.Component<WindowsProps> {
  constructor(props : WindowsProps) {
    super(props);
    this.state = { windows : [] };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  render() {
    return (
      <div id="main_container">
        <DragDropContext onDragEnd={this.onDragEnd}>
          { this.props.windows.map(window => {
            return <Window key={window.id} window={window} />
          })}
        </DragDropContext>
      </div>
    );
  }

  onDragEnd(result : DropResult) {
    const tabId = Number(result.draggableId);
    const windowId = Number(result.destination?.droppableId);

    const tabs = this.props.windows.flatMap(window => window.tabs);
    const tab = tabs.find(tab => tab.id === tabId);

    console.log(`Moving tab ${tabId} to window ${windowId}`);

    if (Utils.isChromeExtension() && tab && result.destination) {
      chrome.tabs.move(tabId, {windowId: windowId, index: result.destination.index});
    }
  }
}

export default WindowsContainer;
