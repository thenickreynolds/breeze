export default {
    isChromeExtension: function() {
        return window.chrome && chrome.runtime && chrome.runtime.id;
    }
}