const azLogo = chrome.runtime.getURL("assets/AZLogo.webp");

const observer = new MutationObserver(() => {
    addAIHelpButton();
});

observer.observe(document.body, { childList: true, subtree: true });

addAIHelpButton();

//* Responsible for creating and adding a help button
function addAIHelpButton() {
    if (document.getElementById("ai-help-button")) {
        return;
    }
    const aiHelpButton = document.createElement('button');
    aiHelpButton.id = "ai-help-button";
    aiHelpButton.type = "button";
    aiHelpButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_light_button__ZDAR_ coding_ask_doubt_button__FjwXJ gap-1 py-2 px-3";
    aiHelpButton.style.display = "flex";
    aiHelpButton.style.alignItems = "center";
    aiHelpButton.style.height = "34px";
    aiHelpButton.style.width = "auto";

    aiHelpButton.addEventListener('click', () => {
        aiHelpButton.style.animation = "buttonClickEffect 0.5s ease-in-out 0.2s 3 alternate";
        setTimeout(() => {
            aiHelpButton.style.animation = ""; 
        }, 300); 
    });
    
    //Adding image to the buttom
    const aiImage = document.createElement('img');
    aiImage.src = azLogo;
    aiImage.alt = "Assistant Icon";
    aiImage.style.width = "18px";
    aiImage.style.height = "18px";
    aiImage.className = "me-1";

    //Adding text "Assistant" to the button
    const textSpan = document.createElement('span');
    textSpan.className = "coding_ask_doubt_gradient_text__FX_hZ";
    textSpan.innerHTML = "<strong>Assistant</strong>";

    aiHelpButton.appendChild(aiImage);
    aiHelpButton.appendChild(textSpan);

    //replaces the empty place with the new button
    const emptyBorder = document.getElementsByClassName("coding_border_color__v_1bB")[0];
    if (emptyBorder) {
        emptyBorder.parentNode.replaceChild(aiHelpButton, emptyBorder);
    }

    //attaches a click event to the button
    aiHelpButton.addEventListener("click", askNewDoubtHandler);
}

