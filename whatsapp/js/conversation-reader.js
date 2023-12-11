function makeReadable() {
    const existingButton = document.body.querySelector("#uncleaner");

    if (!existingButton) {
        createToggleButton();
        // Find the path element with the specified attribute
        const pathElement = document.querySelector('path[d="M5.264 2C2.878 2 1.496 4.703 2.893 6.637L6.766 12l-3.873 5.363C1.496 19.297 2.878 22 5.263 22c.651 0 1.291-.163 1.862-.475l13.44-7.33c1.737-.948 1.737-3.442 0-4.39l-13.44-7.33A3.887 3.887 0 0 0 5.264 2Zm-.75 3.466A.925.925 0 0 1 5.264 4c.315 0 .626.08.903.23L18.578 11H8.511L4.514 5.466ZM8.511 13l-3.997 5.534A.925.925 0 0 0 5.264 20c.315 0 .626-.08.903-.23L18.578 13H8.511Z"]');

        if (pathElement) {
            // Find the nearest ancestor button element
            const ancestorButton = pathElement.closest('button');

            if (ancestorButton) {
                // Add an event listener to the ancestorButton
                ancestorButton.addEventListener('click', () => {
                    console.log("TOGGLED");
                    // Assuming isClean is a boolean variable
                    if (isClean) {
                        setTimeout(function(){ location.reload(); },500);
                    }
                });
            } else {
                console.log('No ancestor button found.');
            }
        } else {
            console.log('Path element not found.');
        }


    }
    checkElementsExistence('svg > circle', 20, 30000, cleanReader, true);
}
let isClean = false; // Variable to track the state

function cleanReader() {
    const userMessages = findDivsWithComputedStyle('background-color', 'rgb(221, 226, 235)');
    const notesMessages = findDivsWithComputedStyle('background-color', 'rgb(255, 231, 169)', 'article');
    const ourMessages = findDivsWithComputedStyle('background-color', 'rgb(15, 139, 255)');
    const allMessages = Array.from(findCommonAncestor(userMessages[0], ourMessages[0]).children);
    const dayMessages = findDivsWithComputedStyle('background-color', 'rgb(224, 226, 228)', 'div', window.getComputedStyle(allMessages[0]).getPropertyValue('width'));
    const cleanMessages = userMessages.concat(dayMessages, notesMessages, ourMessages);
    if (cleanMessages.length > 0) {
        userMessages.forEach(message => {
            message.classList.add("extMessage");
            message.classList.add("userMessage");
        });
        notesMessages.forEach(message => {
            message.classList.add("extMessage");
        })
        dayMessages.forEach(message => {
            message.classList.add("extMessage");
            message.classList.add("dayMessage");
        });;
        ourMessages.forEach(message => {
            message.classList.add("extMessage");
            message.classList.add("ourMessage");
        });
        allMessages.forEach(message => {
            if (!hasClass(message, "extMessage")) {
                message.classList.add("uncleanMessage");
                message.classList.remove("cleanMessage");
            } else {
                message.classList.add("cleanMessage");
                message.classList.remove("uncleanMessage");
            }

        });
    }
    toggleClean(false);
}


/**
 * Generates a list of all div elements within the body of the document
 * that have a certain computed style.
 *
 * @param {string} styleProperty - The CSS property name to check for.
 * @param {string} styleValue - The CSS property value to match.
 * @returns {Array<HTMLElement>} - An array of matching div elements.
 */
