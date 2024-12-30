document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const statusDiv = document.getElementById('status');

    // Check for required permissions in manifest.json
    chrome.permissions.getAll(permissions => {
        console.log('Current extension permissions:', permissions);
    });

    saveButton.addEventListener('click', async function() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', false);
            return;
        }

        try {
            // First, ensure we have the required permissions
            const hasPermissions = await chrome.permissions.contains({
                permissions: ['cookies'],
                origins: ['https://maang.in/*']
            });

            if (!hasPermissions) {
                throw new Error('Required permissions not granted');
            }

            // Remove any existing cookie first
            await new Promise((resolve) => {
                chrome.cookies.remove({
                    url: 'https://maang.in',
                    name: 'groq_api_key'
                }, resolve);
            });

            // Set the new cookie with correct parameters
            const cookieDetails = {
                url: 'https://maang.in',
                name: 'groq_api_key',
                value: apiKey,
                domain: 'maang.in',
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'lax',
                expirationDate: Math.floor(Date.now() / 1000 + 30 * 24 * 60 * 60) // 30 days
            };

            const cookie = await new Promise((resolve, reject) => {
                chrome.cookies.set(cookieDetails, (result) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(result);
                    }
                });
            });

            // Store in local storage as backup
            await chrome.storage.local.set({ 'groq_api_key': apiKey });

            // Verify the cookie was set
            const verificationCookie = await new Promise((resolve) => {
                chrome.cookies.get({
                    url: 'https://maang.in',
                    name: 'groq_api_key'
                }, resolve);
            });

            if (!verificationCookie) {
                throw new Error('Cookie verification failed');
            }

            showStatus('API key saved successfully!', true);
            
            // Notify any open tabs
            chrome.tabs.query({url: 'https://maang.in/*'}, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        type: 'API_KEY_UPDATED',
                        apiKey: apiKey
                    });
                    
                });
            });
            window.close();

        } catch (error) {
            console.error('Error saving API key:', error);
            showStatus(`Error: ${error.message}`, false);
        }
    });

    function showStatus(message, isSuccess) {
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        statusDiv.className = 'status ' + (isSuccess ? 'success' : 'error');
        
        if (isSuccess) {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }
});