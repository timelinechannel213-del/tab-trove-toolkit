import { ExtensionMessage, PageInfo } from '@/types/extension';

export const isExtension = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.runtime && !!chrome.runtime.id;
};

export const sendMessageToBackground = async (message: ExtensionMessage): Promise<any> => {
  if (!isExtension()) {
    throw new Error('Not running in extension context');
  }
  
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const sendMessageToContentScript = async (tabId: number, message: ExtensionMessage): Promise<any> => {
  if (!isExtension()) {
    throw new Error('Not running in extension context');
  }
  
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
};

export const getCurrentTab = async (): Promise<chrome.tabs.Tab | null> => {
  if (!isExtension()) {
    return null;
  }
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab || null;
};

export const getPageInfo = async (): Promise<PageInfo | null> => {
  const tab = await getCurrentTab();
  if (!tab) return null;
  
  return {
    url: tab.url || '',
    title: tab.title || '',
    id: tab.id,
    domain: tab.url ? new URL(tab.url).hostname : ''
  };
};