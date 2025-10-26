// manipulates ChatGPT interface based on received commands
(function() {
    // only run on ChatGPT site
    const allowedHost = "chatgpt.com";
    if (!location.hostname.includes(allowedHost)) return;

    function getUserMessages() {
        // grab all messages with "user" author role
        return Array.from(document.querySelectorAll('div[data-message-author-role="user"]'));
    }

    function getClosestIndex(messages, direction) {
        let closestIndex = null;
        let minDistance = Infinity;
        const centerY = window.innerHeight / 2;

        messages.forEach((el, i) => {
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const offset = elCenter - centerY;
            //console.log({i, offset});
            // FIXME: offset on centered message is -4 but gets stuck on it regardless

            if (Math.abs(offset) < 5) {
                return closestIndex = { 'up': i - 1, 'down': i + 1 }[direction];
            }

            if ((direction === 'up' && offset < 0 && Math.abs(offset) < minDistance) ||
                    (direction === 'down' && offset >= 0 && offset < minDistance)) {
                minDistance = Math.abs(offset);
                closestIndex = i;
            }
        });

        return closestIndex;
    }

    function scrollToMessage(msg) {
        if (!msg) return;

        const rect = msg.getBoundingClientRect();
        const scrollY = window.scrollY + rect.top - offsetFromTop;
        window.scrollTo({ top: scrollY, behavior: 'smooth' });

        //msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        msg.style.outline = '2px solid #00bfff';
        setTimeout(() => msg.style.outline = '', 800);
    }

    window.addEventListener('message', (event) => {
        if (event.source !== window || event.data.source !== 'chatgpt-navigator') return;
        const { command } = event.data;
        const messages = getUserMessages();
        if (!messages.length) return;

        const dir = { 'scroll-up': 'up', 'scroll-down': 'down' }[command] || null;
        if (dir) scrollToMessage(messages[getClosestIndex(messages, dir)]);
    });
})();