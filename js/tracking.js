// tracking.js
(function () {
    'use strict';

    const TOKEN_KEY = 'sky_tracking_token';

    async function getOrCreateToken() {
        let token = localStorage.getItem(TOKEN_KEY);

        try {
            const response = await fetch('https://services.dev.lamp-services.com/lead/lead-sky/rastreio', {
                method: 'POST'
            });

            const data = await response.json();

            if (data.status && data.token) {
                token = data.token;
                localStorage.setItem(TOKEN_KEY, token);
                return token;
            }
        } catch (error) {
            console.error('Erro ao gerar token de rastreio:', error);
        }

        return null;
    }

    function updateLinks(token) {
        if (!token) return;

        // Pega todos os links que apontam para a página de contratação
        const links = document.querySelectorAll('a[href*="contratar"]');

        links.forEach(link => {
            const url = new URL(link.href);
            url.searchParams.set('token', token);
            link.href = url.toString();
        });
    }

    // Inicializa quando o DOM carregar
    document.addEventListener('DOMContentLoaded', async function () {
        const token = await getOrCreateToken();
        updateLinks(token);
    });
})();
