// Background script for Chrome extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Tab Trove Toolkit extension installed');
});

// Handle keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-assistant') {
    chrome.action.openPopup();
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'EXECUTE_COMMAND') {
    // Handle command execution
    executeCommand(request.command, sender.tab?.id)
      .then((result) => sendResponse({ success: true, result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
  
  if (request.type === 'GET_PAGE_INFO') {
    // Get current page information
    if (sender.tab) {
      sendResponse({
        url: sender.tab.url,
        title: sender.tab.title,
        id: sender.tab.id
      });
    }
  }
});

async function executeCommand(command: string, tabId?: number) {
  if (!tabId) throw new Error('No active tab');
  
  // Inject content script if needed
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['src/content/content.js']
    });
  } catch (error) {
    console.log('Content script already injected or failed to inject');
  }
  
  // Send command to content script
  const response = await chrome.tabs.sendMessage(tabId, {
    type: 'PROCESS_COMMAND',
    command
  });
  
  return response;
}

// Handle tab updates for context
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Store tab context for AI processing
    chrome.storage.local.set({
      [`tab_${tabId}`]: {
        url: tab.url,
        title: tab.title,
        timestamp: Date.now()
      }
    });
  }
});

export {};