import React from 'react';
import './styles.css';
import Tab from '../tab';
import { Draggable } from 'react-beautiful-dnd';
import { TabInfo } from '../types/Types';

type DraggableTabProps = {
  tab: TabInfo,
  index: number,
}

class DraggableTab extends React.Component<DraggableTabProps> {
  render() {
    let tab = this.props.tab;
    
    return (
      <div className="draggableTab">
        <Draggable key={tab.id} draggableId={tab.id.toString()} index={this.props.index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Tab tab={this.props.tab} index={this.props.index} highlight={snapshot.isDragging} />
            </div>
          )}
        </Draggable>
      </div>
    );
  }
}

export default DraggableTab;
