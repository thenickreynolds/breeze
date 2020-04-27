export default {
    isChromeExtension: function() {
        return window.chrome && chrome.runtime && chrome.runtime.id;
    },
    createTestWindows: function() {
        let windows = [];
        let tabId = 0;
        for (let windowId = 0; windowId < 5; windowId++) {
            let tabs = [];
            for (let i = 0; i < 5; i++) {
            tabs.push({ windowId: windowId, id: tabId++, favIconUrl: '', title: 'Test title ' + tabId });
            }
            windows.push( { id: windowId, tabs: tabs });
        }
        return windows;
    },
}