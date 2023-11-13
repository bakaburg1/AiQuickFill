function setupSlider(value, sel = '.slider_w_handle') {
    
    const slider = $(sel); // Get the slider element
    var sliderWidth = slider.width(); // Get the width of the slider

    const input = slider.find('input'); // Get the underlying input element

    const handle = slider.find('.handle'); // Get the handle element
    var handlePosCorrection = handle.width()/2; // Needed to compute the handle center position

    var isDragging = false; // Store the state of the slider
    var lastMouseX; //Store the last mouse X position

    var startValue = value || input.val(); // Store the starting value of the input element
    input.attr("value", startValue)

    handle.text(startValue); // Set the handle text to the value of the input element
    handle.css('left', valueToPosition(startValue) + 'px'); // Set the handle position based on the input value
    handle.css('border-color', interpolateColor('#0d6efd', '#ff0000', startValue)); // Set the handle color based on the input value
    
    function positionToValue(position) {
        // Get the min and max values of the input element
        var min = parseFloat(input.attr('min'));
        var max = parseFloat(input.attr('max'));

        // Calculate the value based on the position of the handle
        var relativePosition = (position / sliderWidth)
        var delta = max - min;
        var value = relativePosition * delta + min;
        // round the value to 1 decimal places
        value = value.toFixed(1);
        return value;
    }

    function valueToPosition(value) {
        // Get the min and max values of the input element
        var min = parseFloat(input.attr('min'));
        var max = parseFloat(input.attr('max'));

        // Calculate the position based on the value of the input element
        var delta = max - min;
        var relativePosition = (value - min) / delta;
        var position = relativePosition * sliderWidth;
        return position;
    }

    function interpolateColor(color1, color2, value) {
        const min = parseFloat(input.attr('min'));
        const max = parseFloat(input.attr('max'));
        const factor = (value - min) / (max - min);
        const col1comp = color1.slice(1).match(/.{2}/g); // extract color components from color1
        const col2comp = color2.slice(1).match(/.{2}/g); // extract color components from color2

        const result = col1comp.map(function (ch, i) { // for each color component
            const dec1 = parseInt(ch, 16); // Convert hex to decimal
            const dec2 = parseInt(col2comp[i], 16);

            // interpolate between the two color components
            return Math.floor(dec1 + factor * (dec2 - dec1)).toString(16).padStart(2, '0'); 
        }).join('');
        
        return '#' + result;
    }
    
    // Handle mousedown event on the slider handle. 
    // Sets isDragging to true to track that the slider handle is being dragged.
    handle.on('mousedown.slider_w_handle', function(event) {
        isDragging = true;
        lastMouseX = event.clientX; // Store the initial mouse X position

        // for some reasons these two need to be recomputed, otherwise are wrong
        sliderWidth = slider.width(); // Get the width of the slider
        handlePosCorrection = handle.width()/2; // Needed to compute the handle center position
    });
    
    // Handle mousemove event on the document.
    // Sets the position of the handle based on the mouse position.
    $(document).on('mousemove.slider_w_handle', function(event) {
        if (isDragging) {
            console.log("dragging");
            //var rect = slider[0].getBoundingClientRect(); // Get the slider's bounding rectangle
            var dx = event.clientX - lastMouseX; // Calculate the X movement
            var currPos = parseFloat(handle.css('left')) + handlePosCorrection; // Get the current handle position
            currPos += dx; // Add the X movement
            currPos = Math.min(Math.max(0, currPos), sliderWidth); // Constrain x to the slider width
            handle.css('left', (currPos - handlePosCorrection) + 'px'); // Set the handle position
            lastMouseX = event.clientX // Update the last mouse X position
            var val = positionToValue(currPos); // Get the value based on the handle position

            handle.text(val); // Set the handle text
            input.val(val); // Set the input value
           
            var color = interpolateColor('#0d6efd', '#ff0000', val);
        
            // Set the border color of the handle
            handle.css('border-color', color);
        }
    });
    
    $(document).on('mouseup.slider_w_handle', function() {
        isDragging = false;
        input.trigger('change'); // Trigger the input change event to update the model
    });
    
    input.on('input', function() {
        var value = (input.val() - modelTemp.attr('min')) / (input.attr('max') - input.attr('min'));
        handle.css('left', (value * 100) + '%');
    });
};