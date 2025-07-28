# Tab Trove Toolkit - Chrome Extension

## Development Setup

1. Run `npm run build` to build the extension
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the `dist` folder
5. Pin the extension to your toolbar

## Usage

- **Popup**: Click the extension icon to open the command interface
- **Keyboard shortcut**: Press `Ctrl+K` (or `Cmd+K` on Mac) on any page to open floating command overlay
- **Commands**: Type natural language commands like:
  - "scroll to top"
  - "click first button" 
  - "fill form with test data"
  - "open Gmail in new tab"

## Chrome Web Store Upload

### Prerequisites
1. Create a Chrome Web Store developer account ($5 one-time fee)
2. Prepare store assets:
   - Icon: 128x128px PNG
   - Screenshots: 1280x800px or 640x400px
   - Promotional tile: 440x280px (optional)

### Upload Steps
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "Add new item"
3. Upload the built extension as a ZIP file:
   ```bash
   cd dist
   zip -r tab-trove-toolkit.zip .
   ```
4. Fill out the store listing:
   - **Name**: Tab Trove Toolkit
   - **Summary**: AI browser assistant for task automation
   - **Description**: Execute commands on any website using natural language
   - **Category**: Productivity
   - **Language**: English

### Store Listing Content

**Description:**
```
Tab Trove Toolkit is your AI-powered browser assistant that understands natural language and performs tasks on your behalf.

🚀 Features:
• Execute commands with natural language
• Keyboard shortcut (Ctrl+K) for quick access
• Works on any website
• Task history and status tracking
• Floating command overlay

💡 Example Commands:
• "scroll to top" - Instantly scroll to page top
• "click first button" - Find and click the first button
• "fill form with test data" - Auto-fill form fields
• "close social media tabs" - Close distracting tabs

Perfect for power users who want to automate repetitive browser tasks and navigate the web more efficiently.
```

**Privacy Policy**: Create a simple privacy policy stating you don't collect user data.

### Review Process
- Initial review: 1-3 business days
- Updates: Usually faster approval
- Follow Chrome Web Store policies carefully

The extension is now optimized for Chrome Web Store with a compact popup UI!