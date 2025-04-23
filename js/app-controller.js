// Integração de todos os módulos e preparação para testes

// Importar todos os controladores
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se todos os controladores estão disponíveis
    const controllersAvailable = 
        typeof window.financeController !== 'undefined' &&
        typeof window.categoryController !== 'undefined' &&
        typeof window.creditCardController !== 'undefined' &&
        typeof window.investmentController !== 'undefined' &&
        typeof window.investmentCategoryController !== 'undefined' &&
        typeof window.chartController !== 'undefined';
    
    if (!controllersAvailable) {
        console.error('Alguns controladores não estão disponíveis. Verifique se todos os arquivos JS foram carregados corretamente.');
        return;
    }
    
    // Inicializar a aplicação
    initializeApplication();
});

// Função para inicializar a aplicação
function initializeApplication() {
    console.log('Inicializando aplicação...');
    
    // Carregar dados iniciais (simulação)
    loadInitialData();
    
    // Configurar navegação
    setupNavigation();
    
    // Inicializar gráficos
    if (typeof window.chartController !== 'undefined') {
        window.chartController.initializeAllCharts();
    }
    
    // Configurar sistema de categorias expansíveis
    setupExpandableCategories();
    
    // Configurar eventos para os formulários
    setupFormEvents();
    
    // Configurar eventos para os filtros
    setupFilterEvents();
    
    // Atualizar selects de categorias de investimentos
    if (typeof window.investmentCategoryController !== 'undefined') {
        window.investmentCategoryController.atualizarSelectsCategoriaInvestimentos();
    }
    
    console.log('Aplicação inicializada com sucesso!');
}

// Função para carregar dados iniciais (simulação)
function loadInitialData() {
    console.log('Carregando dados iniciais...');
    
    // Esta função seria implementada para carregar dados iniciais
    // de um banco de dados ou armazenamento local
    
    // Por enquanto, usamos os dados de exemplo definidos em cada controlador
}

// Configuração da navegação entre seções
function setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Esconder todas as seções
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Mostrar a seção correspondente
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Atualizar conteúdo da seção ativa
                updateActiveSection(targetId);
            }
        });
    });
}

// Função para atualizar o conteúdo da seção ativa
function updateActiveSection(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'transacoes':
            updateTransacoes();
            break;
        case 'cartao':
            updateCartao();
            break;
        case 'investimentos':
            updateInvestimentos();
            break;
        case 'relatorios':
            updateRelatorios();
            break;
    }
}

// Função para atualizar o Dashboard
function updateDashboard() {
    console.log('Atualizando Dashboard...');
    
    // Esta função seria implementada para atualizar o conteúdo do Dashboard
    // com base nos dados atuais
}

// Função para atualizar a seção de Transações
function updateTransacoes() {
    console.log('Atualizando Transações...');
    
    // Esta função seria implementada para atualizar o conteúdo da seção de Transações
    // com base nos dados atuais
}

// Função para atualizar a seção de Cartão de Crédito
function updateCartao() {
    console.log('Atualizando Cartão de Crédito...');
    
    // Esta função seria implementada para atualizar o conteúdo da seção de Cartão de Crédito
    // com base nos dados atuais
}

// Função para atualizar a seção de Investimentos
function updateInvestimentos() {
    console.log('Atualizando Investimentos...');
    
    // Esta função seria implementada para atualizar o conteúdo da seção de Investimentos
    // com base nos dados atuais
}

// Função para atualizar a seção de Relatórios
function updateRelatorios() {
    console.log('Atualizando Relatórios...');
    
    // Esta função seria implementada para atualizar o conteúdo da seção de Relatórios
    // com base nos dados atuais
}

// Configuração do sistema de categorias expansíveis
function setupExpandableCategories() {
    console.log('Configurando sistema de categorias expansíveis...');
    
    // Esta função seria implementada para configurar o sistema de categorias expansíveis
    // com base nos dados atuais
    
    document.addEventListener('click', function(event) {
        // Verificar se o clique foi em um cabeçalho de categoria
        const categoryHeader = event.target.closest('.category-header');
        
        if (categoryHeader) {
            const categoryItem = categoryHeader.closest('.category-item');
            const categoryDetails = categoryItem.querySelector('.category-details');
            const icon = categoryHeader.querySelector('.bi-chevron-down, .bi-chevron-up');
            
            // Toggle da classe expanded
            categoryDetails.classList.toggle('expanded');
            
            // Toggle do ícone
            if (icon) {
                icon.classList.toggle('bi-chevron-down');
                icon.classList.toggle('bi-chevron-up');
            }
        }
    });
}

