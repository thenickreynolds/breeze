import React from 'react';
import './styles.css';
import Tab from './tab';

const numColors = 5;

type WindowProps = {
  id: number,
  tabs: chrome.tabs.Tab[]
}

type WindowState = {
  colorClass: string,
}

class Window extends React.Component<WindowProps, WindowState> {
  constructor(props : WindowProps) {
    super(props);
    this.state = { colorClass: "pastel_" + (this.props.id % numColors) };
  }

  render() {
    return (
      <div className={ "windows_container " + this.state.colorClass }>
        <div className="title_container">
          <div className="window_title">Window { this.props.id }</div>
          <div className="tab_close" onClick={() => this.closeWindow(this.props.id)} />
        </div>

        { this.props.tabs.map(tab =>
          <Tab tab={tab} />
        )}
      </div>
    )
  }

  closeWindow(windowId : number) {
    chrome.windows.remove(windowId);
  }
}

export default Window;
