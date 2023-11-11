// In-page cache of the user's options
const settings = {};
const settingsForm = document.getElementById("settingsForm");


// Save settings to Chrome storage
function saveSettings() {
  settings.apiKey = settingsForm.apiKey.value;
  settings.modelTemp = settingsForm.modelTemp.value;

  console.log(settings)
  chrome.storage.sync.set(settings);
}

// // Load settings from Chrome storage
// async function loadSettings() {
//   const settings = await chrome.storage.sync.get("settings");
//   settingsForm.apiKey.value = settings.apiKey || '';
//   settingsForm.modelTemp.value = settings.modelTemp || '0.3';

//   return settings;
// }

// // Call loadSettings when the options page is loaded
// document.addEventListener('DOMContentLoaded', loadSettings);

// // Add event listeners to the input fields to save settings when they change
// document.getElementById('settingsForm').addEventListener('change', saveSettings)

// Initialize the settings in the popup
async function loadSettings() {

  const settings = await chrome.storage.sync.get();
  document.getElementById('apiKey').value = settings.apiKey || '';
  document.getElementById('modelTemp').value = settings.modelTemp || '0.3';
  return settings;
}

// Call loadSettings when the options page is loaded
document.addEventListener('DOMContentLoaded', loadSettings);

// Add event listeners to the input fields to save settings when they change
document.getElementById('settingsForm').addEventListener('change', saveSettings)
