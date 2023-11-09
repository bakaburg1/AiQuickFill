// Listen for focus events on textboxes
document.addEventListener('focus', event => {
  if (event.target.tagName.toLowerCase() === 'textarea' || (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'text')) {
    // Extract meaningful information from the page
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const bodyText = document.body.innerText;

    // Send a message to the background script
    chrome.runtime.sendMessage({type: 'TEXT_BOX_FOCUSED', pageContent: `TITLE: ${title}. DESCRIPTION: ${description}. PAGE TEXT: ${bodyText}`});
  }
}, true);

// Listen for input events on textboxes
document.addEventListener('input', event => {
  if (event.target.tagName.toLowerCase() === 'textarea' || (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'text')) {
    // Send a message to the background script
    chrome.runtime.sendMessage({type: 'TEXT_BOX_UPDATED', textBoxContent: event.target.value});
  }
}, true);

// This section of code is responsible for listening to messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // We're specifically interested in messages of type 'COMPLETION_RECEIVED'
  if (request.type === 'COMPLETION_RECEIVED') {
    // The completion is the suggested text that we'll insert into the textbox
    let completion = request.completion;
    // We'll insert the completion into the currently active (focused) element
    let textBox = document.activeElement;
    // But only if that element is a textbox or a textarea
    if (textBox.tagName.toLowerCase() === 'textarea' || (textBox.tagName.toLowerCase() === 'input' && textBox.type === 'text')) {
      // We'll first get the current text in the textbox
      let userText = textBox.value;
      // Then we'll create a new span element to hold the completion
      let span = document.createElement('span');
      // We'll set the text of the span to be the completion
      span.textContent = completion;
      // And we'll make the completion gray to distinguish it from the user's text
      span.style.color = 'gray';

      // Then we'll append the span to the textbox
      textBox.appendChild(span);

      // We'll also add an event listener to the textbox for when the user presses a key
      textBox.addEventListener('keydown', function(e) {
        // If the user presses the 'Tab' key
        if (e.key === 'Tab') {
          // We'll prevent the default action (which is to switch focus to the next element)
          e.preventDefault();
          // And instead, we'll remove the span and add its text to the textbox value
          textBox.value += span.textContent;
          textBox.removeChild(span);
        } else {
          // If the user presses any other key, we'll just remove the span
          textBox.removeChild(span);
        }
      });
    }
  }
});