function createDialog(codeText) {

    let scrollSyncEnabled = true;
    
    //* line numbers which will be displayed in the code section
    function updateLineNumbers() {
        const lineCount = (codeText.match(/\n/g) || '').length + 1;
        lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => 
            `<div style="height: 19.5px">${i + 1}</div>`
        ).join('');
    }

    function syncScroll(primary, secondary) {
        if (!scrollSyncEnabled) return;
        scrollSyncEnabled = false;
        secondary.scrollTop = primary.scrollTop;
        setTimeout(() => scrollSyncEnabled = true, 50);
    }

    const overlay = document.createElement('div');
    overlay.id = 'ai-help-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(12px);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 24px;
    `;

    const dialog = document.createElement('div');
    dialog.id = 'ai-help-dialog';
    dialog.style.cssText = `
        width: 90vw;
        max-width: 1200px;
        height: 85vh;
        max-height: 800px;
        gap: 24px;
        padding: 24px;
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.15);
        display: flex;
        flex-direction: column;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 20px;
        margin-bottom: 20px;
        border-bottom: 2px solid #e2e8f0;
        background: #ffffff;
        width: 100%;
    `;

    const title = document.createElement('h2');
    title.style.cssText = `
        color: #1e293b;
        font-size: 24px;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.5px;
    `;
    title.textContent = 'AI Assistant';

    const closeButton = createButton('×', 'icon');
    closeButton.style.cssText += `
        font-size: 28px;
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: 300;
    `;

    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        display: flex;
        gap: 24px;
        flex: 1;
        overflow: hidden;
        height: calc(100% - 77px);
    `;

    // Code section (unchanged)
    const codeSection = document.createElement('div');
    codeSection.style.cssText = `
        flex: 0 0 45%;
        background: #1e293b;
        border-radius: 20px;
        border: 1px solid #334155;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.1);
    `;

    const codeHeader = document.createElement('div');
    codeHeader.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid #334155;
        display: flex;
        align-items: center;
        gap: 8px;
        background: #0f172a;
    `;

    const codeTitle = document.createElement('span');
    codeTitle.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg> Code';
    codeTitle.style.cssText = `
        color: #e2e8f0;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    const codeWrapper = document.createElement('div');
    codeWrapper.style.cssText = `
        display: flex;
        flex: 1;
        overflow: hidden;
        height: calc(100% - 53px);
        position: relative;
    `;

    const lineNumbers = document.createElement('div');
    lineNumbers.style.cssText = `
        padding: 16px 12px;
        background: #0f172a;
        border-right: 1px solid #334155;
        color: #64748b;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        line-height: 1.5;
        text-align: right;
        user-select: none;
        min-width: 45px;
        overflow-y: scroll;
        position: sticky;
        left: 0;
        scrollbar-width: none;
        -ms-overflow-style: none;
    `;

    const codeContent = document.createElement('div');
    codeContent.style.cssText = `
        flex: 1;
        padding: 16px 20px;
        overflow: auto;
        white-space: pre;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        line-height: 1.5;
        color: #e2e8f0;
        background: #1e293b;
    `;

    // Chat section (improved)
    const chatSection = document.createElement('div');
    chatSection.style.cssText = `
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #f8fafc;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
        overflow: hidden;
        height: 100%;
        box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.1);
        position: relative;
    `;

    const chatHeader = document.createElement('div');
    chatHeader.style.cssText = `
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        z-index: 2;
    `;

    const chatTitle = document.createElement('div');
    chatTitle.style.cssText = `
        color: #1e293b;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    // Create SVG element properly
    const chatIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chatIcon.setAttribute("width", "16");
    chatIcon.setAttribute("height", "16");
    chatIcon.setAttribute("viewBox", "0 0 24 24");
    chatIcon.setAttribute("fill", "none");
    chatIcon.setAttribute("stroke", "currentColor");
    chatIcon.setAttribute("stroke-width", "2");

    const chatIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    chatIconPath.setAttribute("d", "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z");
    chatIcon.appendChild(chatIconPath);

    const chatTitleText = document.createElement('span');
    chatTitleText.textContent = 'Chat';

    chatTitle.appendChild(chatIcon);
    chatTitle.appendChild(chatTitleText);

    const clearButton = createButton('Clear Chat', 'secondary');
    clearButton.style.cssText += `
        font-size: 13px;
        padding: 6px 12px;
        height: 32px;
    `;

    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'chat-messages';
    messagesContainer.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: calc(100% - 153px);
        background: #f8fafc;
    `;

    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 16px 20px;
        border-top: 1px solid #e2e8f0;
        background: #ffffff;
        display: flex;
        gap: 12px;
        align-items: flex-end;
        z-index: 2;
    `;

    const textarea = document.createElement('textarea');
    textarea.style.cssText = `
        flex: 1;
        min-height: 44px;
        max-height: 200px;
        padding: 12px 16px;
        border-radius: 12px;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        color: #1e293b;
        font-family: inherit;
        font-size: 14px;
        resize: none;
        transition: all 0.2s ease;
        line-height: 1.5;
        overflow-y: hidden;
        display: block;
        width: 100%;
        box-shadow: 0 1px 2px rgba(15, 23, 42, 0.1);
        outline: none;
    `;
    textarea.placeholder = 'Type your message... (Ctrl/Cmd + Enter to send)';

    // Create send button with proper SVG
    const sendButton = document.createElement('button');
    sendButton.style.cssText = `
        background: #4F46E5;
        color: white;
        border: none;
        border-radius: 12px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 44px;
        min-width: 100px;
    `;

    const sendIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sendIcon.setAttribute("width", "16");
    sendIcon.setAttribute("height", "16");
    sendIcon.setAttribute("viewBox", "0 0 24 24");
    sendIcon.setAttribute("fill", "none");
    sendIcon.setAttribute("stroke", "currentColor");
    sendIcon.setAttribute("stroke-width", "2");

    const sendIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    sendIconPath.setAttribute("d", "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z");
    sendIcon.appendChild(sendIconPath);

    const sendButtonText = document.createElement('span');
    sendButtonText.textContent = 'Send';

    sendButton.appendChild(sendIcon);
    sendButton.appendChild(sendButtonText);

    // Add hover effect to send button
    sendButton.onmouseover = () => {
        sendButton.style.background = '#4338CA';
    };
    sendButton.onmouseout = () => {
        sendButton.style.background = '#4F46E5';
    };

    // Auto-resize function for textarea
    function autoResizeTextarea() {
        textarea.style.height = '44px';
        const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 200);
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = newHeight >= 200 ? 'auto' : 'hidden';
        inputContainer.style.paddingBottom = newHeight > 44 ? '12px' : '16px';
    }

    // Event listeners
    textarea.addEventListener('input', autoResizeTextarea);
    textarea.addEventListener('focus', autoResizeTextarea);
    textarea.addEventListener('paste', () => setTimeout(autoResizeTextarea, 0));

    closeButton.onclick = () => overlay.remove();
    overlay.onclick = (e) => e.target === overlay && overlay.remove();

    clearButton.onclick = async () => {
        if (confirm('Clear all messages?')) {
            messagesContainer.innerHTML = '';
            if (typeof ChatManager !== 'undefined') {
                const chatManager = new ChatManager(extractProblemId(window.location.pathname));
                chatManager.clearHistory();
                const remainingMessages = chatManager.loadHistory();
                if (remainingMessages.length > 0) {
                    console.error('Failed to clear chat history');
                    alert('Error clearing chat history. Please try again.');
                    return;
                }
            }
        }
    };

    textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (textarea.value.trim()) {
                sendButton.click();
            }
        }
    });

    // Initialize code content and line numbers
    codeContent.textContent = codeText;
    updateLineNumbers();

    // Sync scroll between line numbers and code
    codeContent.addEventListener('scroll', () => syncScroll(codeContent, lineNumbers));
    lineNumbers.addEventListener('scroll', () => syncScroll(lineNumbers, codeContent));

    // Assembly
    header.appendChild(title);
    header.appendChild(closeButton);

    codeHeader.appendChild(codeTitle);
    
    codeWrapper.appendChild(lineNumbers);
    codeWrapper.appendChild(codeContent);
    
    codeSection.appendChild(codeHeader);
    codeSection.appendChild(codeWrapper);

    chatHeader.appendChild(chatTitle);
    chatHeader.appendChild(clearButton);

    inputContainer.appendChild(textarea);
    inputContainer.appendChild(sendButton);

    chatSection.appendChild(chatHeader);
    chatSection.appendChild(messagesContainer);
    chatSection.appendChild(inputContainer);

    contentContainer.appendChild(codeSection);
    contentContainer.appendChild(chatSection);

    dialog.appendChild(header);
    dialog.appendChild(contentContainer);
    overlay.appendChild(dialog);

    // Initial resize check
    setTimeout(autoResizeTextarea, 0);

    return {
        overlay,
        textarea,
        sendButton,
        messagesContainer,
        createMessageElement
    };
}

//* Creates a customizable button with specific styles and behaviors
function createButton(text, type = 'default') {
    const button = document.createElement('button');
    button.textContent = text;
    
    const baseStyles = `
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 44px;
    `;

    switch(type) {
        case 'primary':
            button.style.cssText = baseStyles + `
                background: ${COLORS["primary-button"]};
                color: white;
                border: none;
                min-width: 100px;
            `;
            button.onmouseover = () => button.style.background = COLORS["primary-button-hover"];
            button.onmouseout = () => button.style.background = COLORS["primary-button"];
            break;
        case 'secondary':
            button.style.cssText = baseStyles + `
                background: transparent;
                color: ${COLORS["secondary-text"]};
                border: 1px solid ${COLORS["border-medium"]};
            `;
            button.onmouseover = () => {
                button.style.background = COLORS["hover-bg"];
                button.style.borderColor = COLORS["border-dark"];
            };
            button.onmouseout = () => {
                button.style.background = 'transparent';
                button.style.borderColor = COLORS["border-medium"];
            };
            break;
        case 'icon':
            button.style.cssText = baseStyles + `
                background: transparent;
                color: ${COLORS["secondary-text"]};
                border: none;
                padding: 8px;
                height: auto;
                min-width: auto;
            `;
            button.onmouseover = () => {
                button.style.background = COLORS["hover-bg"];
                button.style.color = COLORS["primary-text"];
            };
            button.onmouseout = () => {
                button.style.background = 'transparent';
                button.style.color = COLORS["secondary-text"];
            };
            break;
    }
    
    return button;
}

//*Creates a chat message bubble with different styles for user and assistant messages
function createMessageElement({ role, content, timestamp }) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        padding: 16px;
        border-radius: 16px;
        max-width: 85%;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px ${COLORS["shadow-color"]};
        ${role === 'user' ?
            `margin-left: auto;
            background: ${COLORS["user-message-bg"]};
            color: ${COLORS["user-message-text"]};
            border-bottom-right-radius: 4px;` :
            `margin-right: auto;
            background: ${COLORS["ai-message-bg"]};
            color: ${COLORS["ai-message-text"]};
            border-bottom-left-radius: 4px;`
        }
    `;

    const contentDiv = document.createElement('div');
    contentDiv.style.cssText = `
        margin-bottom: 6px;
        line-height: 1.6;
        font-size: 14px;
        white-space: pre-wrap;
        word-wrap: break-word;
        letter-spacing: -0.1px;
    `;

    if (role === 'user') {
        // For user messages, preserve line breaks but escape HTML
        const escapedContent = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        contentDiv.textContent = escapedContent;
    } else {
        // For assistant messages, use the formatted response
        contentDiv.innerHTML = formatGroqResponse(content);
    }

    const timestampDiv = document.createElement('div');
    timestampDiv.style.cssText = `
        font-size: 11px;
        opacity: 0.8;
        font-weight: 500;
        ${role === 'user' ? 
            'color: rgba(255, 255, 255, 0.9);' : 
            `color: ${COLORS["secondary-text"]};`
        }
    `;
    timestampDiv.textContent = new Date(timestamp).toLocaleTimeString();

    // Add hover effect
    messageDiv.onmouseover = () => {
        messageDiv.style.transform = 'translateY(-1px)';
        messageDiv.style.boxShadow = '0 4px 6px ${COLORS["shadow-color"]}';
    };
    messageDiv.onmouseout = () => {
        messageDiv.style.transform = 'translateY(0)';
        messageDiv.style.boxShadow = '0 2px 4px ${COLORS["shadow-color"]}';
    };

    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestampDiv);

    return messageDiv;
}

