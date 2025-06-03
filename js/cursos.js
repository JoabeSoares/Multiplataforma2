document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const cursosContainer = document.getElementById('cursos-container');
    const buscaInput = document.getElementById('busca-curso');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroDificuldade = document.getElementById('filtro-dificuldade');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');
    const cursoModal = document.getElementById('curso-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Variáveis de estado
    let cursos = [];
    let currentPage = 1;
    const cursosPerPage = 6;
    let categorias = [];

    // Inicialização
    init();

    async function init() {
        await carregarCursos();
        carregarCategorias();
        setupEventListeners();
    }

    // Carrega cursos da API
    async function carregarCursos() {
        try {
            cursosContainer.innerHTML = `
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            `;
            
            const response = await fetch('http://localhost:3001/cursos');
            cursos = await response.json();
            
            exibirCursos();
            atualizarPaginacao();
        } catch (error) {
            cursosContainer.innerHTML = `
                <div class="erro">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Erro ao carregar cursos. Tente novamente mais tarde.</p>
                </div>
            `;
            console.error('Erro:', error);
        }
    }

    // Extrai categorias únicas dos cursos
    function carregarCategorias() {
        categorias = [...new Set(cursos.map(curso => curso.categoria))];
        
        filtroCategoria.innerHTML = `
            <option value="">Todas as categorias</option>
            ${categorias.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
        `;
    }

    // Exibe cursos com paginação
    function exibirCursos() {
        const filtered = filtrarCursos();
        const paginated = paginarCursos(filtered);
        
        if (paginated.length === 0) {
            cursosContainer.innerHTML = `
                <div class="sem-resultados">
                    <i class="fas fa-search"></i>
                    <p>Nenhum curso encontrado com esses filtros.</p>
                </div>
            `;
            return;
        }
        
        cursosContainer.innerHTML = paginated.map(curso => `
            <div class="curso-card" data-id="${curso.id}">
                <h3>${curso.titulo}</h3>
                <p class="categoria">${curso.categoria}</p>
                <p class="descricao">${curso.descricao}</p>
                <div class="curso-meta">
                    <span><i class="fas fa-clock"></i> ${curso.duracao}</span>
                    <span><i class="fas fa-signal"></i> ${curso.dificuldade}</span>
                </div>
                <button class="btn btn-detalhes">Ver detalhes</button>
            </div>
        `).join('');
        
        // Adiciona event listeners aos botões de detalhes
        document.querySelectorAll('.btn-detalhes').forEach(btn => {
            btn.addEventListener('click', function() {
                const cursoId = parseInt(this.closest('.curso-card').dataset.id);
                abrirModal(cursoId);
            });
        });
    }

    // Filtra cursos por busca e seleções
    function filtrarCursos() {
        const termoBusca = buscaInput.value.toLowerCase();
        const categoriaSelecionada = filtroCategoria.value;
        const dificuldadeSelecionada = filtroDificuldade.value;
        
        return cursos.filter(curso => {
            const correspondeBusca = curso.titulo.toLowerCase().includes(termoBusca) || 
                                  curso.descricao.toLowerCase().includes(termoBusca);
            const correspondeCategoria = !categoriaSelecionada || 
                                       curso.categoria === categoriaSelecionada;
            const correspondeDificuldade = !dificuldadeSelecionada || 
                                         curso.dificuldade === dificuldadeSelecionada;
            
            return correspondeBusca && correspondeCategoria && correspondeDificuldade;
        });
    }

    // Paginação
    function paginarCursos(cursos) {
        const start = (currentPage - 1) * cursosPerPage;
        return cursos.slice(start, start + cursosPerPage);
    }

    function atualizarPaginacao() {
        const filtered = filtrarCursos();
        const totalPages = Math.ceil(filtered.length / cursosPerPage);
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        pageInfo.textContent = `Página ${currentPage} de ${totalPages > 0 ? totalPages : 1}`;
    }

    // Modal
    function abrirModal(cursoId) {
        const curso = cursos.find(c => c.id === cursoId);
        if (!curso) return;
        
        document.getElementById('modal-titulo').textContent = curso.titulo;
        document.getElementById('modal-categoria').textContent = curso.categoria;
        document.getElementById('modal-dificuldade').textContent = curso.dificuldade;
        document.getElementById('modal-duracao').textContent = curso.duracao;
        document.getElementById('modal-descricao').textContent = curso.descricao || 'Sem descrição detalhada.';
        
        cursoModal.style.display = 'flex';
    }

    // Event Listeners
    function setupEventListeners() {
        // Filtros
        buscaInput.addEventListener('input', () => {
            currentPage = 1;
            exibirCursos();
            atualizarPaginacao();
        });
        
        filtroCategoria.addEventListener('change', () => {
            currentPage = 1;
            exibirCursos();
            atualizarPaginacao();
        });
        
        filtroDificuldade.addEventListener('change', () => {
            currentPage = 1;
            exibirCursos();
            atualizarPaginacao();
        });
        
        // Paginação
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                exibirCursos();
                atualizarPaginacao();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const filtered = filtrarCursos();
            const totalPages = Math.ceil(filtered.length / cursosPerPage);
            
            if (currentPage < totalPages) {
                currentPage++;
                exibirCursos();
                atualizarPaginacao();
            }
        });
        
        // Modal
        closeModal.addEventListener('click', () => {
            cursoModal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === cursoModal) {
                cursoModal.style.display = 'none';
            }
        });
    }
});