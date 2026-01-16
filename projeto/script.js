/* script.js - Lógica de Busca, Filtros e Lightbox */

document.addEventListener('DOMContentLoaded', function() {
    
    // ELEMENTOS DO DOM
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.topico-manual'); // As seções grandes (Intro, Admin, etc)
    const accordionItems = document.querySelectorAll('.accordion-item'); // Os itens individuais
    const noResults = document.getElementById('noResults');
    const profileCards = document.querySelectorAll('.profile-card');

    // --- FUNÇÃO 1: BUSCA INTELIGENTE ---
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const termo = e.target.value.toLowerCase().trim();
            let encontrouGeral = false;

            // Se o usuário começar a digitar, resetamos o filtro de perfil para "Todos"
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
                        
                        // Se a busca tiver mais de 2 letras, abre o acordeão automaticamente
                        if(termo.length > 2) {
                            const collapseElement = item.querySelector('.accordion-collapse');
                            if (collapseElement && !collapseElement.classList.contains('show')) {
                                new bootstrap.Collapse(collapseElement, { toggle: false }).show();
                            }
                        }
                        sectionVisible = true;
                        encontrouGeral = true;
                    } else {
                        item.classList.add('d-none'); // Esconde o item que não bate
                    }
                });

                // Se nenhum item dentro da seção for visível, esconde a seção inteira
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
    }

    // --- FUNÇÃO 2: FILTRO POR PERFIL ---
    // Exposta globalmente para ser chamada pelo onclick do HTML
    window.filtrarPerfil = function(perfil, elemento) {
        
        // 1. Atualiza visual dos cards (Active state)
        profileCards.forEach(card => card.classList.remove('active'));
        if (elemento) elemento.classList.add('active');
        
        // 2. Limpa a barra de busca para não conflitar
        if (searchInput) searchInput.value = '';
        if (noResults) noResults.classList.add('d-none');

        // 3. Lógica de mostrar/esconder seções baseada nas classes
        sections.forEach(section => {
            // Primeiro, garante que todos os itens internos estejam visíveis (reseta busca anterior)
            const items = section.querySelectorAll('.accordion-item');
            items.forEach(i => {
                i.classList.remove('d-none');
                // Fecha os acordeões ao trocar de filtro para manter a organização
                const collapseElement = i.querySelector('.accordion-collapse');
                if (collapseElement && collapseElement.classList.contains('show')) {
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
        // Seleciona o primeiro card (Todos) se existir
        if(profileCards.length > 0) profileCards[0].classList.add('active');
    }

    // --- FUNÇÃO 3: LIGHTBOX DE IMAGENS (Visualizador) ---
    
    // 1. Injeta o HTML do Modal no final do body
    const modalHTML = `
        <div id="imageModal" class="lightbox-modal">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="imgExpanded">
            <div id="caption" class="lightbox-caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 2. Elementos do Modal
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgExpanded");
    const captionText = document.getElementById("caption");
    const span = document.getElementsByClassName("lightbox-close")[0];

    // 3. Seleciona todas as imagens com a classe 'manual-print'
    const prints = document.querySelectorAll('.manual-print');

    prints.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modal.style.flexDirection = "column";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            
            // Pequeno delay para a transição de opacidade funcionar
            setTimeout(() => { modal.classList.add('show'); }, 10);
            
            modalImg.src = this.src;
            // Usa o texto alternativo como legenda; se não houver, fica vazio
            captionText.innerHTML = this.alt || ''; 
        });
    });

    // 4. Funções para fechar o modal
    function fecharModal() {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = "none"; }, 300);
    }

    // Fecha ao clicar no X
    if (span) {
        span.onclick = function() {
            fecharModal();
        }
    }

    // Fecha ao clicar fora da imagem (no fundo cinza)
    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) {
                fecharModal();
            }
        }
    }
    
    // Fecha com a tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal && modal.style.display !== "none") {
            fecharModal();
        }
    });
    
    // --- FUNÇÃO EXTRA: Abrir acordeão via link direto ---
    window.forceOpen = function(id) {
        // 1. Acha o elemento do acordeão
        const el = document.getElementById(id);
        if(el) {
            // 2. Remove a classe 'collapse' temporariamente ou usa o Bootstrap API
            const bsCollapse = new bootstrap.Collapse(el, { toggle: false });
            bsCollapse.show();
            
            // 3. Rola a página até o elemento com um pouco de suavidade
            setTimeout(() => {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }
    };

});