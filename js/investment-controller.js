/**
 * Investment Controller
 * Responsável pelo gerenciamento de investimentos
 */

class InvestmentController {
    constructor() {
        this.investments = [];
        this.categories = {
            'CDI': ['CDB', 'LC', 'LCI', 'LCA'],
            'Tesouro': ['Selic', 'IPCA+', 'Prefixado'],
            'Ações': ['Dividendos', 'Crescimento', 'Small Caps', 'Value'],
            'Fundos': ['Imobiliários', 'Multimercado', 'Ações', 'Renda Fixa'],
            'Outros': ['Criptomoedas', 'Ouro', 'Poupança', 'Previdência']
        };
        
        this.dataSources = {
            'Ações': {
                'B3': 'https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/',
                'Yahoo Finance': 'https://finance.yahoo.com/',
                'Investing.com': 'https://br.investing.com/'
            },
            'Fundos': {
                'CVM': 'https://dados.cvm.gov.br/',
                'Anbima': 'https://www.anbima.com.br/'
            },
            'Tesouro': {
                'Tesouro Direto': 'https://www.tesourodireto.com.br/'
            },
            'CDI': {
                'B3': 'https://www.b3.com.br/pt_br/market-data-e-indices/indices/indices-de-segmentos-e-setoriais/indice-de-commodities-brasil-icb.htm',
                'Banco Central': 'https://www.bcb.gov.br/'
            },
            'Outros': {
                'CoinMarketCap': 'https://coinmarketcap.com/',
                'Banco Central': 'https://www.bcb.gov.br/'
            }
        };
        
        this.initializeEventListeners();
        this.loadSampleData();
    }
    
    initializeEventListeners() {
        // Filtros
        document.getElementById('filtroTipoInvestimento')?.addEventListener('change', () => this.filterInvestments());
        
        // Formulário de novo investimento
        document.getElementById('btnSalvarInvestimento')?.addEventListener('click', () => this.saveInvestment());
        
        // Atualizar subcategorias quando categoria é selecionada
        document.getElementById('categoriaInvestimento')?.addEventListener('change', (e) => {
            this.updateSubcategoryOptions(e.target.value);
        });
        
        // Adicionar event listeners para detalhamento de investimentos
        document.querySelectorAll('.investment-item')?.forEach(item => {
            item.addEventListener('click', (e) => {
                const investmentId = e.currentTarget.getAttribute('data-id');
                this.showInvestmentDetails(investmentId);
            });
        });
    }
    
    updateSubcategoryOptions(category) {
        const subcategorySelect = document.getElementById('subcategoriaInvestimento');
        if (!subcategorySelect) return;
        
        // Limpar opções atuais
        subcategorySelect.innerHTML = '<option value="">Selecione...</option>';
        
        // Adicionar subcategorias apropriadas
        const subcategories = this.categories[category] || [];
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }
    
