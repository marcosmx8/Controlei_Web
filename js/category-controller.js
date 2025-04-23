// Implementação do sistema de categorização

// Categorias padrão do sistema
const categoriasPadrao = {
    receitas: [
        { id: 'salario', nome: 'Salário', icone: 'bi-cash-coin', cor: '#2ecc71' },
        { id: 'investimentos', nome: 'Investimentos', icone: 'bi-graph-up-arrow', cor: '#3498db' },
        { id: 'freelance', nome: 'Freelance', icone: 'bi-laptop', cor: '#9b59b6' },
        { id: 'outros_receitas', nome: 'Outros', icone: 'bi-plus-circle', cor: '#95a5a6' }
    ],
    despesas: [
        { id: 'moradia', nome: 'Moradia', icone: 'bi-house', cor: '#e74c3c' },
        { id: 'alimentacao', nome: 'Alimentação', icone: 'bi-cart', cor: '#f39c12' },
        { id: 'transporte', nome: 'Transporte', icone: 'bi-car-front', cor: '#1abc9c' },
        { id: 'saude', nome: 'Saúde', icone: 'bi-heart-pulse', cor: '#e84393' },
        { id: 'lazer', nome: 'Lazer', icone: 'bi-controller', cor: '#fd79a8' },
        { id: 'educacao', nome: 'Educação', icone: 'bi-book', cor: '#6c5ce7' },
        { id: 'assinaturas', nome: 'Assinaturas', icone: 'bi-calendar-check', cor: '#00cec9' },
        { id: 'compras', nome: 'Compras', icone: 'bi-bag', cor: '#fdcb6e' },
        { id: 'outros_despesas', nome: 'Outros', icone: 'bi-three-dots', cor: '#636e72' }
    ]
};

// Armazenar categorias personalizadas do usuário
let categoriasPersonalizadas = {
    receitas: [],
    despesas: []
};

// Função para obter todas as categorias (padrão + personalizadas)
function obterTodasCategorias() {
    return {
        receitas: [...categoriasPadrao.receitas, ...categoriasPersonalizadas.receitas],
        despesas: [...categoriasPadrao.despesas, ...categoriasPersonalizadas.despesas]
    };
}

// Função para adicionar nova categoria personalizada
function adicionarCategoria(tipo, categoria) {
    // Validar tipo
    if (tipo !== 'receitas' && tipo !== 'despesas') {
        throw new Error('Tipo de categoria inválido. Use "receitas" ou "despesas".');
    }
    
    // Validar se já existe categoria com mesmo ID
    const todasCategorias = obterTodasCategorias();
    const categoriaExistente = todasCategorias[tipo].find(c => c.id === categoria.id);
    
    if (categoriaExistente) {
        throw new Error(`Já existe uma categoria com o ID "${categoria.id}".`);
    }
    
    // Adicionar nova categoria
    categoriasPersonalizadas[tipo].push(categoria);
    
    // Atualizar interface
    atualizarListaCategorias();
    
    return categoria;
}

// Função para editar categoria personalizada
function editarCategoria(tipo, id, dadosAtualizados) {
    // Validar tipo
    if (tipo !== 'receitas' && tipo !== 'despesas') {
        throw new Error('Tipo de categoria inválido. Use "receitas" ou "despesas".');
    }
    
    // Verificar se é uma categoria padrão
    const categoriaPadrao = categoriasPadrao[tipo].find(c => c.id === id);
    if (categoriaPadrao) {
        throw new Error('Não é possível editar categorias padrão do sistema.');
    }
    
    // Buscar categoria personalizada
    const index = categoriasPersonalizadas[tipo].findIndex(c => c.id === id);
    
    if (index === -1) {
        throw new Error(`Categoria com ID "${id}" não encontrada.`);
    }
    
    // Atualizar categoria
    categoriasPersonalizadas[tipo][index] = {
        ...categoriasPersonalizadas[tipo][index],
        ...dadosAtualizados
    };
    
    // Atualizar interface
    atualizarListaCategorias();
    
    return categoriasPersonalizadas[tipo][index];
}

// Função para excluir categoria personalizada
function excluirCategoria(tipo, id) {
    // Validar tipo
    if (tipo !== 'receitas' && tipo !== 'despesas') {
        throw new Error('Tipo de categoria inválido. Use "receitas" ou "despesas".');
    }
    
    // Verificar se é uma categoria padrão
    const categoriaPadrao = categoriasPadrao[tipo].find(c => c.id === id);
    if (categoriaPadrao) {
        throw new Error('Não é possível excluir categorias padrão do sistema.');
    }
    
    // Buscar categoria personalizada
    const index = categoriasPersonalizadas[tipo].findIndex(c => c.id === id);
    
    if (index === -1) {
        throw new Error(`Categoria com ID "${id}" não encontrada.`);
    }
    
    // Verificar se há transações usando esta categoria
    const transacoesComCategoria = verificarTransacoesComCategoria(id);
    if (transacoesComCategoria > 0) {
        throw new Error(`Não é possível excluir esta categoria pois existem ${transacoesComCategoria} transações associadas a ela.`);
    }
    
    // Excluir categoria
    const categoriaExcluida = categoriasPersonalizadas[tipo][index];
    categoriasPersonalizadas[tipo].splice(index, 1);
    
    // Atualizar interface
    atualizarListaCategorias();
    
    return categoriaExcluida;
}

