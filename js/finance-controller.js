// Implementação do sistema de controle de despesas e receitas

// Dados de exemplo para o sistema
let transacoes = [
    { id: 1, data: '2025-04-20', descricao: 'Supermercado', categoria: 'Alimentação', valor: 350.00, tipo: 'despesa' },
    { id: 2, data: '2025-04-18', descricao: 'Salário', categoria: 'Renda', valor: 8500.00, tipo: 'receita' },
    { id: 3, data: '2025-04-15', descricao: 'Conta de Luz', categoria: 'Moradia', valor: 180.00, tipo: 'despesa' },
    { id: 4, data: '2025-04-10', descricao: 'Restaurante', categoria: 'Alimentação', valor: 120.00, tipo: 'despesa' },
    { id: 5, data: '2025-04-05', descricao: 'Internet', categoria: 'Moradia', valor: 150.00, tipo: 'despesa' }
];

// Categorias disponíveis
const categorias = {
    receitas: ['Renda', 'Investimentos', 'Freelance', 'Outros'],
    despesas: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Outros']
};

// Função para adicionar nova transação
function adicionarTransacao(transacao) {
    // Gerar ID único
    const novoId = transacoes.length > 0 ? Math.max(...transacoes.map(t => t.id)) + 1 : 1;
    
    // Adicionar nova transação com ID
    const novaTransacao = {
        id: novoId,
        ...transacao
    };
    
    transacoes.push(novaTransacao);
    
    // Atualizar interface
    atualizarListaTransacoes();
    atualizarResumoFinanceiro();
    atualizarGraficos();
    
    return novaTransacao;
}

// Função para editar transação existente
function editarTransacao(id, dadosAtualizados) {
    const index = transacoes.findIndex(t => t.id === id);
    
    if (index !== -1) {
        transacoes[index] = {
            ...transacoes[index],
            ...dadosAtualizados
        };
        
        // Atualizar interface
        atualizarListaTransacoes();
        atualizarResumoFinanceiro();
        atualizarGraficos();
        
        return transacoes[index];
    }
    
    return null;
}

// Função para excluir transação
function excluirTransacao(id) {
    const index = transacoes.findIndex(t => t.id === id);
    
    if (index !== -1) {
        const transacaoExcluida = transacoes[index];
        transacoes.splice(index, 1);
        
        // Atualizar interface
        atualizarListaTransacoes();
        atualizarResumoFinanceiro();
        atualizarGraficos();
        
        return transacaoExcluida;
    }
    
    return null;
}

// Função para filtrar transações
function filtrarTransacoes(filtros) {
    let resultado = [...transacoes];
    
    // Filtrar por mês e ano
    if (filtros.mes && filtros.ano) {
        resultado = resultado.filter(t => {
            const data = new Date(t.data);
            return data.getMonth() + 1 === parseInt(filtros.mes) && 
                   data.getFullYear() === parseInt(filtros.ano);
        });
    }
    
    // Filtrar por tipo (receita/despesa)
    if (filtros.tipo && filtros.tipo !== 'todos') {
        resultado = resultado.filter(t => t.tipo === filtros.tipo);
    }
    
    // Filtrar por categoria
    if (filtros.categoria && filtros.categoria !== 'todas') {
        resultado = resultado.filter(t => t.categoria === filtros.categoria);
    }
    
    return resultado;
}

// Função para calcular resumo financeiro
function calcularResumoFinanceiro(transacoesFiltradas) {
    const resumo = {
        receitas: 0,
        despesas: 0,
        saldo: 0
    };
    
    transacoesFiltradas.forEach(t => {
        if (t.tipo === 'receita') {
            resumo.receitas += t.valor;
        } else if (t.tipo === 'despesa') {
            resumo.despesas += t.valor;
        }
    });
    
    resumo.saldo = resumo.receitas - resumo.despesas;
    
    return resumo;
}

// Função para agrupar transações por categoria
function agruparPorCategoria(transacoesFiltradas) {
    const categorias = {};
    
    transacoesFiltradas.forEach(t => {
        if (!categorias[t.categoria]) {
            categorias[t.categoria] = {
                total: 0,
                transacoes: []
            };
        }
        
        categorias[t.categoria].total += t.valor;
        categorias[t.categoria].transacoes.push(t);
    });
    
    return categorias;
}

// Função para atualizar a lista de transações na interface
function atualizarListaTransacoes() {
    // Esta função será implementada para atualizar a interface com as transações
    console.log('Atualizando lista de transações na interface');
    
    // Aqui seria implementada a lógica para atualizar a interface
    // com base nas transações filtradas e agrupadas por categoria
}

// Função para atualizar o resumo financeiro na interface
function atualizarResumoFinanceiro() {
    // Esta função será implementada para atualizar o resumo financeiro na interface
    console.log('Atualizando resumo financeiro na interface');
    
    // Aqui seria implementada a lógica para atualizar os cards de resumo
    // com os valores de receitas, despesas e saldo
}

// Função para atualizar os gráficos na interface
function atualizarGraficos() {
    // Esta função será implementada para atualizar os gráficos na interface
    console.log('Atualizando gráficos na interface');
    
    // Aqui seria implementada a lógica para atualizar os gráficos
    // com base nas transações filtradas
}

// Configuração dos eventos do formulário de nova transação
document.addEventListener('DOMContentLoaded', function() {
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
                adicionarTransacao(novaTransacao);
                
                // Fechar modal
                const modalNovaTransacao = bootstrap.Modal.getInstance(document.getElementById('modalNovaTransacao'));
                modalNovaTransacao.hide();
                
                // Limpar formulário
                formNovaTransacao.reset();
            } else {
                // Exibir validações do formulário
                formNovaTransacao.reportValidity();
            }
        });
    }
    
    // Configurar eventos para os filtros
    const filtros = document.querySelectorAll('#filtroMes, #filtroAno, #filtroTipo, #filtroCategoria');
    
    filtros.forEach(filtro => {
        filtro.addEventListener('change', function() {
            const filtrosAtuais = {
                mes: document.getElementById('filtroMes').value,
                ano: document.getElementById('filtroAno').value,
                tipo: document.getElementById('filtroTipo').value,
                categoria: document.getElementById('filtroCategoria').value
            };
            
            const transacoesFiltradas = filtrarTransacoes(filtrosAtuais);
            const resumo = calcularResumoFinanceiro(transacoesFiltradas);
            const categorias = agruparPorCategoria(transacoesFiltradas);
            
            // Atualizar interface com os resultados filtrados
            // Esta parte seria implementada para atualizar a interface
        });
    });
    
    // Configurar eventos para expandir/recolher categorias
    const categoriasItems = document.querySelectorAll('.category-item');
    
    categoriasItems.forEach(item => {
        item.addEventListener('click', function() {
            const details = this.querySelector('.category-details');
            details.classList.toggle('expanded');
            
            const icon = this.querySelector('.bi-chevron-down, .bi-chevron-up');
            if (icon) {
                icon.classList.toggle('bi-chevron-down');
                icon.classList.toggle('bi-chevron-up');
            }
        });
    });
});

// Exportar funções para uso em outros módulos
window.financeController = {
    adicionarTransacao,
    editarTransacao,
    excluirTransacao,
    filtrarTransacoes,
    calcularResumoFinanceiro,
    agruparPorCategoria
};
