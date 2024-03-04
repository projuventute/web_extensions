function cleanLayout() {
    // Step 1: Select the button
    const button = document.querySelector('button[data-test-id="sidebar-btn"]');

    if (button) {
        // Step 2: Access its parent element
        const parentDiv = button.parentElement;

        // Step 3: Find the next sibling div
        let nextSiblingDiv = parentDiv.nextElementSibling;
        while (nextSiblingDiv && nextSiblingDiv.tagName !== 'DIV') {
            nextSiblingDiv = nextSiblingDiv.nextElementSibling;
        }

        // Step 4: Create a new div with class 'ext_filters'
        const newDiv = document.createElement('div');
        newDiv.className = 'ext_filters';

        // Step 5: Create two buttons and append them to the new div
        const showAllButton = document.createElement('button');
        showAllButton.textContent = extSettings['ll_show_all'];
        showAllButton.className = 'show-all';
        showAllButton.addEventListener('click', () => {
            localStorage.setItem('selectedFilter', 'showAll');
            console.log('Filter set to show all');
            // Select the first table in the document
            let firstTable = document.querySelector('table');

            // Find the first button within this table
            let firstButton = firstTable.querySelector('button');

            // Check if the button exists and then trigger a click
            if (firstButton) {
                firstButton.click();
            } else {
                console.log('No button found in the first table');
            }
        });
        newDiv.appendChild(showAllButton);

        const showUnansweredButton = document.createElement('button');
        showUnansweredButton.textContent = extSettings['ll_show_unanswered'];
        showUnansweredButton.className = 'show-unanswered';
        showUnansweredButton.addEventListener('click', () => {
            localStorage.setItem('selectedFilter', 'showUnanswered');
            // Select the first table in the document
            let firstTable = document.querySelector('table');

            // Find the first button within this table
            let firstButton = firstTable.querySelector('button');

            // Check if the button exists and then trigger a click
            if (firstButton) {
                firstButton.click();
            } else {
            }
        });
        newDiv.appendChild(showUnansweredButton);

        // Step 6: Replace the parent of the original button and the next sibling div
        if (nextSiblingDiv) {
            parentDiv.parentNode.insertBefore(newDiv, nextSiblingDiv);
            parentDiv.parentNode.removeChild(nextSiblingDiv);
        }
        parentDiv.parentNode.replaceChild(newDiv, parentDiv);
    }

    // Get all h4 elements
    const h4Elements = document.querySelectorAll('h4');

    for (let h4 of h4Elements) {
        // Check if the text includes 'Filt' (case-insensitive)
        if (h4.textContent.toLowerCase().includes('filt')) {
            // Found the h4, now find the 8th parent div
            let parentDiv = h4;
            for (let i = 0; i < 8; i++) {
                if (parentDiv) {
                    parentDiv = parentDiv.parentElement;
                    // Check if the parent is a div
                    if (parentDiv && parentDiv.tagName === 'DIV') {
                        // If it's the 8th div, hide it and break the loop
                        if (i === 7) {
                            parentDiv.style.display = 'none';
                            break;
                        }
                    }
                } else {
                    // No more parent elements, break the loop
                    break;
                }
            }
            // Stop after finding and processing the first matching h4
            break;
        }
    }
    document.querySelector('nav').style.display = 'none';

}
function updateURLWithFilter(originalUrl, filter) {
    let url = new URL(originalUrl);
    let searchParams = url.searchParams;

    // Remove any existing 'status' parameters
    searchParams.delete('status');
    searchParams.delete('ordering');
    searchParams.append('ordering', '-contact_last_message_sent_at');
    searchParams.delete('limit');
    searchParams.append('limit', '50');
    // Add 'status' parameters based on the filter
    if (filter === 'showUnanswered') {
        searchParams.append('status', 'new');
        searchParams.append('status', 'open');
        searchParams.append('status', 'pending');
    } else if (filter === 'showAll') {
        searchParams.append('status', 'new');
        searchParams.append('status', 'open');
        searchParams.append('status', 'pending');
        searchParams.append('status', 'ended');
    }

    // Construct and return the updated URL
    return url.toString();
}


