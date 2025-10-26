// manipulates ChatGPT interface based on received commands
(function() {
    // only run on ChatGPT site
    const allowedHost = "chatgpt.com";
    if (!location.hostname.includes(allowedHost)) return;

    let closestIndex = null;

    function getUserMessages() {
        // grab all messages with "user" author role
        return Array.from(document.querySelectorAll('div[data-message-author-role="user"]'));
    }

    function getClosestIndex(messages, direction) {
        if (!messages.length) return null;

        let closest = null;
        let closestDistance = Infinity;
        
        messages.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const offset = rect.top;
            console.log({i, offset});

            if (offset === 0) return;

            if (direction === 'up') {
                if (offset < 0 && Math.abs(offset) < closestDistance) {
                    closestDistance = Math.abs(offset);
                    closest = i;
                }
            } else if (direction === 'down') {
                if (offset > 0 && offset < closestDistance) {
                    closestDistance = offset;
                    closest = i;
                }
            }
        });

        return closest;
    }

    function scrollToMessage(msg) {
        if (!msg) return;

        container = document.scrollingElement;
        const rect = msg.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const offsetTop = rect.top + scrollTop;
        container.scrollTo({ top: offsetTop, behavior: 'smooth' });

        //msg.scrollIntoView({ behavior: 'smooth', block: 'start' });
        msg.style.outline = '2px solid #00bfff';
        setTimeout(() => msg.style.outline = '', 800);
    }

    window.addEventListener('message', (event) => {
        if (event.source !== window || event.data.source !== 'chatgpt-navigator') return;
        const { command } = event.data;
        const messages = getUserMessages();
        if (!messages.length) return;

        const direction = { 'scroll-up': 'up', 'scroll-down': 'down' }[command] || null;
        closestIndex = getClosestIndex(messages, direction);
        if (direction && closestIndex) scrollToMessage(messages[closestIndex]);
    });
})();