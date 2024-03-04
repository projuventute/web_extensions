
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
        if (extSettings['clean-layout'] && url.includes('https://api.userlike.com/api/um/v3/conversations/') && !document.location.href.startsWith('https://www.userlike.com/de/umc/#/conversation/')) {
            console.log(url);
            let currentFilter = localStorage.getItem('selectedFilter');
            let originalUrl = url;
            url = updateURLWithFilter(originalUrl, currentFilter);
            console.log(url);
            // Assuming `input` is your original Request object
            originalUrl = new URL(url);


            // Create a new Request object with the modified URL and the same options
            let newRequest = new Request(originalUrl, input);
            input = newRequest;
            // input = input.replace(originalUrl, url);
            console.log('Updated URL:', input.url);
        }
        // Intercept GET requests
        // Log request headers if needed
        if (input.headers) {
            var headers = {};
            input.headers.forEach(function (value, key) {
                headers[key] = value;
            });
        }

        if (document.location.href.startsWith('https://www.userlike.com/de/umc/#/conversations') && extSettings['clean-layout'] && url.includes('https://api.userlike.com/api/um/custom_fields')) {
            console.log(url);
            cleanLayout();
        }
        // Make the actual fetch request
        if (((url.includes('cursor=') || url.endsWith('/messages/?limit=100')) && extSettings['conversation-reader']) || (extSettings['conversation-preview'] && url.includes('https://api.userlike.com/api/um/v3/conversations/'))) {



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
                        // Show a button if already created
                        document.querySelector('#uncleaner').style.display = 'block';
                    }
                    if (!document.location.href.startsWith('https://www.userlike.com/de/umc/#/inbox/') && !document.location.href.startsWith('https://www.userlike.com/de/umc/#/conversation/')) {
                        // Hide the button on other pages
                        const uncleanerElement = document.querySelector('#uncleaner');
                        if (uncleanerElement) {
                            uncleanerElement.style.display = 'none';
                        }
                    }
                    if (window.location.href.startsWith('https://www.userlike.com/de/umc/#/conversations')) {

                        conversations = JSON.parse(body);
                        conversations = conversations.results;
                        checkElementsExistence("td", 20, 30000, addSvgToTable);

                    }
                    if (extSettings['beraitung-url'] && document.location.href.startsWith('https://www.userlike.com/de/umc/#/conversation/')) {
                        setTimeout(function () {
                            conversationObj = JSON.parse(body);
                            conversationObj = conversationObj.results;
                            if (!aiButtonCreated) {
                                renderAIButton();
                            }
                        }, 2000);
                    }
                    // Add logging for response body if necessary
                    if (window.location.href.endsWith('#reader') && url.includes('/messages/?limit=')) {

                    }
                });
                if (extSettings['hide-admins']) {
                    checkElementsExistence("td", 50, 30000, cleanAdmins);
                }

                setTimeout(function () {
                    if (extSettings['hide-admins']) {
                        var menuButtons = document.querySelectorAll('button');

                        menuButtons.forEach(function (button) {
                            button.addEventListener('click', function (event) {
                                console.log('Menu item clicked:', event.target);

                                // Give some time for the menu to be created in the DOM
                                setTimeout(hideElements, 100); // Adjust the delay as needed
                            });
                        });
                    }
                    if (extSettings['not-delivered']) {
                        // Select all path elements within the SVG
                        const pathElements = document.querySelectorAll('svg > path');

                        pathElements.forEach(function (path) {
                            const dAttributeValue = path.getAttribute('d');
                            const parent = path.parentElement; // Get the parent of the path element

                            // Check the 'd' attribute value and apply styles based on its content
                            if (dAttributeValue.includes('M12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12Z')) {
                                // Apply styles to the parent when the condition is met
                                parent.style.animation = 'blink 1s infinite'; // Define a blinking animation for the parent
                                parent.style.color = 'red';
                                // Add more styles to the parent as needed
                            }
                        });
                    }

                }, 500);


                return originalFetch(input, init);
            });
        } else {
            if ((url.includes('cursor=') || url.endsWith('/messages/?limit=25')) && extSettings['conversation-reader']) {
                makeReadable();
                // Show a button if already created
                document.querySelector('#uncleaner').style.display = 'block';
            }
            if (!document.location.href.startsWith('https://www.userlike.com/de/umc/#/inbox/') && !document.location.href.startsWith('https://www.userlike.com/de/umc/#/conversation/')) {
                // Hide the button on other pages
                const uncleanerElement = document.querySelector('#uncleaner');
                if (uncleanerElement) {
                    uncleanerElement.style.display = 'none';
                }
            }
            return originalFetch(input, init);
        }

        // Return the original response without modification

    };
})(window);

(function (global) {
    // Store the original WebSocket constructor
    var OriginalWebSocket = global.WebSocket;
  
    // Define a custom WebSocket constructor
    function CustomWebSocket(url, protocols = []) {
      // Create a new WebSocket instance using the original constructor
      var ws = new OriginalWebSocket(url, protocols);
  
      // Add custom logic here
      ws.addEventListener('message', function (event) {
        data = JSON.parse(event.data);
        if(extSettings['conversation-reader'] && (data.info=='chat_message' ||data.info=='chat_message_read') && isClean){
            makeReadable();
        }
        // Perform custom logic when receiving a message
        //console.log('Custom logic for incoming message:', event.data);
  
        // You can also dispatch the message event to the original event listener
        // if needed
        // ws.dispatchEvent(event);
      });
  
      // Return the custom WebSocket instance
      return ws;
    }
  
    // Replace the global WebSocket constructor with the custom constructor
    global.WebSocket = CustomWebSocket;
  
  })(window); // You can replace "window" with any global context
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

function hideElements() {
    const menuDivs = document.querySelectorAll('div[role="menu"]');
    menuDivs.forEach((menuDiv) => {
        
        // Add scroll event listener to each menu
        menuDiv.addEventListener('scroll', function () {
            // Logic to hide elements on scroll inside the menu
            hideSpecificDivs(menuDiv);
        });

        // Also hide the elements initially
        hideSpecificDivs(menuDiv);
    });
}

function hideSpecificDivs(menuDiv) {
    const divsWithDataIndex = menuDiv.querySelectorAll('div[data-index="1"], div[data-index="2"], div[data-index="3"], div[data-index="4"]');
    divsWithDataIndex.forEach((div) => {
        div.style.display = 'none';
    });
}
function cleanAdmins(){
    var menuButtons = document.querySelectorAll('button');

    menuButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            console.log('Menu item clicked:', event.target);

            // Give some time for the menu to be created in the DOM
            setTimeout(hideElements, 100); // Adjust the delay as needed
        });
    });
}


