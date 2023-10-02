/**
 * @brief Function to set default settings.
 */
function setDefaultSettings() {
    // Use chrome.storage.sync.get to retrieve the settings from storage
    chrome.storage.sync.get([
        'media-block'
    ], function (data) {
        // Check if settings exist in storage, if not, set default values
        if (typeof data['media-block'] === 'undefined') {
            // Set the default value for media blocking
            chrome.storage.sync.set({
                'media-block': true // Default value for media blocking
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
        'media-block'
    ], function (data) {
        var settingsContainer = document.createElement('div');
        settingsContainer.id = "settings-container";
        settingsContainer.innerHTML = JSON.stringify(data);
        (document.body || document.documentElement).appendChild(settingsContainer);

        // Load the injected scripts
        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/injected.js');
        (document.head || document.documentElement).appendChild(s);

        var s = document.createElement('script');
        s.src = chrome.runtime.getURL('js/media-block.js');
        (document.head || document.documentElement).appendChild(s);
    });
}
