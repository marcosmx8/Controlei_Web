/**
 * Transaction Controller
 * Responsável pelo gerenciamento de transações financeiras
 */

class TransactionController {
    constructor() {
        this.transactions = [];
        this.categories = {
            income: ['Salário', 'Investimentos', 'Freelance', 'Outros'],
            expense: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros']
        };
        
        this.subcategories = {
            'Moradia': ['Aluguel', 'Condomínio', 'IPTU', 'Água', 'Luz', 'Gás', 'Internet', 'TV', 'Manutenção', 'Outros'],
            'Alimentação': ['Supermercado', 'Restaurante', 'Delivery', 'Outros'],
            'Transporte': ['Combustível', 'Transporte Público', 'Aplicativos', 'Manutenção', 'IPVA', 'Seguro', 'Outros'],
            'Saúde': ['Plano de Saúde', 'Medicamentos', 'Consultas', 'Exames', 'Academia', 'Outros'],
            'Lazer': ['Cinema', 'Shows', 'Viagens', 'Streaming', 'Outros'],
            'Educação': ['Mensalidade', 'Material', 'Cursos', 'Livros', 'Outros'],
            'Investimentos': ['Ações', 'Fundos', 'Renda Fixa', 'Criptomoedas', 'Outros'],
            'Salário': ['CLT', 'PJ', 'Bônus', 'Outros'],
            'Freelance': ['Projetos', 'Consultoria', 'Outros'],
            'Outros': ['Diversos']
        };
        
        this.financialInstitutions = [
            'Nubank', 'Itaú', 'Bradesco', 'Santander', 'Banco do Brasil', 
            'Caixa', 'Inter', 'C6 Bank', 'XP', 'BTG Pactual', 'Outros'
        ];
        
        this.paymentMethods = [
            'Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 
            'PIX', 'TED/DOC', 'Boleto', 'Débito Automático', 'Outros'
        ];
        
        this.statusOptions = [
            'Pendente', 'Concluído', 'Agendado', 'Cancelado'
        ];
        
        this.initializeEventListeners();
        this.loadSampleData();
    }
    
