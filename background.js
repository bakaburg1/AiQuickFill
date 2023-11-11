"use strict";

let timer = null;
let textBoxContent = '';
let pageContent = '';
const API_URL = 'https://api.openai.com/v1/chat/completions';


async function updateTextbox(request, sender) {
  textBoxContent = request.textBoxContent;
    
  const settings = await chrome.storage.sync.get();
  const local_storage = await chrome.storage.local.get();
  const context = local_storage.context;

  const context_text = `
  TITLE: ${context.title}.
  DESCRIPTION: ${context.description}.
  PAGE TEXT: ${context.bodyText}`

  // Construct the messages for the OpenAI API
  const messages = [
    {
      "role": "system",
      "content": "You are a helpful assistant that uses the context of the webpage and the user's input to provide the most logical and useful completion of the user's text. Provide only the completion, no explanations or other comments. Style your output as if the user were typing it."
    },
    {
      "role": "user",
      "content": `The webpage contains the following information:
### ${context_text}
###

The user wrote: ###
${textBoxContent}
###
`
    }
  ];

  console.log(messages)
  
  // Call the LLM API to get a completion
  const response = await promptLLM(settings, messages);
  
  // If the API call fails, throw an error
  if (!response.ok) {
    console.log(response)
    throw new Error('API request failed');
  }
  
  // Get the completion from the API response
  const data = await response.json();

  // Send the completion back to the content script
  chrome.tabs.sendMessage(
    sender.tab.id,
    {
      type: 'COMPLETION_RECEIVED',
      completion: data.choices[0].message.content
    }
    );
  }
  
  async function promptLLM(settings, messages) {

    settings.modelTemp = parseFloat(settings.modelTemp)

    // Call the OpenAI API
    const response = fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`
    },
    body: JSON.stringify({
      'temperature': settings.modelTemp,
      'model': 'gpt-4-1106-preview',
      'messages': messages
    })
  });

  return response;
}

// Listen for messages from the content script

// Trigger the LLM suggestion when the user types in the textbox
chrome.runtime.onMessage.addListener((request, sender) => {

  // 
  if (request.type === 'TEXT_BOX_UPDATED') {
    // Cancel the previous timer
    if (timer) {
      clearTimeout(timer);
    }
    
    // Start a new timer
    timer = setTimeout(() => {
      updateTextbox(request, sender);
    }, 300);
  }
});

// Update the context in the storage on focus in a textbox
chrome.runtime.onMessage.addListener((request, sender) => {

  if (request.type === 'STORE_CONTEXT') {
    // Store the context in chrome.storage.sync
    chrome.storage.local.set({context: request.context});
  }
});
