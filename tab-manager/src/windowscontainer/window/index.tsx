import React from 'react';
import './styles.css';
import Tab from './tab';
import { WindowInfo, TabInfo } from '../../types/Types';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Utils from '../../types/Utils';

const numColors = 5;

type WindowProps = {
  window: WindowInfo;
}

type WindowState = {
  colorClass: string,
}

class Window extends React.Component<WindowProps, WindowState> {
  constructor(props : WindowProps) {
    super(props);
    this.state = { colorClass: "pastel_" + (this.props.window.id % numColors) };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  render() {
    return (
      <div className={ "windows_container " + this.state.colorClass }>
        <div className="title_container">
          <div className="window_title">Window { this.props.window.id }</div>
          <div className="tab_close" onClick={() => this.closeWindow(this.props.window.id)} />
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="tabs">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                { this.props.window.tabs.map((tab, index) =>
                  <Tab tab={tab} index={index} />
                )}

                {provided.placeholder}
              </div>
            )}            
          </Droppable>
        </DragDropContext>
      </div>
    )
  }

  closeWindow(windowId : number) {
    if (Utils.isChromeExtension()) {
      chrome.windows.remove(windowId);
    }
  }

  onDragEnd(result : DropResult) {
    const tabId = Number(result.draggableId);
    const tab = this.props.window.tabs.find(tab => tab.id === tabId);

    if (Utils.isChromeExtension() && tab && result.destination) {
      chrome.tabs.move(tabId, {windowId: tab.windowId, index: result.destination.index});
    }
  }
}

export default Window;
