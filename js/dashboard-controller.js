/**
 * Dashboard Controller
 * Responsável pelo gerenciamento do dashboard e gráficos principais
 */

class DashboardController {
    constructor() {
        this.currentMonth = new Date().getMonth() + 1;
        this.currentYear = new Date().getFullYear();
        this.initializeEventListeners();
        this.loadDashboardData();
    }
    
    initializeEventListeners() {
        // Adicionar filtros de competência no Dashboard
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-section row mb-4';
        filterContainer.innerHTML = `
            <div class="col-md-3">
                <label for="filtroDashMes" class="form-label">Mês</label>
                <select class="form-select" id="filtroDashMes">
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4" selected>Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
            </div>
            <div class="col-md-3">
                <label for="filtroDashAno" class="form-label">Ano</label>
                <select class="form-select" id="filtroDashAno">
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025" selected>2025</option>
                </select>
            </div>
        `;
        
        // Inserir filtros no início do Dashboard
        const dashboardSection = document.getElementById('dashboard');
        if (dashboardSection) {
            dashboardSection.insertBefore(filterContainer, dashboardSection.firstChild.nextSibling);
            
            // Adicionar event listeners para os filtros
            document.getElementById('filtroDashMes').addEventListener('change', () => this.updateDashboard());
            document.getElementById('filtroDashAno').addEventListener('change', () => this.updateDashboard());
        }
    }
    
    loadDashboardData() {
        // Dados de exemplo para o dashboard
        this.dashboardData = {
            // Dados financeiros por mês/ano
            financialData: {
                '2025-4': {
                    income: 8500.00,
                    expenses: 3000.00,
                    balance: 5500.00,
                    patrimony: 85750.00,
                    expensesByCategory: {
                        'Moradia': 1200.00,
                        'Alimentação': 850.00,
                        'Transporte': 450.00,
                        'Saúde': 320.00,
                        'Lazer': 180.00
                    },
                    upcomingPayments: [
                        { date: '2025-05-05', description: 'Aluguel', amount: 1200.00 },
                        { date: '2025-05-10', description: 'Fatura Cartão Nubank', amount: 1850.00 },
                        { date: '2025-05-15', description: 'Internet', amount: 150.00 }
                    ],
                    upcomingIncomes: [
                        { date: '2025-05-05', description: 'Salário', amount: 8500.00 },
                        { date: '2025-05-15', description: 'Dividendos PETR4', amount: 180.00 },
                        { date: '2025-05-20', description: 'Rendimento Tesouro', amount: 250.00 }
                    ]
                },
                '2025-3': {
                    income: 8500.00,
                    expenses: 3100.00,
                    balance: 5400.00,
                    patrimony: 83200.00,
                    expensesByCategory: {
                        'Moradia': 1200.00,
                        'Alimentação': 850.00,
                        'Transporte': 450.00,
                        'Saúde': 320.00,
                        'Lazer': 280.00
                    },
                    upcomingPayments: [],
                    upcomingIncomes: []
                },
                '2025-2': {
                    income: 8500.00,
                    expenses: 3250.00,
                    balance: 5250.00,
                    patrimony: 80500.00,
                    expensesByCategory: {
                        'Moradia': 1200.00,
                        'Alimentação': 950.00,
                        'Transporte': 500.00,
                        'Saúde': 350.00,
                        'Lazer': 250.00
                    },
                    upcomingPayments: [],
                    upcomingIncomes: []
                },
                '2025-1': {
                    income: 8000.00,
                    expenses: 3500.00,
                    balance: 4500.00,
                    patrimony: 78000.00,
                    expensesByCategory: {
                        'Moradia': 1200.00,
                        'Alimentação': 1000.00,
                        'Transporte': 550.00,
                        'Saúde': 400.00,
                        'Lazer': 350.00
                    },
                    upcomingPayments: [],
                    upcomingIncomes: []
                }
            },
            
            // Dados de evolução financeira para o gráfico
            financialEvolution: {
                months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                income: [8000, 8500, 8500, 8500, 8500, 8500],
                expenses: [3500, 3250, 3100, 3000, 2900, 2800]
            }
        };
        
        this.updateDashboard();
    }
    
    updateDashboard() {
        const month = parseInt(document.getElementById('filtroDashMes').value);
        const year = parseInt(document.getElementById('filtroDashAno').value);
        const periodKey = `${year}-${month}`;
        
        // Obter dados do período selecionado ou usar dados padrão
        const data = this.dashboardData.financialData[periodKey] || {
            income: 0,
            expenses: 0,
            balance: 0,
            patrimony: 0,
            expensesByCategory: {},
            upcomingPayments: [],
            upcomingIncomes: []
        };
        
        // Atualizar cards de resumo financeiro
        this.updateFinancialSummary(data, month, year);
        
        // Atualizar gráficos
        this.updateCharts(data);
        
        // Atualizar tabelas de próximos pagamentos e recebimentos
        this.updateUpcomingTransactions(data);
    }
    
