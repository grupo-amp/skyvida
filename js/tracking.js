// tracking.js
(function () {
    'use strict';

    const TOKEN_KEY = 'tracking';

    async function getOrCreateToken() {
        let token = localStorage.getItem(TOKEN_KEY);

        try {
            const response = await fetch(`${window.APP_CONFIG.services}/lead/lead-sky/rastreio`, {
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

        // Pega todos os links que apontam para a URL de contratação
        const contratarBaseUrl = window.APP_CONFIG?.contratarUrl || 'contratar';
        const links = document.querySelectorAll(`a[href*="${contratarBaseUrl}"]`);

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