// Configuração dos eventos para os formulários
function setupFormEvents() {
    console.log('Configurando eventos para os formulários...');
    
    // Configurar eventos para o formulário de nova transação
    const btnSalvarTransacao = document.getElementById('btnSalvarTransacao');
    
    if (btnSalvarTransacao) {
        btnSalvarTransacao.addEventListener('click', function() {
            const formNovaTransacao = document.getElementById('formNovaTransacao');
            
            // Validar formulário
            if (formNovaTransacao.checkValidity()) {
                // Coletar dados do formulário
                const novaTransacao = {
                    data: document.getElementById('dataTransacao').value,
                    descricao: document.getElementById('descricaoTransacao').value,
                    categoria: document.getElementById('categoriaTransacao').value,
                    valor: parseFloat(document.getElementById('valorTransacao').value),
                    tipo: document.getElementById('tipoTransacao').value,
                    metodoPagamento: document.getElementById('metodoPagamento').value,
                    observacao: document.getElementById('observacaoTransacao').value
                };
                
                // Adicionar nova transação
                if (typeof window.financeController !== 'undefined') {
                    window.financeController.adicionarTransacao(novaTransacao);
                }
                
                // Fechar modal
                const modalNovaTransacao = bootstrap.Modal.getInstance(document.getElementById('modalNovaTransacao'));
                modalNovaTransacao.hide();
                
                // Limpar formulário
                formNovaTransacao.reset();
                
                // Atualizar interface
                updateActiveSection('transacoes');
                updateDashboard();
            } else {
                // Exibir validações do formulário
                formNovaTransacao.reportValidity();
            }
        });
    }
    
    // Configurar eventos para o formulário de nova compra no cartão
    const btnSalvarCompra = document.getElementById('btnSalvarCompra');
    
    if (btnSalvarCompra) {
        btnSalvarCompra.addEventListener('click', function() {
            const formNovaCompraCartao = document.getElementById('formNovaCompraCartao');
            
            // Validar formulário
            if (formNovaCompraCartao.checkValidity()) {
                // Coletar dados do formulário
                const novaCompra = {
                    cartaoId: parseInt(document.getElementById('cartaoCompra').value),
                    data: document.getElementById('dataCompra').value,
                    descricao: document.getElementById('descricaoCompra').value,
                    categoria: document.getElementById('categoriaCompra').value,
                    valor: parseFloat(document.getElementById('valorCompra').value),
                    parcelas: parseInt(document.getElementById('parcelasCompra').value),
                    parcelaAtual: 1,
                    recorrente: document.getElementById('recorrenteCompra').checked,
                    observacao: document.getElementById('observacaoCompra').value
                };
                
                // Adicionar dia de cobrança se for recorrente
                if (novaCompra.recorrente) {
                    novaCompra.diaCobranca = parseInt(document.getElementById('diaCobranca').value);
                }
                
                // Adicionar nova compra
                if (typeof window.creditCardController !== 'undefined') {
                    window.creditCardController.adicionarCompraCartao(novaCompra);
                }
                
                // Fechar modal
                const modalNovaCompraCartao = bootstrap.Modal.getInstance(document.getElementById('modalNovaCompraCartao'));
                modalNovaCompraCartao.hide();
                
                // Limpar formulário
                formNovaCompraCartao.reset();
                
                // Atualizar interface
                updateActiveSection('cartao');
                updateDashboard();
            } else {
                // Exibir validações do formulário
                formNovaCompraCartao.reportValidity();
            }
        });
    }
    
    // Configurar eventos para o formulário de novo investimento
    const btnSalvarInvestimento = document.getElementById('btnSalvarInvestimento');
    
    if (btnSalvarInvestimento) {
        btnSalvarInvestimento.addEventListener('click', function() {
            const formNovoInvestimento = document.getElementById('formNovoInvestimento');
            
            // Validar formulário
            if (formNovoInvestimento.checkValidity()) {
                // Coletar dados do formulário
                const novoInvestimento = {
                    nome: document.getElementById('nomeAtivo').value,
                    tipo: document.getElementById('tipoInvestimento').value,
                    subcategoria: document.getElementById('subcategoriaInvestimento').value,
                    quantidade: parseFloat(document.getElementById('quantidade').value),
                    precoMedio: parseFloat(document.getElementById('precoMedio').value),
                    precoAtual: parseFloat(document.getElementById('precoMedio').value), // Inicialmente igual ao preço médio
                    dataCompra: document.getElementById('dataCompra').value,
                    corretora: document.getElementById('corretora').value,
                    observacao: document.getElementById('observacaoInvestimento').value
                };
                
                // Adicionar novo investimento
                if (typeof window.investmentController !== 'undefined') {
                    window.investmentController.adicionarInvestimento(novoInvestimento);
                }
                
                // Fechar modal
                const modalNovoInvestimento = bootstrap.Modal.getInstance(document.getElementById('modalNovoInvestimento'));
                modalNovoInvestimento.hide();
                
                // Limpar formulário
                formNovoInvestimento.reset();
                
                // Atualizar interface
                updateActiveSection('investimentos');
                updateDashboard();
            } else {
                // Exibir validações do formulário
                formNovoInvestimento.reportValidity();
            }
        });
    }
}