    updateFinancialSummary(data, month, year) {
        // Obter elementos dos cards
        const balanceCard = document.querySelector('#dashboard .card-value.text-success');
        const incomeCard = document.querySelector('#dashboard .card-value.text-primary');
        const expensesCard = document.querySelector('#dashboard .card-value.text-danger');
        const patrimonyCard = document.querySelector('#dashboard .card-value.text-info');
        
        // Atualizar valores
        if (balanceCard) balanceCard.textContent = `R$ ${data.balance.toFixed(2).replace('.', ',')}`;
        if (incomeCard) incomeCard.textContent = `R$ ${data.income.toFixed(2).replace('.', ',')}`;
        if (expensesCard) expensesCard.textContent = `R$ ${data.expenses.toFixed(2).replace('.', ',')}`;
        if (patrimonyCard) patrimonyCard.textContent = `R$ ${data.patrimony.toFixed(2).replace('.', ',')}`;
        
        // Atualizar período nos cards
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const monthName = monthNames[month - 1];
        
        const balanceCardText = document.querySelector('#dashboard .card:nth-child(1) .card-text');
        const incomeCardText = document.querySelector('#dashboard .card:nth-child(2) .card-text');
        const expensesCardText = document.querySelector('#dashboard .card:nth-child(3) .card-text');
        
        if (balanceCardText) balanceCardText.textContent = `${monthName} ${year}`;
        if (incomeCardText) incomeCardText.textContent = `${monthName} ${year}`;
        if (expensesCardText) expensesCardText.textContent = `${monthName} ${year}`;
    }
    
    updateCharts(data) {
        // Atualizar gráfico de despesas por categoria
        this.updateExpensesByCategoryChart(data.expensesByCategory);
        
        // Atualizar gráfico de evolução financeira
        // Nota: Este gráfico mostra dados de vários meses, então não é afetado pelo filtro de mês
    }
    
    updateExpensesByCategoryChart(expensesByCategory) {
        // Obter contexto do canvas
        const ctx = document.getElementById('despesasCategoriaChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destruir gráfico existente se houver
        if (window.expensesByCategoryChart) {
            window.expensesByCategoryChart.destroy();
        }
        
        // Preparar dados para o gráfico
        const categories = Object.keys(expensesByCategory);
        const values = Object.values(expensesByCategory);
        const total = values.reduce((sum, value) => sum + value, 0);
        
        // Calcular percentuais
        const percentages = values.map(value => ((value / total) * 100).toFixed(1));
        
        // Cores para as categorias
        const colors = [
            '#3498db', // Azul - Moradia
            '#2ecc71', // Verde - Alimentação
            '#f39c12', // Laranja - Transporte
            '#e74c3c', // Vermelho - Saúde
            '#9b59b6', // Roxo - Lazer
            '#95a5a6'  // Cinza - Outros
        ];
        
        // Criar gráfico
        window.expensesByCategoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: values,
                    backgroundColor: colors.slice(0, categories.length),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map(function(label, i) {
                                        const meta = chart.getDatasetMeta(0);
                                        const style = meta.controller.getStyle(i);
                                        const value = data.datasets[0].data[i];
                                        const percentage = percentages[i];
                                        
                                        return {
                                            text: `${label} (${percentage}%)`,
                                            fillStyle: style.backgroundColor,
                                            strokeStyle: style.borderColor,
                                            lineWidth: style.borderWidth,
                                            hidden: isNaN(value) || meta.data[i].hidden,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = percentages[context.dataIndex];
                                return `${label}: R$ ${value.toFixed(2).replace('.', ',')} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    updateUpcomingTransactions(data) {
        // Atualizar tabela de próximos pagamentos
        const paymentsTable = document.querySelector('#dashboard .card:nth-child(5) tbody');
        if (paymentsTable) {
            paymentsTable.innerHTML = '';
            
            if (data.upcomingPayments.length === 0) {
                paymentsTable.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum pagamento próximo</td></tr>';
            } else {
                data.upcomingPayments.forEach(payment => {
                    const date = new Date(payment.date);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${payment.description}</td>
                        <td>R$ ${payment.amount.toFixed(2).replace('.', ',')}</td>
                    `;
                    paymentsTable.appendChild(row);
                });
            }
        }
        
        // Atualizar tabela de próximos recebimentos
        const incomesTable = document.querySelector('#dashboard .card:nth-child(6) tbody');
        if (incomesTable) {
            incomesTable.innerHTML = '';
            
            if (data.upcomingIncomes.length === 0) {
                incomesTable.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum recebimento próximo</td></tr>';
            } else {
                data.upcomingIncomes.forEach(income => {
                    const date = new Date(income.date);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${income.description}</td>
                        <td>R$ ${income.amount.toFixed(2).replace('.', ',')}</td>
                    `;
                    incomesTable.appendChild(row);
                });
            }
        }
    }
}

// Inicializar controlador
document.addEventListener('DOMContentLoaded', () => {
    const dashboardController = new DashboardController();
});
