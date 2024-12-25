/**
 * content.js is used to dynamically inject certain things on the webpage
 */

const aiHelpImgURL = chrome.runtime.getURL("assets/AZLogo.webp");

window.addEventListener("load", addAIHelpButton);

function addAIHelpButton() {
    // Create a button element
    const aiHelpButton = document.createElement('button');
    aiHelpButton.id = "ai-help-button";
    aiHelpButton.type = "button"; // Set button type
    aiHelpButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_light_button__ZDAR_ coding_ask_doubt_button__FjwXJ gap-1 py-2 px-3 overflow-hidden"; // Add classes for styling
    aiHelpButton.style.display = "flex"; // Use flexbox for alignment
    aiHelpButton.style.alignItems = "center"; // Center items vertically
    aiHelpButton.style.height = "34px"; // Match height to other buttons
    aiHelpButton.style.width = "auto"; 

    // Create an image element for the icon
    const aiImage = document.createElement('img');
    aiImage.src = aiHelpImgURL;
    aiImage.alt = "Assistant Icon";
    aiImage.style.width = "18px"; // Set width of the image
    aiImage.style.height = "18px"; // Set height of the image
    aiImage.className = "me-1"; // Add margin class if using Bootstrap or similar

    // Create a span for the text
    const textSpan = document.createElement('span');
    textSpan.className = "coding_ask_doubt_gradient_text__FX_hZ"; // Add class for text styling
    textSpan.innerHTML = "<strong>Assistant</strong>"; // Set button text

    // Append the image and text to the button
    aiHelpButton.appendChild(aiImage);
    aiHelpButton.appendChild(textSpan);

    // Find the empty div that you want to replace
    const emptyBorder = document.getElementsByClassName("coding_border_color__v_1bB")[0];
    
    if (emptyBorder) {
        // Replace the empty div with the button
        emptyBorder.parentNode.replaceChild(aiHelpButton, emptyBorder);
    }
}