function findDivsWithComputedStyle(styleProperty, styleValue, tagName = 'div', width = 0) {
    // Get all div elements within the body of the document.
    const divElements = document.querySelectorAll('body ' + tagName);

    // Create an array to store matching div elements.
    const matchingDivs = [];

    // Iterate through the div elements.
    divElements.forEach((div) => {
        // Get the computed style of the current div element.
        const computedStyle = window.getComputedStyle(div);
        // Check if the specified style property matches the desired value.
        if (computedStyle.getPropertyValue(styleProperty) === styleValue && (width == 0 || computedStyle.getPropertyValue("width") < width)) {
            // Add the div element to the matchingDivs array.
            matchingDivs.push(div);
        }
    });

    return matchingDivs;
}
var cleanButton;
// Function to create a toggle button and append it to the specified element if it doesn't already exist
function createToggleButton() {
    // Find the path element with the specific "d" attribute
    const path = document.querySelector('path[d^="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2.062 1a8.008 8.008 0 0 1-5.216 6.525c.058-.108.116-.22.174-.337.717-1.443 1.42-3.505 1.573-6.188h3.47Zm0-2a8.009 8.009 0 0 0-5.162-6.505c.038.07.076.144.114.218.737 1.44 1.456 3.524 1.588 6.287h3.46Zm-5.462 0c-.13-2.41-.757-4.185-1.366-5.376A9.172 9.172 0 0 0 12.06 4h-.104a9.996 9.996 0 0 0-1.06 1.701c-.6 1.206-1.212 2.967-1.362 5.299h4.942Zm-4.952 2c.13 2.41.757 4.185 1.366 5.376A9.171 9.171 0 0 0 11.94 20h.104a9.997 9.997 0 0 0 1.06-1.701c.6-1.206 1.212-2.967 1.362-5.299H9.524Zm-2.002 0c.132 2.763.85 4.846 1.588 6.287l.114.218A8.009 8.009 0 0 1 4.062 13h3.46Zm.009-2c.153-2.683.856-4.745 1.573-6.188.058-.117.116-.229.174-.337A8.009 8.009 0 0 0 4.062 11H7.53Z"]');
    if (!path) {
        return;
    }
    // Traverse up to find the parent SVG and then the parent button
    const parentSvg = path.closest('svg');
    if (!parentSvg) {
        return;
    }
    const parentButton = parentSvg.closest('button');
    if (!parentButton) {
        return;
    }

    // Create a new button element
    cleanButton = document.createElement("button");
    cleanButton.addEventListener("click", () => {
        toggleClean();
    });
    cleanButton.id = "uncleaner";
    cleanButton.innerHTML = '<svg width="2em" height="2em" viewBox="0 0 256 256" fill="none"><g xmlns="http://www.w3.org/2000/svg"><g><path fill="#000000" d="M168.5,250.6c-0.9,0-0.9,0-1.8,0c-3.6-0.9-8.1-0.9-11.7-1.8s-7.2-0.9-11.7-1.8c-2.7-0.9-6.3-0.9-9-1.8l-10.8-2.7l4.5-6.3c4.5-7.2,9.9-13.5,13.5-19.8c0.9-0.9,1.8-1.8,2.7-3.6c-2.7,1.8-6.3,4.5-9.9,7.2c-14.4,10.8-34.2,12.6-50.4,4.5l-13.5-6.3c-1.8-0.9-3.6-2.7-4.5-5.4c-0.9-2.7,0-4.5,1.8-7.2c3.6-3.6,6.3-7.2,8.1-9.9c-2.7,0.9-4.5,1.8-7.2,2.7c-12.6,4.5-26.1,1.8-36-6.3c-9.9-8.1-15.3-12.6-16.2-13.5l-6.3-6.3l9.9-1.8c0.9,0,78.4-19.8,123.4-73.9l2.7-2.7l87.4,38.7l-1.8,4.5c-4.5,13.5-21.6,61.2-54,109C175.7,247,173.9,250.6,168.5,250.6z M140.6,235.3c1.8,0,3.6,0.9,5.4,0.9c3.6,0.9,7.2,0.9,10.8,1.8c3.6,0.9,8.1,0.9,11.7,1.8c29.7-43.2,45.9-86.5,52.2-102.7l-72-32.4c-38.7,44.1-95.4,65.7-118,73c2.7,1.8,5.4,4.5,9,7.2c7.2,6.3,17.1,8.1,26.1,4.5c9.9-3.6,18-7.2,20.7-9.9l10.8-9.9l-2.7,14.4c-0.9,7.2-11.7,19.8-18,27l10.8,5.4c13.5,6.3,28.8,4.5,40.5-3.6c11.7-9,20.7-15.3,25.2-18.9c0.9-0.9,2.7-2.7,4.5-3.6l13.5-12.6l-3.6,15.3c-1.8,6.3-8.1,15.3-18.9,29.7C146.9,226.3,143.3,230.8,140.6,235.3z"/><path fill="#000000" d="M230.7,138l-87.4-38.7l1.8-4.5c2.7-6.3,6.3-10.8,12.6-13.5c9-5.4,18.9-6.3,27.9-1.8c10.8,4.5,20.7,9,31.5,14.4c14.4,6.3,21.6,21.6,17.1,36.9c0,0.9-0.9,1.8-0.9,2.7L230.7,138z M155.9,94.8l68.4,30.6c1.8-9.9-2.7-18.9-11.7-22.5c-9.9-4.5-20.7-9-31.5-13.5c-6.3-2.7-13.5-2.7-19.8,0.9C159.5,90.3,157.7,92.1,155.9,94.8z"/><path fill="#000000" d="M218.9,92.1l-4.5-1.8l-25.2-11.7l-3.6-3.6l2.7-5.4l30.6-57.6c2.7-5.4,6.3-7.2,12.6-6.3c4.5,0.9,9,2.7,11.7,6.3c2.7,2.7,3.6,7.2,1.8,10.8l-24.3,64.8L218.9,92.1z M197.3,72.3l16.2,7.2L235.2,20c0-0.9,0-0.9,0-0.9c-0.9-1.8-2.7-2.7-5.4-2.7c-0.9,0-1.8,0-1.8,0s0,0-0.9,0.9L197.3,72.3z"/><path fill="#000000" d="M216.2,85.8"/></g></g></svg>';
    // Replace the old button with the new button
    parentButton.replaceWith(cleanButton);
}