// Função para verificar se há transações usando uma categoria
function verificarTransacoesComCategoria(categoriaId) {
    // Esta função seria implementada para verificar no banco de dados
    // ou no armazenamento local se há transações usando esta categoria
    
    // Por enquanto, retornamos 0 para simular que não há transações
    return 0;
}

// Função para obter categoria por ID
function obterCategoriaPorId(id) {
    const todasCategorias = obterTodasCategorias();
    
    // Buscar em receitas
    let categoria = todasCategorias.receitas.find(c => c.id === id);
    
    // Se não encontrou, buscar em despesas
    if (!categoria) {
        categoria = todasCategorias.despesas.find(c => c.id === id);
    }
    
    return categoria;
}

// Função para atualizar a lista de categorias na interface
function atualizarListaCategorias() {
    // Esta função seria implementada para atualizar a interface
    // com as categorias disponíveis
    console.log('Atualizando lista de categorias na interface');
    
    // Aqui seria implementada a lógica para atualizar os selects
    // e outros elementos da interface que usam categorias
}

// Função para expandir/recolher categoria na visualização
function toggleCategoriaExpansao(categoriaId) {
    const categoriaElement = document.querySelector(`.category-item[data-category="${categoriaId}"]`);
    
    if (categoriaElement) {
        const detailsElement = categoriaElement.querySelector('.category-details');
        const iconElement = categoriaElement.querySelector('.bi-chevron-down, .bi-chevron-up');
        
        // Toggle da classe expanded
        detailsElement.classList.toggle('expanded');
        
        // Toggle do ícone
        if (iconElement) {
            iconElement.classList.toggle('bi-chevron-down');
            iconElement.classList.toggle('bi-chevron-up');
        }
    }
}

// Função para gerar HTML da lista de categorias expandíveis
function gerarHTMLCategoriasExpansiveis(transacoesPorCategoria, tipo) {
    let html = '';
    
    // Obter todas as categorias
    const todasCategorias = obterTodasCategorias();
    const categorias = tipo === 'receita' ? todasCategorias.receitas : todasCategorias.despesas;
    
    // Gerar HTML para cada categoria que tenha transações
    categorias.forEach(categoria => {
        const transacoesDaCategoria = transacoesPorCategoria[categoria.id];
        
        // Só mostrar categorias que tenham transações
        if (transacoesDaCategoria && transacoesDaCategoria.length > 0) {
            const totalCategoria = transacoesDaCategoria.reduce((total, t) => total + t.valor, 0);
            
            html += `
            <div class="category-item" data-category="${categoria.id}">
                <div class="category-header">
                    <div>
                        <i class="${categoria.icone}" style="color: ${categoria.cor}"></i> ${categoria.nome}
                    </div>
                    <div>
                        <span class="badge ${tipo === 'receita' ? 'bg-success' : 'bg-danger'}">
                            R$ ${totalCategoria.toFixed(2)}
                        </span>
                        <i class="bi bi-chevron-down"></i>
                    </div>
                </div>
                <div class="category-details">
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            // Adicionar linhas para cada transação
            transacoesDaCategoria.forEach(transacao => {
                const data = new Date(transacao.data);
                const dataFormatada = data.toLocaleDateString('pt-BR');
                
                html += `
                <tr>
                    <td>${dataFormatada}</td>
                    <td>${transacao.descricao}</td>
                    <td>R$ ${transacao.valor.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary btn-editar-transacao" data-id="${transacao.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-excluir-transacao" data-id="${transacao.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
                `;
            });
            
            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `;
        }
    });
    
    return html;
}

// Configuração dos eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos para expandir/recolher categorias
    document.addEventListener('click', function(event) {
        // Verificar se o clique foi em um cabeçalho de categoria
        const categoryHeader = event.target.closest('.category-header');
        
        if (categoryHeader) {
            const categoryItem = categoryHeader.closest('.category-item');
            const categoryId = categoryItem.dataset.category;
            
            toggleCategoriaExpansao(categoryId);
        }
    });
});

// Exportar funções para uso em outros módulos
window.categoryController = {
    obterTodasCategorias,
    adicionarCategoria,
    editarCategoria,
    excluirCategoria,
    obterCategoriaPorId,
    toggleCategoriaExpansao,
    gerarHTMLCategoriasExpansiveis
};
