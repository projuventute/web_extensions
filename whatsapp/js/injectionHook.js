/**
 * @brief Function to set default settings.
 */
function setDefaultSettings() {
  // Use chrome.storage.sync.get to retrieve the settings from storage
  chrome.storage.sync.get([
    'media-block',
    'conversation-reader',
    'extension-is-active'
  ], function (data) {
    console.log("isActive="+data['extension-is-active']);
    // Check if settings exist in storage, if not, set default values
    if (typeof data['media-block'] === 'undefined') {
      chrome.storage.sync.set({
        'media-block': true // Default value for media blocking
      });
    }
    if (typeof data['conversation-reader'] === 'undefined') {
      chrome.storage.sync.set({
        'conversation-reader': true // Default value for media blocking
      });
    }
    if (typeof data['extension-is-active'] === 'undefined') {
      chrome.storage.sync.set({
        'extension-is-active': true // Default value for media blocking
      });
    }
    // Call the loadAndInject function after setting default settings
    loadAndInject();
  });
}

/**
 * @brief Call the setDefaultSettings function when the options page loads
 */

setDefaultSettings();


/**
 * @brief Function to load settings and inject scripts
 */
function loadAndInject() {
  // Load and make settings available to injected scripts
  chrome.storage.sync.get([
    'media-block',
    'conversation-reader',
    'dark-mode',
    'conversation-preview',
    'hide-admins',
    'not-delivered',
    'clean-layout',
    'beraitung-url',
    'beraitung-sig',
    'extension-is-active'
  ], function (data) {
    if (data['extension-is-active']) {
      var settingsContainer = document.createElement('div');
      settingsContainer.id = "settings-container";
      data['extensionBase'] = chrome.runtime.getURL('/');
      data['ll_show_unanswered'] = chrome.i18n.getMessage("ll_show_unanswered");
      data['ll_show_all'] = chrome.i18n.getMessage("ll_show_all");
      settingsContainer.innerHTML = JSON.stringify(data);
      (document.body || document.documentElement).appendChild(settingsContainer);

      // Load the injected scripts
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL('js/injected.js');
      (document.head || document.documentElement).appendChild(s);

      var s = document.createElement('script');
      s.src = chrome.runtime.getURL('js/media-block.js');
      (document.head || document.documentElement).appendChild(s);
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL('js/conversation-reader.js');
      (document.head || document.documentElement).appendChild(s);
      if (data['dark-mode']) {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/darkmode.js');
        (document.head || document.documentElement).appendChild(s);
      }
      if (data['conversation-preview']) {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/conversation-preview.js');
        (document.head || document.documentElement).appendChild(s);
        var iframeContainer = document.createElement('div');
        iframeContainer.id = "iframe-container";
        iframeContainer.innerHTML = '<iframe id="my-iframe" src="" frameborder="0" width="100%" height="100%"></iframe>';
        (document.body || document.documentElement).appendChild(iframeContainer);

      }
      if (data['clean-layout']) {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/clean-layout.js');
        (document.head || document.documentElement).appendChild(s);
      }
      if (data['beraitung-url']) {
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/beraitung.js');
        (document.head || document.documentElement).appendChild(s);
      }
    }
  });

}
