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