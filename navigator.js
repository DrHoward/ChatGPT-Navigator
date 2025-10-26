// manipulates ChatGPT interface based on received commands
(function() {
    let currentIndex = 0;

    function getUserMessages() {
        // grab all message blocks with "user" author role
        return Array.from(document.querySelectorAll('div[data-message-author-role="user"]'));
    }

    function scrollToMessage(index) {
        const messages = getUserMessages();
        if (messages[index]) {
            messages[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            messages[index].style.outline = '2px solid #00bfff';
            setTimeout(() => messages[index].style.outline = '', 800);
        }
    }

    window.addEventListener('message', (event) => {
        if (event.source !== window || event.data.source !== 'chatgpt-navigator') return;
        const { command } = event.data;
        const messages = getUserMessages();

        if (!messages.length) return;
        if (command === 'scroll-up') currentIndex = Math.max(0, currentIndex - 1);
        if (command === 'scroll-down') currentIndex = Math.min(messages.length - 1, currentIndex + 1);
        scrollToMessage(currentIndex);
    });
})();