// Configuração dos eventos para os filtros
function setupFilterEvents() {
    console.log('Configurando eventos para os filtros...');
    
    // Configurar eventos para os filtros de transações
    const filtrosTransacoes = document.querySelectorAll('#filtroMes, #filtroAno, #filtroTipo, #filtroCategoria');
    
    filtrosTransacoes.forEach(filtro => {
        filtro.addEventListener('change', function() {
            const filtrosAtuais = {
                mes: document.getElementById('filtroMes').value,
                ano: document.getElementById('filtroAno').value,
                tipo: document.getElementById('filtroTipo').value,
                categoria: document.getElementById('filtroCategoria').value
            };
            
            // Filtrar transações
            if (typeof window.financeController !== 'undefined') {
                const transacoesFiltradas = window.financeController.filtrarTransacoes(filtrosAtuais);
                const resumo = window.financeController.calcularResumoFinanceiro(transacoesFiltradas);
                const categorias = window.financeController.agruparPorCategoria(transacoesFiltradas);
                
                // Atualizar interface com os resultados filtrados
                // Esta parte seria implementada para atualizar a interface
            }
        });
    });
    
    // Configurar eventos para os filtros de cartão de crédito
    const filtrosCartao = document.querySelectorAll('#filtroCartao, #filtroMesCartao, #filtroAnoCartao');
    
    filtrosCartao.forEach(filtro => {
        filtro.addEventListener('change', function() {
            const filtrosAtuais = {
                cartaoId: document.getElementById('filtroCartao').value,
                mes: document.getElementById('filtroMesCartao').value,
                ano: document.getElementById('filtroAnoCartao').value
            };
            
            // Filtrar compras no cartão
            if (typeof window.creditCardController !== 'undefined') {
                const comprasFiltradas = window.creditCardController.filtrarComprasCartao(filtrosAtuais);
                const resumo = window.creditCardController.calcularResumoCartao(filtrosAtuais.cartaoId, filtrosAtuais.mes, filtrosAtuais.ano);
                const categorias = window.creditCardController.agruparComprasPorCategoria(comprasFiltradas);
                
                // Atualizar interface com os resultados filtrados
                // Esta parte seria implementada para atualizar a interface
            }
        });
    });
    
    // Configurar eventos para os filtros de investimentos
    const filtrosInvestimentos = document.querySelectorAll('#filtroTipoInvestimento, #filtroRentabilidade, #filtroPeriodo');
    
    filtrosInvestimentos.forEach(filtro => {
        filtro.addEventListener('change', function() {
            const filtrosAtuais = {
                tipo: document.getElementById('filtroTipoInvestimento').value,
                rentabilidade: document.getElementById('filtroRentabilidade').value,
                periodo: document.getElementById('filtroPeriodo').value
            };
            
            // Filtrar investimentos
            if (typeof window.investmentController !== 'undefined') {
                const investimentosFiltrados = window.investmentController.filtrarInvestimentos(filtrosAtuais);
                
                // Atualizar interface com os resultados filtrados
                // Esta parte seria implementada para atualizar a interface
            }
        });
    });
}

// Exportar funções para uso em outros módulos
window.appController = {
    initializeApplication,
    updateActiveSection,
    updateDashboard,
    updateTransacoes,
    updateCartao,
    updateInvestimentos,
    updateRelatorios
};
