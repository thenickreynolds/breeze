// TODO clean up scripts used in background

BreezeBackground = {

    // store window:tab -> action?

    onCreated: (tab) => {
        console.log(`Tab Created: T${tab.id} in W${tab.windowId}: ${tab.title}`);
    },
    onUpdated: (tabId, changeInfo, tab) => {
        console.log(`Tab Updated: T${tab.id} in W${tab.windowId}: ${tab.title}`);

        const logChange = (field, name) => {
            if (field && window.debugBreeze === true) {
                console.log(`> Updated ${name}: ${field}`);
            }
        };

        logChange(changeInfo.status, "Status");
        logChange(changeInfo.url, "URL");
        logChange(changeInfo.pinned, "Pinned");
        logChange(changeInfo.audible, "Audible");;
        logChange(changeInfo.discarded, "Discarded");
        logChange(changeInfo.autoDiscardable, "Auto-discardable");;
        logChange(changeInfo.mutedInfo, "Muted Info");
        logChange(changeInfo.favIconUrl, "Favicon");
        logChange(changeInfo.title, "Title");
    },
    onMoved: (tabId, moveInfo) => {
        console.log(`Tab Moved: T${tabId} in W${moveInfo.windowId} from ${moveInfo.fromIndex} to ${moveInfo.toIndex}`);
    },
    onActivated: (activeInfo) => {
        console.log(`Tab Activaterd: T${activeInfo.tabId} in W${activeInfo.windowId}`);
    },
    onHighlighted: (highlightInfo) => {
        console.log(`Tab Highlighted: W${highlightInfo.windowId}, Tabs ${highlightInfo.tabIds}`);
    },
    onDetached: (tabId, detachInfo) => {
        console.log(`Tab Detached: T${tabId} in W${detachInfo.oldWindowId} at ${detachInfo.oldPosition}`);
    },
    onAttached: (tabId, attachInfo) => {
        console.log(`Tab Attached: T${tabId} in W${attachInfo.newWindowId} at ${attachInfo.newPosition}`);
    },
    onRemoved: (tabId, removeInfo) => {
        console.log(`Tab Removed: T${tabId} in W${removeInfo.windowId}, isWindowClosing ${removeInfo.isWindowClosing}`);
    },
    onReplaced: (addedTabId, removedTabId) => {
        console.log(`Tab Replaced: T${addedTabId} replaxed T${removedTabId}`);
    },
    onZoomChange: (zoomChangeInfo) => {
        console.log(`Tab Zoomed: T${zoomChangeInfo.tabId} zoomed from ${zoomChangeInfo.oldZoomFactor} to ${zoomChangeInfo.newZoomFactor}`);
    },
};

BreezeBackground.init = () => {
    chrome.tabs.onCreated.addListener(BreezeBackground.onCreated);
    chrome.tabs.onUpdated.addListener(BreezeBackground.onUpdated);
    chrome.tabs.onMoved.addListener(BreezeBackground.onMoved);
    chrome.tabs.onActivated.addListener(BreezeBackground.onActivated);
    chrome.tabs.onHighlighted.addListener(BreezeBackground.onHighlighted);
    chrome.tabs.onDetached.addListener(BreezeBackground.onDetached);
    chrome.tabs.onAttached.addListener(BreezeBackground.onAttached);
    chrome.tabs.onRemoved.addListener(BreezeBackground.onRemoved);
    chrome.tabs.onReplaced.addListener(BreezeBackground.onReplaced);
    chrome.tabs.onZoomChange.addListener(BreezeBackground.onZoomChange);
};

BreezeBackground.init();