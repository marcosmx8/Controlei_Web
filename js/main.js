// Funcionalidades principais do Planner Financeiro
document.addEventListener('DOMContentLoaded', function() {
    // Navegação entre seções
    setupNavigation();
    
    // Inicializar gráficos
    initializeCharts();
    
    // Configurar sistema de categorias expansíveis
    setupExpandableCategories();
});

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
            document.getElementById(targetId).classList.add('active');
        });
    });
}

// Inicialização dos gráficos
function initializeCharts() {
    // Gráfico de Despesas por Categoria
    const despesasCategoriaCtx = document.getElementById('despesasCategoriaChart').getContext('2d');
    const despesasCategoriaChart = new Chart(despesasCategoriaCtx, {
        type: 'doughnut',
        data: {
            labels: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Outros'],
            datasets: [{
                data: [1200, 850, 450, 320, 280, 150],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c',
                    '#9b59b6',
                    '#95a5a6'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
    
    // Gráfico de Evolução Financeira
    const evolucaoFinanceiraCtx = document.getElementById('evolucaoFinanceiraChart').getContext('2d');
    const evolucaoFinanceiraChart = new Chart(evolucaoFinanceiraCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            datasets: [
                {
                    label: 'Receitas',
                    data: [7500, 7800, 8200, 8500, 8500, 8500],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Despesas',
                    data: [4200, 3800, 3500, 3250, 3100, 3000],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': R$ ' + context.raw.toLocaleString('pt-BR');
                        }
                    }
                }
            }
        }
    });
}

// Configuração do sistema de categorias expansíveis
function setupExpandableCategories() {
    // Esta função será implementada quando criarmos a seção de transações
    // e categorias expandíveis
    console.log('Sistema de categorias expansíveis será implementado em breve');
}

// Função para filtrar gráficos por categoria
function filterChartByCategory(chartInstance, category) {
    // Esta função será implementada para os filtros dinâmicos
    console.log('Filtro por categoria será implementado em breve');
}

// Função para adicionar nova transação
function addTransaction(data) {
    // Esta função será implementada para o sistema de controle de despesas/receitas
    console.log('Sistema de adição de transações será implementado em breve');
}

// Função para gerenciar cartão de crédito
function manageCreditCard(data) {
    // Esta função será implementada para o sistema de controle de cartão de crédito
    console.log('Sistema de gerenciamento de cartão de crédito será implementado em breve');
}

// Função para gerenciar investimentos
function manageInvestments(data) {
    // Esta função será implementada para o sistema de controle de investimentos
    console.log('Sistema de gerenciamento de investimentos será implementado em breve');
}
