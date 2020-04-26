import React from 'react';
import './styles.css';
import Tab from './tab';
import { WindowInfo, TabInfo } from '../../types/Types';
import { DragDropContext, Droppable } from "react-beautiful-dnd";

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
    chrome.windows.remove(windowId);
  }

  onDragEnd() {
    // TODO
  }
}

export default Window;
