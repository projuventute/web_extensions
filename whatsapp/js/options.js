/**
 * Handles saving user settings.
 */
let extensionIsActiveValue;
function saveSettings() {
  console.log("saving extIsActive="+extensionIsActiveValue);
  const mediaBlockValue = document.getElementById('media-block').checked;
  const conversationReaderValue = document.getElementById('conversation-reader').checked;
  const darkModeValue = document.getElementById('dark-mode').checked;
  const conversationPreviewValue = document.getElementById('conversation-preview').checked;
  const hideAdminsValue = document.getElementById('hide-admins').checked;
  const notDeliveredValue = document.getElementById('not-delivered').checked;
  const cleanLayoutValue = document.getElementById('clean-layout').checked;
  const beraitungUrlValue = document.getElementById('beraitung-url').value;
  const beraitungSigValue = document.getElementById('beraitung-sig').value;
  // Save settings to Chrome storage
  chrome.storage.sync.set({
    'media-block': mediaBlockValue,
    'conversation-reader': conversationReaderValue,
    'dark-mode': darkModeValue,
    'conversation-preview': conversationPreviewValue,
    'hide-admins': hideAdminsValue,
    'not-delivered': notDeliveredValue,
    'clean-layout': cleanLayoutValue,
    'beraitung-url': beraitungUrlValue,
    'beraitung-sig': beraitungSigValue,
    'extension-is-active': extensionIsActiveValue
  }, function () {
    // Notify the user that settings are saved.
  });
}

/**
* Function to set default settings.
*/
function setDefaultSettings() {
  chrome.storage.sync.get([
    'media-block',
    'conversation-reader',
    'dark-mode',
    'hide-admins',
    'not-delivered',
    'clean-layout',
    'beraitung-url',
    'beraitung-sig',
    'extension-is-active'
  ], function (data) {
    // Check if settings exist in storage, if not, set default values
    if (typeof data['media-block'] === 'undefined') {
      chrome.storage.sync.set({
        'media-block': true // Default value for media blocking
      });
    }
    if (typeof data['conversation-reader'] === 'undefined') {
      chrome.storage.sync.set({
        'conversation-reader': true // Default value for conversation reader
      });
    }
    if (typeof data['dark-mode'] === 'undefined') {
      chrome.storage.sync.set({
        'dark-mode': false // Default value for dark mode
      });
    }
    if (typeof data['conversation-preview'] === 'undefined') {
      chrome.storage.sync.set({
        'conversation-prewview': false // Default value for conversation-preview
      });
    }
    if (typeof data['hide-admins'] === 'undefined') {
      chrome.storage.sync.set({
        'hide-admins': false // Default value for dark mode
      });
    }
    if (typeof data['not-delivered'] === 'undefined') {
      chrome.storage.sync.set({
        'not-delivered': false // Default value for conversation-preview
      });
    }
    if (typeof data['clean-layout'] === 'undefined') {
      chrome.storage.sync.set({
        'clean-layout': false // Default value for conversation-preview
      });
    }
    if (typeof data['beraitung-url'] === 'undefined') {
      chrome.storage.sync.set({
        'beraitung-url': "" // Default value for conversation-preview
      });
    }
    if (typeof data['beraitung-sig'] === 'undefined') {
      chrome.storage.sync.set({
        'beraitung-sig': "" // Default value for conversation-preview
      });
    }
    if (typeof data['extension-is-active'] === 'undefined') {
      chrome.storage.sync.set({
        'extension-is-active': "true" // Default value for conversation-preview
      });
    }
  });
}


// Load and display saved settings when the options page loads
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
    // Enable the extension: Add your enable code here
    svg.classList.add('active'); // Add 'active' class
    console.log('Extension enabled');
    extensionIsActiveValue = true;
  } else {
    svg.classList.remove('active'); // Remove 'active' class
    console.log('Extension disabled');
    extensionIsActiveValue = false;
  }
  document.getElementById('media-block').checked = data['media-block'] || false;
  document.getElementById('conversation-reader').checked = data['conversation-reader'] || false;
  document.getElementById('dark-mode').checked = data['dark-mode'] || false;
  document.getElementById('conversation-preview').checked = data['conversation-preview'] || false;
  document.getElementById('hide-admins').checked = data['hide-admins'] || false;
  document.getElementById('not-delivered').checked = data['not-delivered'] || false;
  document.getElementById('clean-layout').checked = data['clean-layout'] || false;
  document.getElementById('beraitung-url').value = data['beraitung-url'] || "";
  document.getElementById('beraitung-sig').value = data['beraitung-sig'] || "";
});

// Attach the saveSettings function to the button click event
//document.getElementById('save-button').addEventListener('click', saveSettings);
const svg = document.querySelector('#extension-is-active');

svg.addEventListener('click', function () {
  if (svg.classList.contains('active')) {
    // Disable the extension: Add your disable code here
    svg.classList.remove('active'); // Remove 'active' class
    console.log('Extension disabled');
    extensionIsActiveValue = false;
    saveSettings();
  } else {
    // Enable the extension: Add your enable code here
    svg.classList.add('active'); // Add 'active' class
    console.log('Extension enabled');
    extensionIsActiveValue = true;
    saveSettings();
  }
});
// Call the setDefaultSettings function when the options page loads
setDefaultSettings();
document.querySelector('#save-button').addEventListener('click', function () {
  saveSettings();
});
// Add this code to the existing event listener for checkboxes
document.querySelectorAll('.switch .slider').forEach(function (slider) {
  slider.addEventListener('click', function () {
    // Find the associated checkbox
    var checkbox = slider.previousElementSibling;

    // Toggle the checkbox state
    checkbox.checked = !checkbox.checked;

    // Log the new checkbox state
    saveSettings();
  });
});

/**
 * Language Labels
 */
function setLabels() {
  document.getElementById('popup-title').innerText = chrome.i18n.getMessage("popupTitle");
  document.querySelectorAll('.ll_conversation_cleaner').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_conversation_cleaner");
  });
  document.querySelectorAll('.ll_media_blocker').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_media_blocker");
  });
  document.querySelectorAll('.ll_dark_mode').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_dark_mode");
  });
  document.querySelectorAll('.ll_conversation_preview').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_conversation_preview");
  });
  document.querySelectorAll('.ll_hide_admins').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_hide_admins");
  });
  document.querySelectorAll('.ll_not_delivered').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_not_delivered");
  });
  document.querySelectorAll('.ll_clean_layout').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_clean_layout");
  });
  document.querySelectorAll('.ll_support_message').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_support_message");
  });
  document.querySelectorAll('.ll_beraitung_url').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_beraitung_url");
  });
  document.querySelectorAll('.ll_beraitung_sig').forEach(function (element) {
    element.innerText = chrome.i18n.getMessage("ll_beraitung_sig");
  });
}

// Add this code to the top of popup.js
document.addEventListener('DOMContentLoaded', function () {

  setLabels();

});