async function askNewDoubtHandler(e) {
    e.preventDefault();
    try {
        const problemId = extractProblemId(window.location.pathname);
        if (!problemId) throw new Error("Could not find problem ID in the URL");

        const accessToken = getCookieValue('access_token');
        const groqApiKey = getCookieValue('groq_api_key');
        
        if (!accessToken || !groqApiKey) {
            throw new Error("Please ensure you're logged in and have Groq API access");
        }

        //: Making a fetch request to get a file named as 'problemId'. From which we can get problem description, hints, solution code etc.
        const problemApiUrl = `https://api2.maang.in/problems/user/${problemId}`;
        const problemResponse = await fetchWithAuth(problemApiUrl, accessToken);
        const problemData = await problemResponse.json();

        //: Extracting editor code
        const code = await getEditorContent(problemId, accessToken);
        const json_code = JSON.parse(code);

        const chatManager = new ChatManager(problemId);
        const dialogElements = createDialog(json_code);
        document.body.appendChild(dialogElements.overlay);

        //: Load chat history
        const existingMessages = chatManager.loadHistory();
        existingMessages.forEach(message => {
            const messageElement = dialogElements.createMessageElement({
                role: message.role,
                content: message.content, // Pass raw content, let createMessageElement handle formatting
                timestamp: message.timestamp
            });
            dialogElements.messagesContainer.appendChild(messageElement);
        });

        dialogElements.messagesContainer.scrollTop = dialogElements.messagesContainer.scrollHeight;

        dialogElements.sendButton.onclick = async () => {
            const message = dialogElements.textarea.value.trim();
            if (!message) return;

            try {
                dialogElements.sendButton.disabled = true;
                dialogElements.textarea.value = '';

                // Reset textarea height
                dialogElements.textarea.style.height = '44px';
                dialogElements.textarea.parentElement.style.paddingBottom = '16px';

                const userMessageElement = dialogElements.createMessageElement({
                    role: 'user',
                    content: message, // Pass raw message, let createMessageElement handle formatting
                    timestamp: new Date().toISOString()
                });
                dialogElements.messagesContainer.appendChild(userMessageElement);
                dialogElements.messagesContainer.scrollTop = dialogElements.messagesContainer.scrollHeight;

                chatManager.addMessage('user', message);

                // Get the current messages for context
                const currentMessages = chatManager.loadHistory();

                const prompt = chatManager.firstPromptSent
                    ? chatManager.prepareFollowUpPrompt(currentMessages, message)
                    : chatManager.prepareInitialPrompt(problemData.data, code);

                const loadingElement = dialogElements.createMessageElement({
                    role: 'assistant',
                    content: '<em>Analyzing code...</em>',
                    timestamp: new Date().toISOString()
                });
                dialogElements.messagesContainer.appendChild(loadingElement);
                
                const response = await sendToGroq(prompt, groqApiKey);
                
                dialogElements.messagesContainer.removeChild(loadingElement);
                
                const responseElement = dialogElements.createMessageElement({
                    role: 'assistant',
                    content: response,
                    timestamp: new Date().toISOString()
                });
                dialogElements.messagesContainer.appendChild(responseElement);
                dialogElements.messagesContainer.scrollTop = dialogElements.messagesContainer.scrollHeight;

                chatManager.addMessage('assistant', response);
                chatManager.firstPromptSent = true;

            } catch (error) {
                const errorElement = dialogElements.createMessageElement({
                    role: 'assistant',
                    content: `<span style="color: #ff6b6b">Error: ${error.message}</span>`,
                    timestamp: new Date().toISOString()
                });
                dialogElements.messagesContainer.appendChild(errorElement);
                dialogElements.messagesContainer.scrollTop = dialogElements.messagesContainer.scrollHeight;
            } finally {
                dialogElements.sendButton.disabled = false;
            }
        };
    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
}

//* Formats a response from the assistant, preserving HTML or escaping it as needed
function formatGroqResponse(content) {
    if (typeof content !== 'string') return '';
    
    // Check if content already contains HTML tags
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return content; // Return as-is if it contains HTML
    }
    
    // Otherwise, preserve line breaks while escaping HTML
    return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
}

