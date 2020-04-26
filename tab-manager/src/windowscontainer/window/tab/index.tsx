import React from 'react';
import './styles.css';
import defaultFavicon from './default_favicon.png';
import { TabInfo } from '../../../types/Types';
import { Draggable } from "react-beautiful-dnd";
import classNames from "classnames";

type TabProps = {
  tab: TabInfo,
  index: number,
};

class Tab extends React.Component<TabProps> {
  constructor(props : TabProps) {
    super(props);
  }

  render() {
    let tab = this.props.tab;
    let favIconUrl = tab.favIconUrl || defaultFavicon;

    return (
      <Draggable key={tab.id} draggableId={tab.id.toString()} index={this.props.index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div
              className={classNames({
                item: true,
                tab: true,
                dragging: snapshot.isDragging,
              })}
              onDoubleClick={() => this.activateTab(tab.id!, tab.windowId!)}
            >
              <img className="tab_favicon" alt="" src={favIconUrl} />
              <div className="tab_title">{ tab.title }</div>
              <div className="tab_close" onClick={() => this.closeTab(tab.id!)}></div>
            </div>
          </div>
        )}
        </Draggable>
    );
  }

  closeTab(tabId : number) {
    chrome.tabs.remove(tabId);
  }

  activateTab(tabId : number, windowId : number) {
    console.log("double click");
    chrome.tabs.update(tabId, { active: true });
    chrome.windows.update(windowId, { focused: true });
  }
}

export default Tab;
