import React from 'react';
import './styles.css';
import defaultFavicon from './default_favicon.png';

type TabProps = {
  tab: chrome.tabs.Tab
};

class Tab extends React.Component<TabProps> {
  constructor(props : TabProps) {
    super(props);
  }

  render() {
    let tab = this.props.tab;
    let favIconUrl = tab.favIconUrl || defaultFavicon;

    return (
      <div className="item tab" onDoubleClick={() => this.activateTab(tab.id!, tab.windowId!)}>
        <img className="tab_favicon" alt="" src={favIconUrl} />
        <div className="tab_title">{ tab.title }</div>
        <div className="tab_close" onClick={() => this.closeTab(tab.id!)}></div>
      </div>
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
