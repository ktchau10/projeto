/* script.js - Lógica de Busca e Filtros */

document.addEventListener('DOMContentLoaded', function() {
    
    // ELEMENTOS DO DOM
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.topico-manual'); // As seções grandes (Intro, Admin, etc)
    const accordionItems = document.querySelectorAll('.accordion-item'); // Os itens individuais
    const noResults = document.getElementById('noResults');
    const profileCards = document.querySelectorAll('.profile-card');

    // --- FUNÇÃO 1: BUSCA INTELIGENTE ---
    searchInput.addEventListener('keyup', function(e) {
        const termo = e.target.value.toLowerCase().trim();
        let encontrouGeral = false;

        // Se o usuário começar a digitar, resetamos o filtro de perfil para "Todos"
        // para garantir que a busca procure em todo o manual
        if(termo.length > 0) {
            resetProfileFilterVisual(); 
        }

        // Itera sobre todas as seções principais
        sections.forEach(section => {
            let sectionVisible = false;
            const items = section.querySelectorAll('.accordion-item');
            
            // Itera sobre os itens dentro da seção
            items.forEach(item => {
                const titulo = item.querySelector('.accordion-button').textContent.toLowerCase();
                const corpo = item.querySelector('.accordion-body').textContent.toLowerCase();
                
                // Verifica se o termo está no título ou no texto
                if(titulo.includes(termo) || corpo.includes(termo)) {
                    item.classList.remove('d-none'); // Mostra o item
                    
                    // Se a busca tiver mais de 2 letras, abre o acordeão automaticamente para facilitar a leitura
                    if(termo.length > 2) {
                        const collapseElement = item.querySelector('.accordion-collapse');
                        if (!collapseElement.classList.contains('show')) {
                            new bootstrap.Collapse(collapseElement, { toggle: false }).show();
                        }
                    }
                    sectionVisible = true;
                    encontrouGeral = true;
                } else {
                    item.classList.add('d-none'); // Esconde o item que não bate
                }
            });

            // Se nenhum item dentro da seção for visível, esconde a seção inteira (o título dela)
            if(sectionVisible) {
                section.classList.remove('d-none');
            } else {
                section.classList.add('d-none');
            }
        });

        // Controle da mensagem de "Nenhum resultado"
        if(!encontrouGeral) {
            noResults.classList.remove('d-none');
        } else {
            noResults.classList.add('d-none');
        }
    });

    // --- FUNÇÃO 2: FILTRO POR PERFIL ---
    // Exposta globalmente para ser chamada pelo onclick do HTML
    window.filtrarPerfil = function(perfil, elemento) {
        
        // 1. Atualiza visual dos cards (Active state)
        profileCards.forEach(card => card.classList.remove('active'));
        elemento.classList.add('active');
        
        // 2. Limpa a barra de busca para não conflitar
        searchInput.value = '';
        noResults.classList.add('d-none');

        // 3. Lógica de mostrar/esconder seções baseada nas classes
        sections.forEach(section => {
            // Primeiro, garante que todos os itens internos estejam visíveis (reseta busca anterior)
            const items = section.querySelectorAll('.accordion-item');
            items.forEach(i => {
                i.classList.remove('d-none');
                // Fecha os acordeões ao trocar de filtro para ficar limpo
                const collapseElement = i.querySelector('.accordion-collapse');
                if (collapseElement.classList.contains('show')) {
                    new bootstrap.Collapse(collapseElement, { toggle: false }).hide();
                }
            });

            // Verifica se a seção pertence ao perfil selecionado
            if(perfil === 'todos') {
                section.classList.remove('d-none');
            } else {
                // Se a seção tem a classe 'perfil-X', ela aparece. Senão, some.
                if(section.classList.contains('perfil-' + perfil)) {
                    section.classList.remove('d-none');
                } else {
                    section.classList.add('d-none');
                }
            }
        });
    };

    // Helper para resetar visual dos cards
    function resetProfileFilterVisual() {
        profileCards.forEach(card => card.classList.remove('active'));
        // Seleciona o primeiro card (Todos)
        if(profileCards.length > 0) profileCards[0].classList.add('active');
    }

});