function toggleClean(toggle = true) {
    if (toggle) {
        isClean = !isClean;
    }
    if (isClean) {
        document.querySelectorAll('.uncleanMessage').forEach(element => {
            element.style.display = 'none';
        });
        document.querySelectorAll('.cleanMessage').forEach(element => {
            element.style.display = 'flex';
        });
    } else {
        document.querySelectorAll('.uncleanMessage').forEach(element => {
            element.style.display = 'flex';
        });
        document.querySelectorAll('.cleanMessage').forEach(element => {
            element.style.display = 'flex';
        });
    }
    // Toggle the state variable

    // Update the button text based on the state
    cleanButton.innerHTML = isClean ? cleanButton.innerHTML.replaceAll("#000000", "#718096") : cleanButton.innerHTML.replaceAll("#718096", "#000000");
}
/**
 * Recursive function to search for an element with a specific class within the DOM.
 *
 * @param {HTMLElement} element - The element to start the search from.
 * @param {string} className - The name of the class to search for (e.g., 'extMessage').
 * @return {boolean} - True if an element with the specified class is found, false otherwise.
 */
function hasClass(element, className) {
    // Base case: If the current element has the specified class, return true.
    if (element.classList.contains(className)) {
        return true;
    }

    // Recursive case: Check the child elements of the current element.
    for (let i = 0; i < element.children.length; i++) {
        if (hasClass(element.children[i], className)) {
            return true; // If the class is found in a child, return true.
        }
    }

    // If the specified class is not found in this element or its children, return false.
    return false;
}
function findCommonAncestor(element1, element2) {
    const ancestors1 = [];
    let currentElement = element1;

    // Collect all ancestors of element1
    while (currentElement) {
        ancestors1.push(currentElement);
        currentElement = currentElement.parentElement;
    }

    currentElement = element2;

    // Traverse upwards from element2 until a common ancestor is found
    while (currentElement) {
        if (ancestors1.includes(currentElement)) {
            // Common ancestor found
            return currentElement;
        }
        currentElement = currentElement.parentElement;
    }

    // If no common ancestor is found, return null or handle it as needed.
    return null;
}