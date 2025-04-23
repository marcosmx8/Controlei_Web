/**
 * Credit Card Controller
 * Responsável pelo gerenciamento de cartões de crédito e faturas
 */

class CreditCardController {
    constructor() {
        this.cards = [];
        this.purchases = [];
        this.initializeEventListeners();
        this.loadSampleData();
    }
    
    initializeEventListeners() {
        // Remover filtro por categoria conforme solicitado pelo usuário
        const categoryFilterContainer = document.querySelector('#cartao .filter-section .col-md-3:nth-child(4)');
        if (categoryFilterContainer) {
            categoryFilterContainer.remove();
            
            // Ajustar largura dos filtros restantes
            const remainingFilters = document.querySelectorAll('#cartao .filter-section .col-md-3');
            remainingFilters.forEach(filter => {
                filter.className = 'col-md-4';
            });
        }
        
        // Filtros
        document.getElementById('filtroCartao')?.addEventListener('change', () => this.filterPurchases());
        document.getElementById('filtroMesCartao')?.addEventListener('change', () => this.filterPurchases());
        document.getElementById('filtroAnoCartao')?.addEventListener('change', () => this.filterPurchases());
        
        // Formulários
        document.getElementById('btnSalvarCompra')?.addEventListener('click', () => this.savePurchase());
        document.getElementById('btnSalvarCartao')?.addEventListener('click', () => this.saveCard());
        
        // Mostrar/esconder campo de dia de cobrança para gastos recorrentes
        document.getElementById('recorrenteCompra')?.addEventListener('change', (e) => {
            const diaCobrancaDiv = document.getElementById('diaCobrancaDiv');
            if (diaCobrancaDiv) {
                diaCobrancaDiv.style.display = e.target.checked ? 'block' : 'none';
            }
        });
        
        // Abas de detalhamento da fatura
        document.querySelectorAll('#faturaTab button')?.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = e.target.getAttribute('data-bs-target');
                
                // Remover classe active de todas as abas e conteúdos
                document.querySelectorAll('#faturaTab button').forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                document.querySelectorAll('#faturaTabContent .tab-pane').forEach(pane => {
                    pane.classList.remove('show', 'active');
                });
                
                // Adicionar classe active à aba clicada e seu conteúdo
                e.target.classList.add('active');
                e.target.setAttribute('aria-selected', 'true');
                document.querySelector(tabId)?.classList.add('show', 'active');
            });
        });
        
        // Adicionar nova aba "Resumo Geral" conforme solicitado pelo usuário
        this.addGeneralSummaryTab();
    }
    
    addGeneralSummaryTab() {
        // Adicionar botão da aba
        const tabList = document.getElementById('faturaTab');
        if (tabList) {
            const resumoTab = document.createElement('li');
            resumoTab.className = 'nav-item';
            resumoTab.setAttribute('role', 'presentation');
            resumoTab.innerHTML = `
                <button class="nav-link" id="resumo-tab" data-bs-toggle="tab" data-bs-target="#resumo" 
                        type="button" role="tab" aria-controls="resumo" aria-selected="false">
                    Resumo Geral
                </button>
            `;
            tabList.appendChild(resumoTab);
            
            // Adicionar conteúdo da aba
            const tabContent = document.getElementById('faturaTabContent');
            if (tabContent) {
                const resumoPane = document.createElement('div');
                resumoPane.className = 'tab-pane fade';
                resumoPane.id = 'resumo';
                resumoPane.setAttribute('role', 'tabpanel');
                resumoPane.setAttribute('aria-labelledby', 'resumo-tab');
                resumoPane.innerHTML = `
                    <div class="table-responsive mt-3">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Tipo</th>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Categoria</th>
                                    <th>Valor</th>
                                    <th>Parcelas</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="resumoTableBody">
                            </tbody>
                        </table>
                    </div>
                `;
                tabContent.appendChild(resumoPane);
                
                // Adicionar event listener para o botão da aba
                resumoTab.querySelector('button').addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Remover classe active de todas as abas e conteúdos
                    document.querySelectorAll('#faturaTab button').forEach(btn => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-selected', 'false');
                    });
                    document.querySelectorAll('#faturaTabContent .tab-pane').forEach(pane => {
                        pane.classList.remove('show', 'active');
                    });
                    
                    // Adicionar classe active à aba clicada e seu conteúdo
                    e.target.classList.add('active');
                    e.target.setAttribute('aria-selected', 'true');
                    resumoPane.classList.add('show', 'active');
                    
                    // Atualizar conteúdo do resumo
                    this.updateGeneralSummary();
                });
            }
        }
    }
    
    updateGeneralSummary() {
        const tbody = document.getElementById('resumoTableBody');
        if (!tbody) return;
        
        // Limpar conteúdo atual
        tbody.innerHTML = '';
        
        // Filtrar compras pelo cartão, mês e ano selecionados
        const cardId = document.getElementById('filtroCartao')?.value;
        const month = parseInt(document.getElementById('filtroMesCartao')?.value);
        const year = parseInt(document.getElementById('filtroAnoCartao')?.value);
        
        let filteredPurchases = [...this.purchases];
        
        // Filtrar por cartão
        if (cardId && cardId !== 'todos') {
            filteredPurchases = filteredPurchases.filter(p => p.cardId === parseInt(cardId));
        }
        
        // Filtrar por mês e ano
        if (!isNaN(month) && !isNaN(year)) {
            filteredPurchases = filteredPurchases.filter(p => {
                const date = new Date(p.date);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
        }
        
        // Agrupar compras por tipo
        const regularPurchases = filteredPurchases.filter(p => p.installments === 1 && !p.isRecurring);
        const installmentPurchases = filteredPurchases.filter(p => p.installments > 1);
        const recurringPurchases = filteredPurchases.filter(p => p.isRecurring);
        
        // Adicionar cabeçalho para compras regulares
        if (regularPurchases.length > 0) {
            const header = document.createElement('tr');
            header.className = 'table-primary';
            header.innerHTML = `<td colspan="7"><strong>Compras do Mês</strong></td>`;
            tbody.appendChild(header);
            
            // Adicionar compras regulares
            regularPurchases.forEach(purchase => {
                const row = this.createSummaryRow(purchase, 'regular');
                tbody.appendChild(row);
            });
        }
        
        // Adicionar cabeçalho para compras parceladas
        if (installmentPurchases.length > 0) {
            const header = document.createElement('tr');
            header.className = 'table-warning';
            header.innerHTML = `<td colspan="7"><strong>Compras Parceladas</strong></td>`;
            tbody.appendChild(header);
            
            // Adicionar compras parceladas
            installmentPurchases.forEach(purchase => {
                const row = this.createSummaryRow(purchase, 'installment');
                tbody.appendChild(row);
            });
        }
        
        // Adicionar cabeçalho para gastos recorrentes
        if (recurringPurchases.length > 0) {
            const header = document.createElement('tr');
            header.className = 'table-info';
            header.innerHTML = `<td colspan="7"><strong>Gastos Recorrentes</strong></td>`;
            tbody.appendChild(header);
            
            // Adicionar gastos recorrentes
            recurringPurchases.forEach(purchase => {
                const row = this.createSummaryRow(purchase, 'recurring');
                tbody.appendChild(row);
            });
        }
        
        // Se não houver compras
        if (filteredPurchases.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="7" class="text-center">Nenhuma compra encontrada</td>`;
            tbody.appendChild(emptyRow);
        }
    }
    
    createSummaryRow(purchase, type) {
        const row = document.createElement('tr');
        
        // Formatar data
        const date = new Date(purchase.date);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        // Determinar tipo
        let typeText = '';
        switch (type) {
            case 'regular':
                typeText = 'Compra';
                break;
            case 'installment':
                typeText = 'Parcelada';
                break;
            case 'recurring':
                typeText = 'Recorrente';
                break;
        }
        
        // Formatar parcelas
        let installmentText = '';
        if (type === 'installment') {
            installmentText = `${purchase.currentInstallment}/${purchase.installments}`;
        } else if (type === 'recurring') {
            installmentText = 'Mensal';
        } else {
            installmentText = '1/1';
        }
        
        // Determinar status
        let statusText = purchase.isPaid ? 'Pago' : 'Pendente';
        let statusClass = purchase.isPaid ? 'bg-success' : 'bg-warning';
        
        row.innerHTML = `
            <td>${typeText}</td>
            <td>${formattedDate}</td>
            <td>${purchase.description}</td>
            <td>${purchase.category}</td>
            <td>R$ ${purchase.amount.toFixed(2).replace('.', ',')}</td>
            <td>${installmentText}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
        `;
        
        return row;
    }
    
    loadSampleData() {
        // Dados de exemplo para cartões
        this.cards = [
            {
                id: 1,
                name: 'Nubank',
                bank: 'Nubank',
                limit: 10000.00,
                closingDay: 3,
                dueDay: 10,
                color: '#8A05BE'
            },
            {
                id: 2,
                name: 'Itaú',
                bank: 'Itaú',
                limit: 8000.00,
                closingDay: 5,
                dueDay: 12,
                color: '#FF7200'
            }
        ];
        
        // Dados de exemplo para compras
        this.purchases = [
            {
                id: 1,
                cardId: 1,
                date: '2025-04-22',
                description: 'Amazon',
                category: 'Compras Online',
                amount: 350.00,
                installments: 3,
                currentInstallment: 1,
                isRecurring: false,
                isPaid: false
            },
            {
                id: 2,
                cardId: 1,
                date: '2025-04-18',
                description: 'Supermercado Extra',
                category: 'Alimentação',
                amount: 280.00,
                installments: 1,
                currentInstallment: 1,
                isRecurring: false,
                isPaid: false
            },
            {
                id: 3,
                cardId: 1,
                date: '2025-04-15',
                description: 'Netflix',
                category: 'Assinaturas',
                amount: 55.90,
                installments: 1,
                currentInstallment: 1,
                isRecurring: true,
                billingDay: 15,
                isPaid: false
            }
        ];
        
        this.updateCardSummary();
        this.updateCategoryChart();
        this.updateBillEvolutionChart();
        this.updatePurchasesTables();
    }
    
    filterPurchases() {
        this.updateCardSummary();
        this.updateCategoryChart();
        this.updatePurchasesTables();
    }
    
    updateCardSummary() {
        // Obter cartão, mês e ano selecionados
        const cardId = document.getElementById('filtroCartao')?.value;
        const month = parseInt(document.getElementById('filtroMesCartao')?.value);
        const year = parseInt(document.getElementById('filtroAnoCartao')?.value);
        
        // Filtrar compras
        let filteredPurchases = [...this.purchases];
        
        // Filtrar por cartão
        if (cardId && cardId !== 'todos') {
            filteredPurchases = filteredPurchases.filter(p => p.cardId === parseInt(cardId));
        }
        
        // Filtrar por mês e ano
        if (!isNaN(month) && !isNaN(year)) {
            filteredPurchases = filteredPurchases.filter(p => {
                const date = new Date(p.date);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
        }
        
        // Calcular valores
        const currentBill = filteredPurchases.reduce((sum, p) => sum + p.amount, 0);
        const installmentFuture = filteredPurchases
            .filter(p => p.installments > 1)
            .reduce((sum, p) => sum + (p.amount * (p.installments - p.currentInstallment)), 0);
        const recurring = filteredPurchases
            .filter(p => p.isRecurring)
            .reduce((sum, p) => sum + p.amount, 0);
        
        // Obter limite do cartão selecionado
        let totalLimit = 0;
        let availableLimit = 0;
        
        if (cardId && cardId !== 'todos') {
            const card = this.cards.find(c => c.id === parseInt(cardId));
            if (card) {
                totalLimit = card.limit;
                availableLimit = card.limit - currentBill;
            }
        } else {
            // Se "Todos" estiver selecionado, somar limites de todos os cartões
            totalLimit = this.cards.reduce((sum, c) => sum + c.limit, 0);
            availableLimit = totalLimit - currentBill;
        }
        
        // Atualizar cards
        document.querySelector('#cartao .card:nth-child(1) .card-value').textContent = `R$ ${currentBill.toFixed(2).replace('.', ',')}`;
        document.querySelector('#cartao .card:nth-child(2) .card-value').textContent = `R$ ${availableLimit.toFixed(2).replace('.', ',')}`;
        document.querySelector('#cartao .card:nth-child(2) .card-text').textContent = `Limite Total: R$ ${totalLimit.toFixed(2).replace('.', ',')}`;
        document.querySelector('#cartao .card:nth-child(3) .card-value').textContent = `R$ ${installmentFuture.toFixed(2).replace('.', ',')}`;
        document.querySelector('#cartao .card:nth-child(4) .card-value').textContent = `R$ ${recurring.toFixed(2).replace('.', ',')}`;
        
        // Atualizar data de vencimento
        if (cardId && cardId !== 'todos') {
            const card = this.cards.find(c => c.id === parseInt(cardId));
            if (card) {
                const dueDate = new Date(year, month - 1, card.dueDay);
                const formattedDueDate = `${dueDate.getDate().toString().padStart(2, '0')}/${(dueDate.getMonth() + 1).toString().padStart(2, '0')}/${dueDate.getFullYear()}`;
                document.querySelector('#cartao .card:nth-child(1) .card-text').textContent = `Vencimento: ${formattedDueDate}`;
            }
        } else {
            document.querySelector('#cartao .card:nth-child(1) .card-text').textContent = `Vencimento: Vários`;
        }
        
        // Atualizar contagem de parcelas futuras
        const installmentCount = filteredPurchases
            .filter(p => p.installments > 1)
            .reduce((sum, p) => sum + (p.installments - p.currentInstallment), 0);
        document.querySelector('#cartao .card:nth-child(3) .card-text').textContent = `Em ${installmentCount} parcelas futuras`;
        
        // Atualizar contagem de assinaturas ativas
        const recurringCount = filteredPurchases.filter(p => p.isRecurring).length;
        document.querySelector('#cartao .card:nth-child(4) .card-text').textContent = `${recurringCount} assinatura${recurringCount !== 1 ? 's' : ''} ativa${recurringCount !== 1 ? 's' : ''}`;
    }
    
    updateCategoryChart() {
        // Obter cartão, mês e ano selecionados
        const cardId = document.getElementById('filtroCartao')?.value;
        const month = parseInt(document.getElementById('filtroMesCartao')?.value);
        const year = parseInt(document.getElementById('filtroAnoCartao')?.value);
        
        // Filtrar compras
        let filteredPurchases = [...this.purchases];
        
        // Filtrar por cartão
        if (cardId && cardId !== 'todos') {
            filteredPurchases = filteredPurchases.filter(p => p.cardId === parseInt(cardId));
        }
        
        // Filtrar por mês e ano
        if (!isNaN(month) && !isNaN(year)) {
            filteredPurchases = filteredPurchases.filter(p => {
                const date = new Date(p.date);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
        }
        
        // Agrupar por categoria
        const categorySums = {};
        filteredPurchases.forEach(purchase => {
            if (!categorySums[purchase.category]) {
                categorySums[purchase.category] = 0;
            }
            categorySums[purchase.category] += purchase.amount;
        });
        
        // Preparar dados para o gráfico
        const categories = Object.keys(categorySums);
        const values = Object.values(categorySums);
        const total = values.reduce((sum, value) => sum + value, 0);
        
        // Calcular percentuais
        const percentages = values.map(value => ((value / total) * 100).toFixed(1));
        
        // Cores para as categorias
        const colors = [
            '#f39c12', // Laranja - Alimentação
            '#3498db', // Azul - Compras Online
            '#9b59b6', // Roxo - Assinaturas
            '#2ecc71', // Verde - Transporte
            '#e74c3c', // Vermelho - Saúde
            '#95a5a6'  // Cinza - Outros
        ];
        
        // Obter contexto do canvas
        const ctx = document.getElementById('cartaoCategoriaChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destruir gráfico existente se houver
        if (window.cartaoCategoriaChart) {
            window.cartaoCategoriaChart.destroy();
        }
        
        // Criar gráfico
        window.cartaoCategoriaChart = new Chart(ctx, {
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
    
    updateBillEvolutionChart() {
        // Dados de exemplo para evolução da fatura
        const months = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'];
        const billValues = [1500, 1800, 1650, 1700, 1600, 1850];
        const limitValues = Array(months.length).fill(10000);
        
        // Obter contexto do canvas
        const ctx = document.getElementById('evolucaoFaturaChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destruir gráfico existente se houver
        if (window.evolucaoFaturaChart) {
            window.evolucaoFaturaChart.destroy();
        }
        
        // Criar gráfico
        window.evolucaoFaturaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Valor da Fatura',
                        data: billValues,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Limite',
                        data: limitValues,
                        borderColor: '#3498db',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
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
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return `${label}: R$ ${value.toFixed(2).replace('.', ',')}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    updatePurchasesTables() {
        // Obter cartão, mês e ano selecionados
        const cardId = document.getElementById('filtroCartao')?.value;
        const month = parseInt(document.getElementById('filtroMesCartao')?.value);
        const year = parseInt(document.getElementById('filtroAnoCartao')?.value);
        
        // Filtrar compras
        let filteredPurchases = [...this.purchases];
        
        // Filtrar por cartão
        if (cardId && cardId !== 'todos') {
            filteredPurchases = filteredPurchases.filter(p => p.cardId === parseInt(cardId));
        }
        
        // Filtrar por mês e ano
        if (!isNaN(month) && !isNaN(year)) {
            filteredPurchases = filteredPurchases.filter(p => {
                const date = new Date(p.date);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
        }
        
        // Atualizar tabela de compras do mês
        const regularPurchases = filteredPurchases.filter(p => p.installments === 1 && !p.isRecurring);
        const regularTable = document.querySelector('#compras tbody');
        if (regularTable) {
            regularTable.innerHTML = '';
            
            if (regularPurchases.length === 0) {
                regularTable.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma compra encontrada</td></tr>';
            } else {
                regularPurchases.forEach(purchase => {
                    const date = new Date(purchase.date);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${purchase.description}</td>
                        <td>${purchase.category}</td>
                        <td>R$ ${purchase.amount.toFixed(2).replace('.', ',')}</td>
                        <td>1/1</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    `;
                    regularTable.appendChild(row);
                });
            }
        }
        
        // Atualizar tabela de compras parceladas
        const installmentPurchases = filteredPurchases.filter(p => p.installments > 1);
        const installmentTable = document.querySelector('#parceladas tbody');
        if (installmentTable) {
            installmentTable.innerHTML = '';
            
            if (installmentPurchases.length === 0) {
                installmentTable.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma compra parcelada encontrada</td></tr>';
            } else {
                installmentPurchases.forEach(purchase => {
                    const date = new Date(purchase.date);
                    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                    const totalAmount = purchase.amount * purchase.installments;
                    
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${formattedDate}</td>
                        <td>${purchase.description}</td>
                        <td>R$ ${totalAmount.toFixed(2).replace('.', ',')}</td>
                        <td>R$ ${purchase.amount.toFixed(2).replace('.', ',')}</td>
                        <td>${purchase.currentInstallment}/${purchase.installments}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    `;
                    installmentTable.appendChild(row);
                });
            }
        }
        
        // Atualizar tabela de gastos recorrentes
        const recurringPurchases = filteredPurchases.filter(p => p.isRecurring);
        const recurringTable = document.querySelector('#recorrentes tbody');
        if (recurringTable) {
            recurringTable.innerHTML = '';
            
            if (recurringPurchases.length === 0) {
                recurringTable.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum gasto recorrente encontrado</td></tr>';
            } else {
                recurringPurchases.forEach(purchase => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${purchase.description}</td>
                        <td>${purchase.category}</td>
                        <td>R$ ${purchase.amount.toFixed(2).replace('.', ',')}</td>
                        <td>${purchase.billingDay || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary"><i class="bi bi-pencil"></i></button>
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </td>
                    `;
                    recurringTable.appendChild(row);
                });
            }
        }
        
        // Atualizar resumo geral se a aba estiver ativa
        if (document.querySelector('#resumo.active')) {
            this.updateGeneralSummary();
        }
    }
    
    savePurchase() {
        // Obter valores do formulário
        const cardId = parseInt(document.getElementById('cartaoCompra').value);
        const date = document.getElementById('dataCompra').value;
        const description = document.getElementById('descricaoCompra').value;
        const category = document.getElementById('categoriaCompra').options[document.getElementById('categoriaCompra').selectedIndex].text;
        const amount = parseFloat(document.getElementById('valorCompra').value);
        const installments = parseInt(document.getElementById('parcelasCompra').value);
        const isRecurring = document.getElementById('recorrenteCompra').checked;
        const billingDay = isRecurring ? parseInt(document.getElementById('diaCobranca').value) : null;
        const notes = document.getElementById('observacaoCompra').value;
        
        // Validar campos obrigatórios
        if (!cardId || !date || !description || !category || isNaN(amount) || isNaN(installments)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Criar nova compra
        const newPurchase = {
            id: this.purchases.length > 0 ? Math.max(...this.purchases.map(p => p.id)) + 1 : 1,
            cardId,
            date,
            description,
            category,
            amount,
            installments,
            currentInstallment: 1,
            isRecurring,
            billingDay,
            isPaid: false,
            notes
        };
        
        // Adicionar à lista
        this.purchases.push(newPurchase);
        
        // Atualizar visualização
        this.updateCardSummary();
        this.updateCategoryChart();
        this.updatePurchasesTables();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovaCompraCartao'));
        modal.hide();
        
        // Limpar formulário
        document.getElementById('formNovaCompraCartao').reset();
        document.getElementById('diaCobrancaDiv').style.display = 'none';
    }
    
    saveCard() {
        // Obter valores do formulário
        const name = document.getElementById('nomeCartao').value;
        const bank = document.getElementById('bancoCartao').value;
        const limit = parseFloat(document.getElementById('limiteCartao').value);
        const closingDay = parseInt(document.getElementById('diaFechamento').value);
        const dueDay = parseInt(document.getElementById('diaVencimento').value);
        const color = document.getElementById('corCartao').value;
        
        // Validar campos obrigatórios
        if (!name || !bank || isNaN(limit) || isNaN(closingDay) || isNaN(dueDay)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Criar novo cartão
        const newCard = {
            id: this.cards.length > 0 ? Math.max(...this.cards.map(c => c.id)) + 1 : 1,
            name,
            bank,
            limit,
            closingDay,
            dueDay,
            color
        };
        
        // Adicionar à lista
        this.cards.push(newCard);
        
        // Atualizar select de cartões
        const cardSelect = document.getElementById('filtroCartao');
        if (cardSelect) {
            const option = document.createElement('option');
            option.value = newCard.id;
            option.textContent = newCard.name;
            cardSelect.appendChild(option);
        }
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoCartao'));
        modal.hide();
        
        // Limpar formulário
        document.getElementById('formNovoCartao').reset();
    }
}

// Inicializar controlador
document.addEventListener('DOMContentLoaded', () => {
    const creditCardController = new CreditCardController();
});
