/**
* Returns x, y coordinates for absolute positioning of a span within a given text input
* at a given selection point
* @param {object} input - the input element to obtain coordinates for
* @param {number} selectionPoint - the selection point for the input
*/
function getCursorXY(input, selectionPoint) {
    const {
        offsetLeft: inputX,
        offsetTop: inputY,
    } = input
    // create a dummy element that will be a clone of our input
    const div = document.createElement('div')
    // get the computed style of the input and clone it onto the dummy element
    const copyStyle = getComputedStyle(input)
    for (const prop of copyStyle) {
        div.style[prop] = copyStyle[prop]
    }
    // we need a character that will replace whitespace when filling our dummy element if it's a single line <input/>
    const swap = '.'
    const inputValue = input.tagName === 'INPUT' ? input.value.replace(/ /g, swap) : input.value
    // set the div content to that of the textarea up until selection
    const textContent = inputValue.substr(0, selectionPoint)
    // set the text content of the dummy element div
    div.textContent = textContent
    if (input.tagName === 'TEXTAREA') div.style.height = 'auto'
    // if a single line input then the div needs to be single line and not break out like a text area
    if (input.tagName === 'INPUT') div.style.width = 'auto'
    // create a marker element to obtain caret position
    const span = document.createElement('span')
    // give the span the textContent of remaining content so that the recreated dummy element is as close as possible
    span.textContent = inputValue.substr(selectionPoint) || '.'
    // append the span marker to the div
    div.appendChild(span)
    // append the dummy element to the body
    document.body.appendChild(div)
    // get the marker position, this is the caret position top and left relative to the input
    const { offsetWidth: spanX, offsetHeight: spanY } = span
    // lastly, remove that dummy element
    // NOTE:: can comment this out for debugging purposes if you want to see where that span is rendered
    //document.body.removeChild(div)
    // return an object with the x and y of the caret. account for input positioning so that you don't need to wrap the input
    return {
        x: inputX + spanX,
        y: inputY + spanY,
    }
}

function getCursorXY2(input) {
    // Collect the x and y coordinates for the caret position
    const {
        offsetLeft: inputX,
        offsetTop: inputY,
    } = input
    
    // create a dummy element that will be a clone of our input
    const div = document.createElement('div')

    const copyStyle = getComputedStyle(input)
    for (const prop of copyStyle) {
        div.style[prop] = copyStyle[prop]
    }
    
    div.style.position = 'absolute';
    div.style.top = input.offsetTop + 'px';
    div.style.maxHeight = input.offsetHeight + 'px';
    div.style.height = 'auto';
    div.style.left = input.offsetLeft + 'px';
    div.style.width = input.offsetWidth + 'px';
    div.textContent = input.value;

    document.body.appendChild(div)

    const coords = {
        x: input.offsetLeft,
        y: div.offsetHeight + input.offsetTop,
    }

    div.remove();

    return coords;
}


/**
* Checks if an input field is valid for auto-filling.
* @param {HTMLElement} element - The input field element to check.
* @returns {boolean} - True if the input field is valid, false otherwise.
*/
function isValidInputField(element) {
    return element.tagName.toLowerCase() === 'textarea' || 
    (element.tagName.toLowerCase() === 'input' && 
    element.type !== 'password' && 
    element.type !== 'email' && 
    element.type === 'text') ||
    element.isContentEditable;
}

/**
* Show the AI generated completion on the active input box as a tooltip.
* @param {string} completion - The AI generated completion to insert.
*/
function insertCompletion(completion) {
    
    if (debug) console.log("Inserting completion tooltip...");
    
    // Remove a previous tooltip if it exists
    let prev_tooltip = document.getElementById('AIQuickFill_myTooltip');
    if (prev_tooltip) {
        prev_tooltip.remove();
    }
    
    // Get the active element
    let activeElement = document.activeElement;
    
    // Create the tooltip element
    let tooltip = document.createElement('div');
    tooltip.id = 'AIQuickFill_myTooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
    
    // Get the cursor position
    let { x, y } = getCursorXY2(activeElement, activeElement.selectionStart);
    
    // Set the tooltip's position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.style.position = 'absolute';
    
    // Update the tooltip's content and make it visible
    tooltip.textContent = completion;
    tooltip.style.display = 'block';
    
    return tooltip;
}