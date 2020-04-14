import React from 'react';
import './styles.css';
import Tab from './tab';

type WindowProps = {
  title: string,
  tabs: string[]
}

type WindowState = {
  title: string,
  tabs: string[],
  colorClass: string
}

class Window extends React.Component<WindowProps, WindowState> {
  constructor(props : WindowProps) {
    super(props);
    let colorNumber = Math.floor(Math.random() * 5);
    this.state = { title: props.title, tabs: props.tabs, colorClass: "pastel_" + colorNumber };
    // set random color
  }

  render() {
    return (
      <div className={ "windows_container " + this.state.colorClass }>
        <div className="title_container">
          <div className="window_title">{ this.state.title }</div>
          <div className="tab_close" />
        </div>
        { this.state.tabs.map(tab =>
          <Tab title={tab} />
        )}
      </div>
    );
  }
}

export default Window;
