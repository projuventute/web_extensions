/**
 * @brief Modify the URL for media blocking based on its file type.
 * 
 * This function checks the file extension of a URL and, if it matches certain
 * media file types (e.g., jpg, mp4, bin), it replaces the URL with a modified
 * URL for media blocking.
 * 
 * @param {string} url - The original URL of the media file.
 * @returns {string} - The modified URL for media blocking, or the original URL if not blocked.
 */
function mediaBlock(url) {
    // Get the base URL of the Chrome extension
    const extensionBase = extSettings['extensionBase'];

    // Check the file extension and modify the URL accordingly
    if (url.endsWith('jpg') || url.endsWith('.jpeg') || url.endsWith('.png')) {
        url = extensionBase + "res/img.json";
    }
    if (url.endsWith('mp4') || url.endsWith('.3gp')) {
        url = extensionBase + "res/video.json";
    }
    if (url.endsWith('.ogg') || url.endsWith('.mp3') || url.endsWith('.aac') || url.endsWith('bin')) {
        url = extensionBase + "res/audio.json";
    }
    // Return the modified or original URL
    return url;
}
