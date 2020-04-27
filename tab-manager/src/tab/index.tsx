import React from 'react';
import './styles.css';
import defaultFavicon from './default_favicon.png';
import { TabInfo } from '../types/Types';
import classNames from "classnames";
import Utils from '../types/Utils';

type TabProps = {
  tab: TabInfo,
  index: number,
  highlight: boolean,
  outline: boolean,
};

class Tab extends React.Component<TabProps> {
  static defaultProps = {
    highlight: false,
    outline: false,
  };

  render() {
    let tab = this.props.tab;
    let favIconUrl = tab.favIconUrl || defaultFavicon;

    return (
      <div
        className={classNames({
          item: true,
          tab: true,
          dragging: this.props.highlight,
          tab_selected: this.props.outline,
        })}
        onDoubleClick={() => this.activateTab(tab.id!, tab.windowId!)}
      >
        <img className="tab_favicon" alt="" src={favIconUrl} />
        <div className="tab_title">{ tab.title }</div>
        <div className="tab_close" onClick={() => this.closeTab(tab.id!)}></div>
      </div>
    );
  }

  closeTab(tabId : number) {
    if (Utils.isChromeExtension()) {
      chrome.tabs.remove(tabId);
    }
  }

  activateTab(tabId : number, windowId : number) {
    console.log("double click");
    if (Utils.isChromeExtension()) {
      chrome.tabs.update(tabId, { active: true });
      chrome.windows.update(windowId, { focused: true });
    }
  }
}

export default Tab;
