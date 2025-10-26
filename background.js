// listens for keyboard shortcuts and sends commands to the active tab
chrome.commands.onCommand.addListener(async (command) => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (cmd) => {
            window.postMessage({ source: 'chatgpt-navigator', command: cmd }, '*');
        },
        args: [command]
    });
});