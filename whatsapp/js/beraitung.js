function renderAIButton() {
    if (extSettings['beraitung-url']) {
        // Ensure the array is not empty
        if (conversationObj && conversationObj.length > 0) {
            // Sort the array by 'sent_at' in descending order
            conversationObj.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));

            // The first element now has the most recent 'sent_at'
            last_message_sent_at = conversationObj[0].sent_at;

        } else {
        }
        // Find all button elements
        const buttons = document.querySelectorAll('button');

        // Find the <path> element with the specific attribute
        const path = document.querySelector('path[d="M1 8a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM1 12a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM1 16a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H2a1 1 0 0 1-1-1ZM18.558 15.442a.625.625 0 0 1 0-.884L21.116 12l-2.558-2.558a.625.625 0 1 1 .884-.884l3 3a.625.625 0 0 1 0 .884l-3 3a.625.625 0 0 1-.884 0Z"]');

        let buttonAfterNextButton = null;
        let foundPathButton = false;
        let foundNextButton = false;

        // Iterate through buttons to find the one after the next button
        for (const button of buttons) {
            if (foundNextButton) {
                buttonAfterNextButton = button;
                break;
            }
            if (foundPathButton) {
                foundNextButton = true;
            }
            if (button.contains(path)) {
                foundPathButton = true;
            }
        }

        if (buttonAfterNextButton) {
            // Do something with the button after next button
            let buttonToReplace = buttonAfterNextButton;

            // Create a new button
            let newButton = document.createElement('button');
            newButton.textContent = 'BerAItung';
            newButton.classList.add("ai-button"); // Add the class "ai-button" to the new button
            // Add click event listener to the new button
            newButton.addEventListener('click', function () {
                // Prepare the JSON body
                let postData = {
                    "info": {
                        // ... other properties ...
                        "locale": navigator.language, // Current browser locale
                        "conversation": {
                            "id": extractIdFromUrl(),
                            "last_message_sent_at": last_message_sent_at
                        },
                    }
                };

                // Prepare the URL with query parameters
                let baseUrl = extSettings['beraitung-url'];
                let signature = extSettings['beraitung-sig']
                let queryParams = `api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=${signature}`;
                let requestUrl = `${baseUrl}?${queryParams}`;

                // Send POST request
                fetch(requestUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                })
                    .then(response => response.json())
                    .then(data => console.log('Success:', data))
                    .catch((error) => console.error('Error:', error));
            });

            // Replace the old button with the new button
            if (buttonToReplace && buttonToReplace.parentNode) {
                buttonToReplace.parentNode.replaceChild(newButton, buttonToReplace);
            }

        } else {
        }


    }
}

// Find the button to replace
var aiButtonCreated=false;
let last_message_sent_at="";
function extractIdFromUrl() {
    let hash = window.location.hash;

    if (hash && hash.length > 1) {
        // Remove the '#' character and split by '?' to get rid of the query string
        let segments = hash.substring(1).split('?')[0].split('/');
        // Return the last segment
        return segments[segments.length - 1];
    } else {
        // If no hash is present, return null or handle it as needed
        return null;
    }
}
