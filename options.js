// In-page cache of the user's options
const settings = {};

// Save settings to Chrome storage
function saveSettings() {
  settings.apiKey = $('#apiKey').val();
  settings.modelTemp = $('#modelTemp').val();
  
  console.log(settings)
  chrome.storage.sync.set(settings);
}

// Initialize the settings in the popup
async function loadSettings() {
  
  const settings = await chrome.storage.sync.get();
  $('#apiKey').val(settings.apiKey || '');
  $('#modelTemp').val(settings.modelTemp || '0.3');
  setupSlider();
  console.log("load settings:", $('#modelTemp').val())
  return settings;
}

$(document).ready(function () {

  // Call loadSettings when the options page is loaded
  loadSettings()
  
  // Add event listeners to the input fields to save settings when they change
  $('#Settings input').on('change', saveSettings)
  
  
  const extensionSwitch = $('#extensionSwitch');
  const activationStatus = $('.activationStatus');
  
  extensionSwitch.on('input', () => {
    if (extensionSwitch.checked) {
      activationStatus.textContent = 'Active';
    } else {
      activationStatus.textContent = 'Off';
    }
  });
});