document.addEventListener('DOMContentLoaded', function() {
    
    // ELEMENTOS DO DOM
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.topico-manual');
    const accordionItems = document.querySelectorAll('.accordion-item');
    const noResults = document.getElementById('noResults');
    const profileCards = document.querySelectorAll('.profile-card');

    // --- FUNÇÃO 1: BUSCA INTELIGENTE ---
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const termo = e.target.value.toLowerCase().trim();
            let encontrouGeral = false;

            if(termo.length > 0) {
                resetProfileFilterVisual(); 
            }

            sections.forEach(section => {
                let sectionVisible = false;
                const items = section.querySelectorAll('.accordion-item');
                
                items.forEach(item => {
                    const titulo = item.querySelector('.accordion-button').textContent.toLowerCase();
                    const corpo = item.querySelector('.accordion-body').textContent.toLowerCase();
                    
                    if(titulo.includes(termo) || corpo.includes(termo)) {
                        item.classList.remove('d-none');
                        
                        if(termo.length > 2) {
                            const collapseElement = item.querySelector('.accordion-collapse');
                            if (collapseElement && !collapseElement.classList.contains('show')) {
                                new bootstrap.Collapse(collapseElement, { toggle: false }).show();
                            }
                        }
                        sectionVisible = true;
                        encontrouGeral = true;
                    } else {
                        item.classList.add('d-none');
                    }
                });

                if(sectionVisible) {
                    section.classList.remove('d-none');
                } else {
                    section.classList.add('d-none');
                }
            });

            if(!encontrouGeral) {
                noResults.classList.remove('d-none');
            } else {
                noResults.classList.add('d-none');
            }
        });
    }

    // --- FUNÇÃO 2: FILTRO POR PERFIL ---
    window.filtrarPerfil = function(perfil, elemento) {
        
        // 1. Atualiza visual dos cards (Active state)
        profileCards.forEach(card => card.classList.remove('active'));
        if (elemento) elemento.classList.add('active');
        else if (perfil === 'gestor') profileCards[1].classList.add('active'); // Fallback para links do menu lateral
        else if (perfil === 'coordenador') profileCards[2].classList.add('active');
        else if (perfil === 'docente') profileCards[3].classList.add('active');
        else if (perfil === 'discente') profileCards[4].classList.add('active');
        
        // 2. Limpa a barra de busca
        if (searchInput) searchInput.value = '';
        if (noResults) noResults.classList.add('d-none');

        // 3. Lógica de mostrar/esconder seções
        sections.forEach(section => {
            // Reseta itens internos (caso venha de uma busca)
            const items = section.querySelectorAll('.accordion-item');
            items.forEach(i => {
                i.classList.remove('d-none');
                // Fecha os acordeões para manter organizado
                const collapseElement = i.querySelector('.accordion-collapse');
                if (collapseElement && collapseElement.classList.contains('show')) {
                    new bootstrap.Collapse(collapseElement, { toggle: false }).hide();
                }
            });

            if(perfil === 'todos') {
                section.classList.remove('d-none');
            } else {
                if(section.classList.contains('perfil-' + perfil)) {
                    section.classList.remove('d-none');
                } else {
                    section.classList.add('d-none');
                }
            }
        });
    };

    function resetProfileFilterVisual() {
        profileCards.forEach(card => card.classList.remove('active'));
        if(profileCards.length > 0) profileCards[0].classList.add('active');
    }

    // --- FUNÇÃO 3: LIGHTBOX DE IMAGENS ---
    const modalHTML = `
        <div id="imageModal" class="lightbox-modal">
            <span class="lightbox-close">&times;</span>
            <img class="lightbox-content" id="imgExpanded">
            <div id="caption" class="lightbox-caption"></div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgExpanded");
    const captionText = document.getElementById("caption");
    const span = document.getElementsByClassName("lightbox-close")[0];
    const prints = document.querySelectorAll('.manual-print');

    prints.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "flex";
            modal.style.flexDirection = "column";
            modal.style.alignItems = "center";
            modal.style.justifyContent = "center";
            
            setTimeout(() => { modal.classList.add('show'); }, 10);
            
            modalImg.src = this.src;
            captionText.innerHTML = this.alt || ''; 
        });
    });

    function fecharModal() {
        modal.classList.remove('show');
        setTimeout(() => { modal.style.display = "none"; }, 300);
    }

    if (span) {
        span.onclick = function() { fecharModal(); }
    }

    if (modal) {
        modal.onclick = function(event) {
            if (event.target === modal) { fecharModal(); }
        }
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && modal && modal.style.display !== "none") {
            fecharModal();
        }
    });
});