    loadSampleData() {
        // Dados de exemplo para investimentos
        this.investments = [
            {
                id: 1,
                name: 'PETR4',
                category: 'Ações',
                subcategory: 'Dividendos',
                institution: 'XP Investimentos',
                purchaseDate: '2024-10-15',
                quantity: 100,
                purchasePrice: 28.50,
                currentPrice: 32.75,
                totalInvested: 2850.00,
                currentValue: 3275.00,
                profitability: 14.91,
                notes: 'Ações da Petrobras'
            },
            {
                id: 2,
                name: 'Tesouro Selic 2026',
                category: 'Tesouro',
                subcategory: 'Selic',
                institution: 'Banco do Brasil',
                purchaseDate: '2024-08-20',
                quantity: 1,
                purchasePrice: 10000.00,
                currentPrice: 10450.00,
                totalInvested: 10000.00,
                currentValue: 10450.00,
                profitability: 4.50,
                notes: 'Tesouro Selic com vencimento em 2026'
            },
            {
                id: 3,
                name: 'CDB Banco Inter',
                category: 'CDI',
                subcategory: 'CDB',
                institution: 'Banco Inter',
                purchaseDate: '2024-11-05',
                quantity: 1,
                purchasePrice: 5000.00,
                currentPrice: 5175.00,
                totalInvested: 5000.00,
                currentValue: 5175.00,
                profitability: 3.50,
                notes: 'CDB com 110% do CDI'
            },
            {
                id: 4,
                name: 'HGLG11',
                category: 'Fundos',
                subcategory: 'Imobiliários',
                institution: 'XP Investimentos',
                purchaseDate: '2024-09-10',
                quantity: 50,
                purchasePrice: 120.00,
                currentPrice: 125.50,
                totalInvested: 6000.00,
                currentValue: 6275.00,
                profitability: 4.58,
                notes: 'FII CSHG Logística'
            },
            {
                id: 5,
                name: 'Bitcoin',
                category: 'Outros',
                subcategory: 'Criptomoedas',
                institution: 'Binance',
                purchaseDate: '2024-07-15',
                quantity: 0.05,
                purchasePrice: 50000.00,
                currentPrice: 60000.00,
                totalInvested: 2500.00,
                currentValue: 3000.00,
                profitability: 20.00,
                notes: 'Bitcoin como reserva de valor'
            }
        ];
        
        this.renderInvestments();
        this.updateInvestmentSummary();
        this.updateAllocationChart();
        this.updatePerformanceChart();
    }
    
    filterInvestments() {
        const type = document.getElementById('filtroTipoInvestimento').value;
        
        let filteredInvestments = [...this.investments];
        
        // Filtrar por tipo
        if (type !== 'todos') {
            filteredInvestments = filteredInvestments.filter(investment => 
                investment.category === type
            );
        }
        
        this.renderInvestments(filteredInvestments);
        this.updateInvestmentSummary(filteredInvestments);
        this.updateAllocationChart(filteredInvestments);
    }
    