//* Sends a request to the groq api model llama3-70b-8192 and receives the response 
async function sendToGroq(prompt, apiKey) {
    const groqApiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    
    try {
        // Log API key format (but not the full key) for debugging
        console.log('API key format check:', {
            length: apiKey.length,
            prefix: apiKey.substring(0, 4),
            isBearer: apiKey.startsWith('Bearer')
        });

        // Ensure the API key is properly formatted for the Authorization header
        const authToken = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
        
        const response = await fetch(groqApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a patient coding mentor who guides students to solutions through questions and hints rather than direct answers.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2048
            })
        });

        if (!response.ok) {

            const errorData = await response.text();

            // Add more detailed error information
            const errorInfo = {
                status: response.status,
                statusText: response.statusText,
                data: errorData,
                headers: Object.fromEntries(response.headers.entries())
            };
            console.error('Detailed API error:', errorInfo);
            
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key and try again.');
            }
            
            throw new Error(`Groq API error: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || 'No response from Groq';
    } catch (error) {
        console.error('Error calling Groq API:', error);
        
        // Provide more specific error messages
        if (error.message.includes('invalid or expired jwt')) {
            throw new Error('Invalid API key format or expired key. Please ensure you\'re using a valid Groq API key starting with "gsk_"');
        }
        
        throw error;
    }
}

//* A class that is initialized with a problemId it prepares initial and follow up prompts, saves chat in existing chat history, loads history chat.
class ChatManager {
    constructor(problemId) {
        this.problemId = problemId;
        this.storageKey = `chat_history_${problemId}`;
        this.firstPromptSent = false;
    }

    // Load chat history from localStorage
    loadHistory() {
        const history = localStorage.getItem(this.storageKey);
        return history ? JSON.parse(history) : [];
    }

    // Save chat history to localStorage
    saveHistory(messages) {
        localStorage.setItem(this.storageKey, JSON.stringify(messages));
    }

    // Add a new message to history
    addMessage(role, content) {
        const messages = this.loadHistory();
        messages.push({ role, content, timestamp: new Date().toISOString() });
        this.saveHistory(messages);
        return messages;
    }

    // Clear chat history
    clearHistory() {
        localStorage.removeItem(this.storageKey);
    }

    // Prepare the initial context-rich prompt
    prepareInitialPrompt(problemData, code) {
        return `You are an experienced coding mentor helping a student solve a programming problem. Your role is to:
1. First understand their question and current approach
2. Guide them with hints rather than giving direct solutions
3. Ask probing questions to help them think through the problem
4. Only provide the solution if they've made multiple attempts and are stuck

Current Context:
Problem: ${problemData.title}
Description: ${problemData.body}
Student's Code: ${code}
Available Hints: 
1. ${problemData.hints.hint1}
2. ${problemData.hints.hint2}
Solution Approach: ${problemData.hints.solution_approach}

Remember: Don't reveal all hints at once. Start with general guidance and become more specific only if needed.

Initial response format:
1. Acknowledge their question
2. Ask about their current understanding
3. Provide a gentle hint in the right direction
4. Ask what they think about your hint`;
    }

    // Prepare follow-up prompts with chat context
    prepareFollowUpPrompt(messages, userQuestion) {
        const contextMessages = Array.isArray(messages) ? messages.slice(-6) : []; // Keep last 6 messages for context
        return `Previous conversation context:
${contextMessages.map(m => `${m.role}: ${m.content}`).join('\n\n')}

New question: ${userQuestion}

Remember to maintain your role as a mentor - guide don't solve directly.`;
    }
}

