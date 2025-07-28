// Content script injected into web pages
let isInjected = false;

if (!isInjected) {
  isInjected = true;
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'PROCESS_COMMAND') {
      processCommand(request.command)
        .then((result) => sendResponse({ success: true, result }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open for async response
    }
  });

  // Create floating command input when user types 'do' in address bar
  let commandOverlay: HTMLElement | null = null;

  function createCommandOverlay() {
    if (commandOverlay) return;

    commandOverlay = document.createElement('div');
    commandOverlay.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      font-family: system-ui, -apple-system, sans-serif;
      min-width: 400px;
    `;

    const input = document.createElement('input');
    input.style.cssText = `
      width: 100%;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      outline: none;
      font-size: 14px;
    `;
    input.placeholder = 'Type a command...';

    commandOverlay.appendChild(input);
    document.body.appendChild(commandOverlay);

    input.focus();

    // Handle input
    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        const command = input.value.trim();
        hideCommandOverlay();
        
        // Send command to background script
        try {
          const response = await chrome.runtime.sendMessage({
            type: 'EXECUTE_COMMAND',
            command
          });
          
          if (response.success) {
            showNotification(`Command executed: ${command}`);
          } else {
            showNotification(`Error: ${response.error}`, 'error');
          }
        } catch (error) {
          showNotification(`Failed to execute command`, 'error');
        }
      } else if (e.key === 'Escape') {
        hideCommandOverlay();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!commandOverlay?.contains(e.target as Node)) {
        hideCommandOverlay();
      }
    });
  }

  function hideCommandOverlay() {
    if (commandOverlay) {
      commandOverlay.remove();
      commandOverlay = null;
    }
  }

  function showNotification(message: string, type: 'success' | 'error' = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Listen for Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      createCommandOverlay();
    }
  });

  async function processCommand(command: string) {
    // Simulate command processing on the current page
    const pageInfo = {
      url: window.location.href,
      title: document.title,
      domain: window.location.hostname
    };

    // Here you would implement actual command processing
    // For now, simulate different command types
    if (command.toLowerCase().includes('scroll')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return { action: 'scroll', target: 'top' };
    }
    
    if (command.toLowerCase().includes('click')) {
      // Find clickable elements and simulate click
      const buttons = document.querySelectorAll('button, a, [role="button"]');
      if (buttons.length > 0) {
        (buttons[0] as HTMLElement).click();
        return { action: 'click', target: buttons[0].textContent?.trim() };
      }
    }
    
    if (command.toLowerCase().includes('fill') || command.toLowerCase().includes('type')) {
      // Find input fields
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
      if (inputs.length > 0) {
        const input = inputs[0] as HTMLInputElement;
        input.value = command.replace(/fill|type/i, '').trim();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return { action: 'fill', target: input.placeholder || 'input field' };
      }
    }

    return { 
      action: 'processed', 
      command, 
      pageInfo,
      timestamp: new Date().toISOString()
    };
  }

  console.log('Tab Trove Toolkit content script loaded');
}

export {};