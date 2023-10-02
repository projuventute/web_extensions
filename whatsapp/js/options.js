
/**
 * Handles saving user settings.
 */
function saveSettings() {
  const mediaBlockValue = document.getElementById('media-block').checked;

  // Save settings to Chrome storage
  chrome.storage.sync.set({
    'media-block': mediaBlockValue
  }, function () {
    // Notify the user that settings are saved.
    alert('Settings saved!');
  });
}

// Attach the saveSettings function to the button click event
document.getElementById('save-button').addEventListener('click', saveSettings);

// Load and display saved settings when the options page loads
chrome.storage.sync.get([
  'media-block'
], function (data) {
  document.getElementById('media-block').checked = data['media-block'] || false;
});
/**
* Function to set default settings.
*/
function setDefaultSettings() {
  chrome.storage.sync.get([
    'media-block'
  ], function (data) {
    // Check if settings exist in storage, if not, set default values
    if (typeof data['media-block'] === 'undefined') {
      chrome.storage.sync.set({
        'media-block': true // Default value for media blocking
      });
    }
  });
}

// Call the setDefaultSettings function when the options page loads
setDefaultSettings();
