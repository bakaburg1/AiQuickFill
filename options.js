// In-page cache of the user's options
const options = {};
const settingsForm = document.getElementById("settingsForm");


// Save settings to Chrome storage
function saveSettings() {
  options.apiKey = settingsForm.apiKey.value;
  options.modelTemp = settingsForm.modelTemp.value;
  chrome.storage.sync.set(options);
}

// Load settings from Chrome storage
function loadSettings() {
  chrome.storage.sync.get(['apiKey', 'modelTemp'], function(items) {
    settingsForm.apiKey.value = items.apiKey || '';
    settingsForm.modelTemp.value = items.modelTemp || '0.3';
  });
}

// Call loadSettings when the options page is loaded
document.addEventListener('DOMContentLoaded', loadSettings);

// Add event listeners to the input fields to save settings when they change
document.getElementById('settingsForm').addEventListener('change', saveSettings)


// Logic to manage the API key and model temperature on the options page
document.getElementById('settingsForm').addEventListener('submit', function(event) {
  // Prevent the form from being submitted normally
  event.preventDefault();

  // Get the value of the API key input field
  let apiKey = document.getElementById('apiKey').value;

  // Get the value of the model temperature input field
  let modelTemp = document.getElementById('modelTemp').value;

  // Use the Chrome storage API to save the API key and model temperature
  chrome.storage.sync.set({OPENAI_API_KEY: apiKey, modelTemperature: modelTemp}, function() {
    // Log a message to the console when the values have been saved
    console.log('The API key and model temperature are saved.');
  });
});