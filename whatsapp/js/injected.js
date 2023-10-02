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
                // Add logging for response body if necessary
            });

            // Return the original response
            return originalFetch(input, init);
        });

        // For non-GET requests, just pass them through
        return originalFetch(input, init);
    };
})(window);