async function getEditorContent(problemId,accessToken) {
    try {
        const get_user = await fetchWithAuth(`https://api2.maang.in/users/profile/private`, accessToken);
        const userInfo =await get_user.json();
        console.log(userInfo);
        const userId = userInfo['data']['id'];
        console.log(localStorage.getItem('editor-language'));
        const language = localStorage.getItem('editor-language').replace(/"/g,'');
        
        const storageKey = `course_${userId}_${problemId}_${language}`;
        console.log(storageKey);
        const code = localStorage.getItem(storageKey);
        if (!code) {
            console.log("Code not found in local storage");
            return null;
        }

        return code;
    } catch (error) {
        console.error("Error getting editor content:", error);
        throw error;
    }
}

async function fetchWithAuth(url, accessToken) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',//header accepts json
            'Content-Type': 'application/json',//
            'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    return response;
}

function extractProblemId(pathname) {
    // Updated regex to handle the new URL format
    const matches = pathname.match(/problems\/.*?-(\d+)(?:\?|$)/);
    return matches ? matches[1] : null;
}

function getCookieValue(cookieName) {
    const cookies = document.cookie.split(';');//splits all the cookies in an array
    for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

// Route change detection in a single-page applications(SPAs)
function setupRouteChangeDetection() {
    let lastUrl = window.location.href;
    setInterval(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            console.log('Route changed to:', window.location.pathname);
        }
    }, 1000);
}

setupRouteChangeDetection();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'API_KEY_UPDATED') {

        document.cookie = `groq_api_key=${encodeURIComponent(message.apiKey)};path=/;domain=maang.in;max-age=2592000;secure`;
        console.log(document.cookie);
        // Force a reload of the page to ensure the cookie is picked up
        window.location.reload();
    }
});

// Call this when your page loads
document.addEventListener('DOMContentLoaded', function() {
    const apiKey = getCookieValue('groq_api_key');
    if (!apiKey) {
        throw new Error('You have not provided groq_api_key');
    }
    return apiKey;
});