    initializeEventListeners() {
        // Filtros
        document.getElementById('filtroMes').addEventListener('change', () => this.filterTransactions());
        document.getElementById('filtroAno').addEventListener('change', () => this.filterTransactions());
        document.getElementById('filtroTipo').addEventListener('change', () => this.filterTransactions());
        document.getElementById('filtroCategoria').addEventListener('change', () => this.filterTransactions());
        
        // Formulário de nova transação
        document.getElementById('btnSalvarTransacao').addEventListener('click', () => this.saveTransaction());
        
        // Expandir/colapsar categorias
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                const categoryItem = e.currentTarget.closest('.category-item');
                const details = categoryItem.querySelector('.category-details');
                const icon = e.currentTarget.querySelector('.bi-chevron-down, .bi-chevron-up');
                
                if (details.style.display === 'none' || !details.style.display) {
                    details.style.display = 'block';
                    if (icon) icon.classList.replace('bi-chevron-down', 'bi-chevron-up');
                } else {
                    details.style.display = 'none';
                    if (icon) icon.classList.replace('bi-chevron-up', 'bi-chevron-down');
                }
            });
        });
        
        // Inicializar campos dinâmicos no modal
        document.getElementById('tipoTransacao')?.addEventListener('change', (e) => {
            this.updateCategoryOptions(e.target.value);
        });
        
        document.getElementById('categoriaTransacao')?.addEventListener('change', (e) => {
            this.updateSubcategoryOptions(e.target.value);
        });
    }
    
    updateCategoryOptions(transactionType) {
        const categorySelect = document.getElementById('categoriaTransacao');
        if (!categorySelect) return;
        
        // Limpar opções atuais
        categorySelect.innerHTML = '<option value="">Selecione...</option>';
        
        // Adicionar categorias apropriadas
        const categories = transactionType === 'receita' ? this.categories.income : this.categories.expense;
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.toLowerCase().replace(/\s/g, '_');
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    updateSubcategoryOptions(category) {
        const subcategorySelect = document.getElementById('subcategoriaTransacao');
        if (!subcategorySelect) return;
        
        // Limpar opções atuais
        subcategorySelect.innerHTML = '<option value="">Selecione...</option>';
        
        // Adicionar subcategorias apropriadas
        const categoryName = category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const subcategories = this.subcategories[categoryName] || [];
        
        subcategories.forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory.toLowerCase().replace(/\s/g, '_');
            option.textContent = subcategory;
            subcategorySelect.appendChild(option);
        });
    }
    
    loadSampleData() {
        // Dados de exemplo para demonstração
        this.transactions = [
            {
                id: 1,
                type: 'despesa',
                eventDate: '2025-04-01',
                effectiveDate: '2025-04-05',
                description: 'Aluguel',
                category: 'Moradia',
                subcategory: 'Aluguel',
                amount: 1200.00,
                paymentMethod: 'Transferência',
                financialInstitution: 'Itaú',
                card: null,
                status: 'Concluído',
                notes: 'Pagamento mensal do apartamento'
            },
            {
                id: 2,
                type: 'despesa',
                eventDate: '2025-04-10',
                effectiveDate: '2025-04-10',
                description: 'Supermercado Extra',
                category: 'Alimentação',
                subcategory: 'Supermercado',
                amount: 350.00,
                paymentMethod: 'Cartão de Débito',
                financialInstitution: 'Nubank',
                card: 'Nubank',
                status: 'Concluído',
                notes: 'Compras da semana'
            },
            {
                id: 3,
                type: 'despesa',
                eventDate: '2025-04-15',
                effectiveDate: '2025-04-15',
                description: 'Restaurante',
                category: 'Alimentação',
                subcategory: 'Restaurante',
                amount: 120.00,
                paymentMethod: 'Cartão de Crédito',
                financialInstitution: 'Nubank',
                card: 'Nubank',
                status: 'Concluído',
                notes: 'Almoço de negócios'
            },
            {
                id: 4,
                type: 'despesa',
                eventDate: '2025-04-05',
                effectiveDate: '2025-04-05',
                description: 'Supermercado',
                category: 'Alimentação',
                subcategory: 'Supermercado',
                amount: 380.00,
                paymentMethod: 'Cartão de Crédito',
                financialInstitution: 'Itaú',
                card: 'Itaú',
                status: 'Concluído',
                notes: 'Compras do mês'
            },
            {
                id: 5,
                type: 'receita',
                eventDate: '2025-04-05',
                effectiveDate: '2025-04-05',
                description: 'Salário',
                category: 'Salário',
                subcategory: 'CLT',
                amount: 8500.00,
                paymentMethod: 'Transferência',
                financialInstitution: 'Itaú',
                card: null,
                status: 'Concluído',
                notes: 'Salário mensal'
            }
        ];
        
        this.renderTransactions();
        this.updateFinancialSummary();
    }
    
    filterTransactions() {
        const month = parseInt(document.getElementById('filtroMes').value);
        const year = parseInt(document.getElementById('filtroAno').value);
        const type = document.getElementById('filtroTipo').value;
        const category = document.getElementById('filtroCategoria').value;
        
        let filteredTransactions = [...this.transactions];
        
        // Filtrar por mês e ano
        if (!isNaN(month) && !isNaN(year)) {
            filteredTransactions = filteredTransactions.filter(transaction => {
                const date = new Date(transaction.effectiveDate);
                return date.getMonth() + 1 === month && date.getFullYear() === year;
            });
        }
        
        // Filtrar por tipo
        if (type !== 'todos') {
            filteredTransactions = filteredTransactions.filter(transaction => 
                transaction.type === type
            );
        }
        
        // Filtrar por categoria
        if (category !== 'todas') {
            filteredTransactions = filteredTransactions.filter(transaction => 
                transaction.category.toLowerCase().replace(/\s/g, '_') === category
            );
        }
        
        this.renderTransactions(filteredTransactions);
        this.updateFinancialSummary(filteredTransactions);
    }
    
    renderTransactions(transactions = this.transactions) {
        const container = document.querySelector('#transacoes .card-body');
        if (!container) return;
        
        // Limpar conteúdo atual
        container.innerHTML = '<h5 class="card-title">Lançamentos</h5>';
        
        // Criar tabela de transações
        const table = document.createElement('div');
        table.className = 'table-responsive';
        table.innerHTML = `
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Data do Evento</th>
                        <th>Data da Efetivação</th>
                        <th>Categoria</th>
                        <th>Subcategoria</th>
                        <th>Inst. Financeira</th>
                        <th>Cartão</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody id="transactionsTableBody">
                </tbody>
            </table>
        `;
        
        container.appendChild(table);
        
        const tbody = document.getElementById('transactionsTableBody');
        
        // Agrupar transações por tipo
        const expenseTransactions = transactions.filter(t => t.type === 'despesa');
        const incomeTransactions = transactions.filter(t => t.type === 'receita');
        
        // Renderizar receitas
        if (incomeTransactions.length > 0) {
            const incomeHeader = document.createElement('tr');
            incomeHeader.className = 'table-primary';
            incomeHeader.innerHTML = `<td colspan="10"><strong>Receitas</strong></td>`;
            tbody.appendChild(incomeHeader);
            
            incomeTransactions.forEach(transaction => {
                const row = this.createTransactionRow(transaction);
                tbody.appendChild(row);
            });
        }
        
        // Renderizar despesas
        if (expenseTransactions.length > 0) {
            const expenseHeader = document.createElement('tr');
            expenseHeader.className = 'table-danger';
            expenseHeader.innerHTML = `<td colspan="10"><strong>Despesas</strong></td>`;
            tbody.appendChild(expenseHeader);
            
            expenseTransactions.forEach(transaction => {
                const row = this.createTransactionRow(transaction);
                tbody.appendChild(row);
            });
        }
        
        // Se não houver transações
        if (transactions.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="10" class="text-center">Nenhuma transação encontrada</td>`;
            tbody.appendChild(emptyRow);
        }
    }
    
    createTransactionRow(transaction) {
        const row = document.createElement('tr');
        
        // Formatar datas
        const eventDate = new Date(transaction.eventDate);
        const effectiveDate = new Date(transaction.effectiveDate);
        const formattedEventDate = `${eventDate.getDate().toString().padStart(2, '0')}/${(eventDate.getMonth() + 1).toString().padStart(2, '0')}/${eventDate.getFullYear()}`;
        const formattedEffectiveDate = `${effectiveDate.getDate().toString().padStart(2, '0')}/${(effectiveDate.getMonth() + 1).toString().padStart(2, '0')}/${effectiveDate.getFullYear()}`;
        
        // Formatar valor
        const formattedAmount = transaction.type === 'despesa' 
            ? `<span class="text-danger">R$ ${transaction.amount.toFixed(2).replace('.', ',')}</span>` 
            : `<span class="text-success">R$ ${transaction.amount.toFixed(2).replace('.', ',')}</span>`;
        
        // Definir classe de status
        let statusClass = '';
        switch(transaction.status) {
            case 'Concluído':
                statusClass = 'bg-success';
                break;
            case 'Pendente':
                statusClass = 'bg-warning';
                break;
            case 'Agendado':
                statusClass = 'bg-info';
                break;
            case 'Cancelado':
                statusClass = 'bg-secondary';
                break;
            default:
                statusClass = 'bg-light';
        }
        
        row.innerHTML = `
            <td>${formattedEventDate}</td>
            <td>${formattedEffectiveDate}</td>
            <td>${transaction.category}</td>
            <td>${transaction.subcategory}</td>
            <td>${transaction.financialInstitution}</td>
            <td>${transaction.card || '-'}</td>
            <td>${transaction.description}</td>
            <td>${formattedAmount}</td>
            <td><span class="badge ${statusClass}">${transaction.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="transactionController.editTransaction(${transaction.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="transactionController.deleteTransaction(${transaction.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        return row;
    }
    
    updateFinancialSummary(transactions = this.transactions) {
        // Calcular totais
        const income = transactions
            .filter(t => t.type === 'receita')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const expenses = transactions
            .filter(t => t.type === 'despesa')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const balance = income - expenses;
        
        // Atualizar cards
        document.querySelector('#transacoes .card-value.text-primary').textContent = `R$ ${income.toFixed(2).replace('.', ',')}`;
        document.querySelector('#transacoes .card-value.text-danger').textContent = `R$ ${expenses.toFixed(2).replace('.', ',')}`;
        
        const balanceElement = document.querySelector('#transacoes .card-value.text-success');
        
        // Verificar se o saldo é negativo e aplicar alerta visual
        if (balance < 0) {
            balanceElement.textContent = `R$ ${Math.abs(balance).toFixed(2).replace('.', ',')}`;
            balanceElement.classList.remove('text-success');
            balanceElement.classList.add('text-danger');
            
            // Adicionar emoji de alerta
            balanceElement.innerHTML = `⚠️ R$ ${Math.abs(balance).toFixed(2).replace('.', ',')}`;
        } else {
            balanceElement.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
            balanceElement.classList.remove('text-danger');
            balanceElement.classList.add('text-success');
            
            // Remover emoji se existir
            if (balanceElement.innerHTML.includes('⚠️')) {
                balanceElement.innerHTML = `R$ ${balance.toFixed(2).replace('.', ',')}`;
            }
        }
    }
    
    saveTransaction() {
        // Obter valores do formulário
        const form = document.getElementById('formNovaTransacao');
        
        const type = document.getElementById('tipoTransacao').value;
        const eventDate = document.getElementById('dataTransacao').value;
        const description = document.getElementById('descricaoTransacao').value;
        const category = document.getElementById('categoriaTransacao').value;
        const amount = parseFloat(document.getElementById('valorTransacao').value);
        const paymentMethod = document.getElementById('metodoPagamento').value;
        const notes = document.getElementById('observacaoTransacao').value;
        
        // Validar campos obrigatórios
        if (!type || !eventDate || !description || !category || isNaN(amount)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        
        // Criar nova transação
        const newTransaction = {
            id: this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1,
            type,
            eventDate,
            effectiveDate: eventDate, // Por padrão, mesma data
            description,
            category: document.getElementById('categoriaTransacao').options[document.getElementById('categoriaTransacao').selectedIndex].text,
            subcategory: 'Geral', // Valor padrão
            amount,
            paymentMethod,
            financialInstitution: 'Não especificado',
            card: paymentMethod === 'credito' ? 'Não especificado' : null,
            status: 'Concluído',
            notes
        };
        
        // Adicionar à lista
        this.transactions.push(newTransaction);
        
        // Atualizar visualização
        this.renderTransactions();
        this.updateFinancialSummary();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovaTransacao'));
        modal.hide();
        
        // Limpar formulário
        form.reset();
    }
    
    editTransaction(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;
        
        // Preencher formulário com dados da transação
        document.getElementById('tipoTransacao').value = transaction.type;
        document.getElementById('dataTransacao').value = transaction.eventDate;
        document.getElementById('descricaoTransacao').value = transaction.description;
        
        // Atualizar categorias baseado no tipo
        this.updateCategoryOptions(transaction.type);
        
        // Selecionar categoria
        const categorySelect = document.getElementById('categoriaTransacao');
        for (let i = 0; i < categorySelect.options.length; i++) {
            if (categorySelect.options[i].text === transaction.category) {
                categorySelect.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById('valorTransacao').value = transaction.amount;
        document.getElementById('metodoPagamento').value = transaction.paymentMethod;
        document.getElementById('observacaoTransacao').value = transaction.notes;
        
        // Armazenar ID para atualização
        document.getElementById('transactionId').value = transaction.id;
        
        // Abrir modal
        const modal = new bootstrap.Modal(document.getElementById('modalNovaTransacao'));
        modal.show();
        
        // Alterar título e botão
        document.getElementById('modalNovaTransacaoLabel').textContent = 'Editar Transação';
        document.getElementById('btnSalvarTransacao').textContent = 'Atualizar';
    }
    
    updateTransaction() {
        const id = parseInt(document.getElementById('transactionId').value);
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) return;
        
        // Atualizar dados
        transaction.type = document.getElementById('tipoTransacao').value;
        transaction.eventDate = document.getElementById('dataTransacao').value;
        transaction.description = document.getElementById('descricaoTransacao').value;
        transaction.category = document.getElementById('categoriaTransacao').options[document.getElementById('categoriaTransacao').selectedIndex].text;
        transaction.amount = parseFloat(document.getElementById('valorTransacao').value);
        transaction.paymentMethod = document.getElementById('metodoPagamento').value;
        transaction.notes = document.getElementById('observacaoTransacao').value;
        
        // Atualizar visualização
        this.renderTransactions();
        this.updateFinancialSummary();
        
        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNovaTransacao'));
        modal.hide();
        
        // Resetar formulário e título
        document.getElementById('formNovaTransacao').reset();
        document.getElementById('modalNovaTransacaoLabel').textContent = 'Nova Transação';
        document.getElementById('btnSalvarTransacao').textContent = 'Salvar';
    }
    
    deleteTransaction(id) {
        if (!confirm('Tem certeza que deseja excluir esta transação?')) return;
        
        // Remover transação
        this.transactions = this.transactions.filter(t => t.id !== id);
        
        // Atualizar visualização
        this.renderTransactions();
        this.updateFinancialSummary();
    }
}

// Inicializar controlador
const transactionController = new TransactionController();
