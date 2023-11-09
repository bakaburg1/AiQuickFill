let timer = null;
let textBoxContent = '';
let pageContent = '';

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TEXT_BOX_FOCUSED') {
    // Extract meaningful information from the page
    pageContent = request.pageContent;
  } else if (request.type === 'TEXT_BOX_UPDATED') {
    // Cancel the previous timer
    if (timer) {
      clearTimeout(timer);
    }

    // Start a new timer
    timer = setTimeout(() => {
      textBoxContent = request.textBoxContent;

      // Construct the messages for the OpenAI API
      const messages = [
        {
          "role": "system",
          "content": "You are a helpful assistant that uses the context of the webpage and the user's input to provide the most logical and useful completion of the user's text. Provide only the completion, no explanations or other comments."
        },
        {
          "role": "user",
          "content": `The webpage contains the following information
          ###: ${pageContent}
          ###

          The user wrote: ###
          ${textBoxContent}
          ###
          `
        }
      ];

      // Call the OpenAI API
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          'model': 'gpt-4-1106-preview',
          'messages': messages
        })
      })
      .then(response => response.json())
      .then(data => {
        // Send the completion back to the content script
        chrome.tabs.sendMessage(sender.tab.id, {type: 'COMPLETION_RECEIVED', completion: data.choices[0].message.content});
      });
    }, 300);
  }
});