    renderInvestments(investments = this.investments) {
        const container = document.querySelector('#investimentos .investment-list');
        if (!container) return;
        
        // Limpar conteúdo atual
        container.innerHTML = '';
        
        // Agrupar investimentos por categoria
        const groupedInvestments = {};
        investments.forEach(investment => {
            if (!groupedInvestments[investment.category]) {
                groupedInvestments[investment.category] = [];
            }
            groupedInvestments[investment.category].push(investment);
        });
        
        // Renderizar investimentos agrupados
        Object.keys(groupedInvestments).forEach(category => {
            const categoryInvestments = groupedInvestments[category];
            
            // Criar cabeçalho da categoria
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `
                <h5>${category} <span class="badge bg-primary">${categoryInvestments.length}</span></h5>
            `;
            container.appendChild(categoryHeader);
            
            // Criar lista de investimentos da categoria
            const investmentsList = document.createElement('div');
            investmentsList.className = 'row';
            
            categoryInvestments.forEach(investment => {
                const profitabilityClass = investment.profitability >= 0 ? 'text-success' : 'text-danger';
                const profitabilityIcon = investment.profitability >= 0 ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow';
                
                const investmentCard = document.createElement('div');
                investmentCard.className = 'col-md-4 mb-3';
                investmentCard.innerHTML = `
                    <div class="card investment-item" data-id="${investment.id}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title">${investment.name}</h5>
                                <span class="badge bg-secondary">${investment.subcategory}</span>
                            </div>
                            <p class="card-text">${investment.institution}</p>
                            <div class="d-flex justify-content-between">
                                <div>
                                    <small class="text-muted">Valor Atual:</small>
                                    <p class="mb-0">R$ ${investment.currentValue.toFixed(2).replace('.', ',')}</p>
                                </div>
                                <div class="text-end">
                                    <small class="text-muted">Rentabilidade:</small>
                                    <p class="mb-0 ${profitabilityClass}">
                                        <i class="bi ${profitabilityIcon}"></i> 
                                        ${investment.profitability.toFixed(2).replace('.', ',')}%
                                    </p>
                                </div>
                            </div>
                            <div class="mt-2 text-center">
                                <button class="btn btn-sm btn-outline-primary view-details" data-id="${investment.id}">
                                    Ver Detalhes
                                </button>
                                <a href="#" class="btn btn-sm btn-outline-info ms-1 view-source" data-category="${investment.category}" data-name="${investment.name}">
                                    <i class="bi bi-info-circle"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                investmentsList.appendChild(investmentCard);
            });
            
            container.appendChild(investmentsList);
        });
        
        // Se não houver investimentos
        if (investments.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Nenhum investimento encontrado</div>';
        }
        
        // Adicionar event listeners para botões de detalhes
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const investmentId = e.target.getAttribute('data-id');
                this.showInvestmentDetails(investmentId);
            });
        });
        
        // Adicionar event listeners para botões de fonte
        document.querySelectorAll('.view-source').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const category = e.target.closest('.view-source').getAttribute('data-category');
                const name = e.target.closest('.view-source').getAttribute('data-name');
                this.showDataSources(category, name);
            });
        });
    }
    
    updateInvestmentSummary(investments = this.investments) {
        // Calcular totais
        const totalInvested = investments.reduce((sum, investment) => sum + investment.totalInvested, 0);
        const currentValue = investments.reduce((sum, investment) => sum + investment.currentValue, 0);
        const profit = currentValue - totalInvested;
        const profitPercentage = (profit / totalInvested) * 100;
        
        // Atualizar cards
        document.querySelector('#investimentos .card-value.text-primary').textContent = `R$ ${totalInvested.toFixed(2).replace('.', ',')}`;
        document.querySelector('#investimentos .card-value.text-info').textContent = `R$ ${currentValue.toFixed(2).replace('.', ',')}`;
        
        const profitElement = document.querySelector('#investimentos .card-value.text-success');
        if (profit >= 0) {
            profitElement.textContent = `R$ ${profit.toFixed(2).replace('.', ',')}`;
            profitElement.classList.remove('text-danger');
            profitElement.classList.add('text-success');
        } else {
            profitElement.textContent = `R$ ${Math.abs(profit).toFixed(2).replace('.', ',')}`;
            profitElement.classList.remove('text-success');
            profitElement.classList.add('text-danger');
        }
        
        const percentElement = document.querySelector('#investimentos .card-value.text-success + small');
        if (profitPercentage >= 0) {
            percentElement.textContent = `(+${profitPercentage.toFixed(2).replace('.', ',')}%)`;
            percentElement.classList.remove('text-danger');
            percentElement.classList.add('text-success');
        } else {
            percentElement.textContent = `(${profitPercentage.toFixed(2).replace('.', ',')}%)`;
            percentElement.classList.remove('text-success');
            percentElement.classList.add('text-danger');
        }
    }
    
    updateAllocationChart(investments = this.investments) {
        // Agrupar por categoria
        const categorySums = {};
        investments.forEach(investment => {
            if (!categorySums[investment.category]) {
                categorySums[investment.category] = 0;
            }
            categorySums[investment.category] += investment.currentValue;
        });
        
        // Preparar dados para o gráfico
        const categories = Object.keys(categorySums);
        const values = Object.values(categorySums);
        const total = values.reduce((sum, value) => sum + value, 0);
        
        // Calcular percentuais
        const percentages = values.map(value => ((value / total) * 100).toFixed(1));
        
        // Cores para as categorias
        const colors = [
            '#3498db', // Azul - Ações
            '#2ecc71', // Verde - Tesouro
            '#f39c12', // Laranja - CDI
            '#e74c3c', // Vermelho - Fundos
            '#9b59b6'  // Roxo - Outros
        ];
        
        // Obter contexto do canvas
        const ctx = document.getElementById('alocacaoChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destruir gráfico existente se houver
        if (window.alocacaoChart) {
            window.alocacaoChart.destroy();
        }
        
        // Criar gráfico
        window.alocacaoChart = new Chart(ctx, {
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
    
    updatePerformanceChart() {
        // Dados de exemplo para evolução do patrimônio
        const months = ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr'];
        const patrimonyValues = [25000, 26500, 27800, 28500, 29200, 30000];
        
        // Obter contexto do canvas
        const ctx = document.getElementById('evolucaoPatrimonioChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destruir gráfico existente se houver
        if (window.evolucaoPatrimonioChart) {
            window.evolucaoPatrimonioChart.destroy();
        }
        
        // Criar gráfico
        window.evolucaoPatrimonioChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Patrimônio',
                        data: patrimonyValues,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
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
    
    saveInvestment() {
        // Obter valores do formulário
        const name = document.getElementById('nomeInvestimento').value;
        const category = document.getElementById('categoriaInvestimento').value;
        const subcategory = document.getElementById('subcategoriaInvestimento').value;
        const institution = document.getElementById('instituicaoInvestimento').value;
        const purchaseDate = document.getElementById('dataCompraInvestimento').value;
        const quantity = parseFloat(document.getElementById('quantidadeInvestimento').value);
        const purchasePrice = parseFloat(document.getElementById('precoCompraInvestimento').value);
        const currentPrice = parseFloat(document.getElementById('precoAtualInvestimento').value);
        const notes = document.getElementById('observacaoInvestimento').value;
        
        // Validar campos obrigatórios
        if (!name || !category || !subcategory || !institution || !purchaseDate || isNaN(quantity) || isNaN(purchasePrice) || isNaN(currentPrice)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Calcular valores
        const totalInvested = quantity * purchasePrice;
        const currentValue = quantity * currentPrice;
        const profitability = ((currentValue / totalInvested) - 1) * 100;
        
        // Criar novo investimento
        const newInvestment = {
            id: this.investments.length > 0 ? Math.max(...this.investments.map(i => i.id)) + 1 : 1,
            name,
            category,
            subcategory,
            institution,
            purchaseDate,
            quantity,
            purchasePrice,
            currentPrice,
            totalInvested,
            currentValue,
            profitability,
            notes
        };
        
        // Adicionar à lista
        this.investments.push(newInvestment);
        
        // Atualizar visualização
        this.renderInvestments();
        this.updateInvestmentSummary();
        this.updateAllocationChart();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoInvestimento'));
        modal.hide();
        
        // Limpar formulário
        document.getElementById('formNovoInvestimento').reset();
    }
    
    showInvestmentDetails(investmentId) {
        const investment = this.investments.find(i => i.id === parseInt(investmentId));
        if (!investment) return;
        
        // Criar modal de detalhes
        const modalHtml = `
            <div class="modal fade" id="modalDetalhesInvestimento" tabindex="-1" aria-labelledby="modalDetalhesInvestimentoLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalDetalhesInvestimentoLabel">Detalhes do Investimento: ${investment.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h6>Informações Gerais</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <th>Nome:</th>
                                            <td>${investment.name}</td>
                                        </tr>
                                        <tr>
                                            <th>Categoria:</th>
                                            <td>${investment.category}</td>
                                        </tr>
                                        <tr>
                                            <th>Subcategoria:</th>
                                            <td>${investment.subcategory}</td>
                                        </tr>
                                        <tr>
                                            <th>Instituição:</th>
                                            <td>${investment.institution}</td>
                                        </tr>
                                        <tr>
                                            <th>Data de Compra:</th>
                                            <td>${new Date(investment.purchaseDate).toLocaleDateString('pt-BR')}</td>
                                        </tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6>Valores</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <th>Quantidade:</th>
                                            <td>${investment.quantity}</td>
                                        </tr>
                                        <tr>
                                            <th>Preço de Compra:</th>
                                            <td>R$ ${investment.purchasePrice.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                        <tr>
                                            <th>Preço Atual:</th>
                                            <td>R$ ${investment.currentPrice.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                        <tr>
                                            <th>Total Investido:</th>
                                            <td>R$ ${investment.totalInvested.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                        <tr>
                                            <th>Valor Atual:</th>
                                            <td>R$ ${investment.currentValue.toFixed(2).replace('.', ',')}</td>
                                        </tr>
                                        <tr>
                                            <th>Rentabilidade:</th>
                                            <td class="${investment.profitability >= 0 ? 'text-success' : 'text-danger'}">
                                                ${investment.profitability >= 0 ? '+' : ''}${investment.profitability.toFixed(2).replace('.', ',')}%
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-12">
                                    <h6>Cotação Histórica</h6>
                                    <canvas id="cotacaoHistoricaChart" height="200"></canvas>
                                </div>
                            </div>
                            
                            <div class="row">
                                <div class="col-12">
                                    <h6>Observações</h6>
                                    <p>${investment.notes || 'Nenhuma observação.'}</p>
                                </div>
                            </div>
                            
                            <div class="row mt-3">
                                <div class="col-12">
                                    <h6>Fontes de Dados</h6>
                                    <div class="data-sources">
                                        ${this.getDataSourcesHtml(investment.category)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-primary" id="btnEditarInvestimento">Editar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstChild);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalDetalhesInvestimento'));
        modal.show();
        
        // Adicionar event listener para botão de editar
        document.getElementById('btnEditarInvestimento')?.addEventListener('click', () => {
            this.editInvestment(investment.id);
            modal.hide();
        });
        
        // Adicionar event listener para quando o modal for fechado
        document.getElementById('modalDetalhesInvestimento')?.addEventListener('hidden.bs.modal', () => {
            document.getElementById('modalDetalhesInvestimento').remove();
        });
        
        // Criar gráfico de cotação histórica
        this.createHistoricalChart(investment);
    }
    
    getDataSourcesHtml(category) {
        const sources = this.dataSources[category] || {};
        
        if (Object.keys(sources).length === 0) {
            return '<p>Nenhuma fonte de dados disponível para esta categoria.</p>';
        }
        
        let html = '<ul class="list-group">';
        
        for (const [name, url] of Object.entries(sources)) {
            html += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    ${name}
                    <a href="${url}" target="_blank" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-box-arrow-up-right"></i> Acessar
                    </a>
                </li>
            `;
        }
        
        html += '</ul>';
        
        return html;
    }
    
    showDataSources(category, name) {
        const sources = this.dataSources[category] || {};
        
        if (Object.keys(sources).length === 0) {
            alert('Nenhuma fonte de dados disponível para esta categoria.');
            return;
        }
        
        // Criar modal de fontes de dados
        const modalHtml = `
            <div class="modal fade" id="modalFontesDados" tabindex="-1" aria-labelledby="modalFontesDadosLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalFontesDadosLabel">Fontes de Dados: ${name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                            <p>Consulte as seguintes fontes para obter dados atualizados sobre ${name}:</p>
                            ${this.getDataSourcesHtml(category)}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar modal ao DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstChild);
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalFontesDados'));
        modal.show();
        
        // Adicionar event listener para quando o modal for fechado
        document.getElementById('modalFontesDados')?.addEventListener('hidden.bs.modal', () => {
            document.getElementById('modalFontesDados').remove();
        });
    }
    
    createHistoricalChart(investment) {
        // Dados de exemplo para cotação histórica
        const dates = [];
        const prices = [];
        
        // Gerar dados dos últimos 6 meses
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setMonth(date.getMonth() - i);
            dates.push(date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));
            
            // Gerar preço aleatório com tendência de alta ou baixa
            const trend = investment.profitability >= 0 ? 1 : -1;
            const randomFactor = 0.05 * (Math.random() - 0.5);
            const factor = 1 + (i / 6) * (investment.profitability / 100) + randomFactor;
            
            const price = investment.purchasePrice * factor;
            prices.push(price);
        }
        
        // Obter contexto do canvas
        const ctx = document.getElementById('cotacaoHistoricaChart')?.getContext('2d');
        if (!ctx) return;
        
        // Criar gráfico
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Preço',
                        data: prices,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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
    
    editInvestment(id) {
        const investment = this.investments.find(i => i.id === id);
        if (!investment) return;
        
        // Preencher formulário com dados do investimento
        document.getElementById('nomeInvestimento').value = investment.name;
        document.getElementById('categoriaInvestimento').value = investment.category;
        
        // Atualizar subcategorias
        this.updateSubcategoryOptions(investment.category);
        document.getElementById('subcategoriaInvestimento').value = investment.subcategory;
        
        document.getElementById('instituicaoInvestimento').value = investment.institution;
        document.getElementById('dataCompraInvestimento').value = investment.purchaseDate;
        document.getElementById('quantidadeInvestimento').value = investment.quantity;
        document.getElementById('precoCompraInvestimento').value = investment.purchasePrice;
        document.getElementById('precoAtualInvestimento').value = investment.currentPrice;
        document.getElementById('observacaoInvestimento').value = investment.notes;
        
        // Armazenar ID para atualização
        document.getElementById('investmentId').value = investment.id;
        
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalNovoInvestimento'));
        modal.show();
        
        // Alterar título e botão
        document.getElementById('modalNovoInvestimentoLabel').textContent = 'Editar Investimento';
        document.getElementById('btnSalvarInvestimento').textContent = 'Atualizar';
    }
    
    updateInvestment() {
        const id = parseInt(document.getElementById('investmentId').value);
        const investment = this.investments.find(i => i.id === id);
        if (!investment) return;
        
        // Obter valores do formulário
        const name = document.getElementById('nomeInvestimento').value;
        const category = document.getElementById('categoriaInvestimento').value;
        const subcategory = document.getElementById('subcategoriaInvestimento').value;
        const institution = document.getElementById('instituicaoInvestimento').value;
        const purchaseDate = document.getElementById('dataCompraInvestimento').value;
        const quantity = parseFloat(document.getElementById('quantidadeInvestimento').value);
        const purchasePrice = parseFloat(document.getElementById('precoCompraInvestimento').value);
        const currentPrice = parseFloat(document.getElementById('precoAtualInvestimento').value);
        const notes = document.getElementById('observacaoInvestimento').value;
        
        // Calcular valores
        const totalInvested = quantity * purchasePrice;
        const currentValue = quantity * currentPrice;
        const profitability = ((currentValue / totalInvested) - 1) * 100;
        
        // Atualizar dados
        investment.name = name;
        investment.category = category;
        investment.subcategory = subcategory;
        investment.institution = institution;
        investment.purchaseDate = purchaseDate;
        investment.quantity = quantity;
        investment.purchasePrice = purchasePrice;
        investment.currentPrice = currentPrice;
        investment.totalInvested = totalInvested;
        investment.currentValue = currentValue;
        investment.profitability = profitability;
        investment.notes = notes;
        
        // Atualizar visualização
        this.renderInvestments();
        this.updateInvestmentSummary();
        this.updateAllocationChart();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovoInvestimento'));
        modal.hide();
        
        // Resetar formulário e título
        document.getElementById('formNovoInvestimento').reset();
        document.getElementById('modalNovoInvestimentoLabel').textContent = 'Novo Investimento';
        document.getElementById('btnSalvarInvestimento').textContent = 'Salvar';
    }
    
    async fetchStockData(symbol) {
        try {
            // Usar a API do Yahoo Finance para obter dados da ação
            const response = await fetch(`/api/stock?symbol=${symbol}`);
            const data = await response.json();
            
            if (data && data.chart && data.chart.result && data.chart.result.length > 0) {
                return data.chart.result[0];
            }
            
            throw new Error('Dados não encontrados');
        } catch (error) {
            console.error('Erro ao buscar dados da ação:', error);
            return null;
        }
    }
}

// Inicializar controlador
document.addEventListener('DOMContentLoaded', () => {
    const investmentController = new InvestmentController();
});
