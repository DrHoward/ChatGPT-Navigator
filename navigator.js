// manipulates ChatGPT interface based on received commands
(function() {
    let currentIndex = 0;

    function getUserMessages() {
        // grab all messages with "user" author role
        return Array.from(document.querySelectorAll('div[data-message-author-role="user"]'));
    }

    function scrollToMessage(index) {
        const messages = getUserMessages();

        const centerY = window.innerHeight / 2;
        const closest = Array.from(messages).reduce((prev, el) => {
            const rect = el.getBoundingClientRect();
            const elCenterY = rect.top + rect.height / 2;
            // calculate distance from center of viewport
            return (Math.abs(elCenterY - centerY) < Math.abs(prev.elCenterY - centerY))
            ? { el, elCenterY }
            : prev;
        }, { el: null, center: Infinity }).el

        if (closest) {
            closest.scrollIntoView({ behavior: 'smooth', block: 'center' });
            closest.style.outline = '2px solid #00bfff';
            setTimeout(() => closest.style.outline = '', 800);
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