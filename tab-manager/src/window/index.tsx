import React from 'react';
import './styles.css';
import { WindowInfo } from '../types/Types';
import { Droppable } from "react-beautiful-dnd";
import Utils from '../types/Utils';
import DraggableTab from '../draggabletab';

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
        <Droppable droppableId={ this.props.window.id.toString() }>
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              { this.props.window.tabs.map((tab, index) =>
                <DraggableTab key={tab.id} tab={tab} index={index} />
              )}
              {provided.placeholder}
            </div>
          )}            
        </Droppable>
      </div>
    )
  }

  closeWindow(windowId : number) {
    if (Utils.isChromeExtension()) {
      chrome.windows.remove(windowId);
    }
  }
}

export default Window;
