var extSettings = JSON.parse(document.getElementById("settings-container").innerHTML);
/**
 * @brief Intercept and override the fetch function to log requests and handle media blocking.
 * @param {object|string} input - The URL or Request object to fetch.
 * @param {object} init - (Optional) An options object for the fetch.
 * @returns {Promise} - A Promise that resolves to the Response to the fetch request.
 */
(function (global) {
    // Store the original fetch function
    var originalFetch = global.fetch;

    global.fetch = function (input, init) {
        // Capture the start time of the request
        var startTime = new Date().toISOString();

        // Log the request URL
        var url = input instanceof Request ? input.url : input;

        if (url.startsWith('https://www.userlike.com/api/um/media/download/') && extSettings['media-block']) {
            input = mediaBlock(url);
        }

        if (url.includes('/messages/?limit=25')) {
            input = input.replace('limit=25', 'limit=100');
        }
        // Intercept GET requests
        // Log request headers if needed
        if (input.headers) {
            var headers = {};
            input.headers.forEach(function (value, key) {
                headers[key] = value;
            });
        }

        // Make the actual fetch request
        return originalFetch(input, init).then(function (response) {
            // Log response headers
            var responseHeaders = {};
            response.headers.forEach(function (value, key) {
                responseHeaders[key] = value;
            });

            // Log the response body (you can add this if needed)
            response.text().then(function (body) {
                if ((url.includes('cursor=') || url.endsWith('/messages/?limit=25')) && extSettings['conversation-reader']) {
                    makeReadable();
                    // Show button if already created
                    document.querySelector('#uncleaner').style.display = 'block';

                } if (!document.location.href.startsWith('https://www.userlike.com/de/umc/#/inbox/') && !document.location.href.startsWith('https://www.userlike.com/de/umc/#/conversation/')) {
                    //Hide Button on other pages
                    document.querySelector('#uncleaner').style.display = 'none';
                }
                // Add logging for response body if necessary
            });

            // Return the original response
            return originalFetch(input, init);
        });

        // For non-GET requests, just pass them through
        return originalFetch(input, init);
    };
})(window);

/**
 * Check for the existence of elements matching a selector at regular intervals.
 * @param {string} selector - The CSS selector to match elements.
 * @param {number} interval - The interval in milliseconds between checks.
 * @param {number} timeout - The maximum duration in milliseconds to continue checking.
 * @param {function} callback - The callback function to execute when elements are found or when the timeout is reached.
 */
function checkElementsExistence(selector, interval, timeout, callback, reverseExistence = false) {
    let elapsedTime = 0;

    const checkInterval = setInterval(() => {
        const elements = document.querySelectorAll(selector);

        if (elements.length > 0 && !reverseExistence) {
            clearInterval(checkInterval); // Stop the interval when elements are found
            callback(elements); // Call the callback function with the found elements
        }
        if (elements.length == 0 && reverseExistence) {
            clearInterval(checkInterval); // Stop the interval when elements are found
            callback(elements); // Call the callback function with the found elements
        }
        elapsedTime += interval;

        if (elapsedTime >= timeout) {
            clearInterval(checkInterval); // Stop the interval when the timeout is reached
            callback([]); // Call the callback function with an empty array to indicate timeout
        }
    }, interval);
}