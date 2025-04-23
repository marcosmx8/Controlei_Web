// Atualização do sistema de controle de investimentos com categorias padrão

// Categorias padrão de investimentos mais detalhadas
const categoriasPadraoInvestimentos = {
    renda_fixa: [
        { id: 'cdi', nome: 'CDI', descricao: 'Certificado de Depósito Interbancário' },
        { id: 'cdb', nome: 'CDB', descricao: 'Certificado de Depósito Bancário' },
        { id: 'lc', nome: 'LC', descricao: 'Letra de Câmbio' },
        { id: 'lci', nome: 'LCI', descricao: 'Letra de Crédito Imobiliário' },
        { id: 'lca', nome: 'LCA', descricao: 'Letra de Crédito do Agronegócio' },
        { id: 'tesouro_selic', nome: 'Tesouro Selic', descricao: 'Tesouro Direto indexado à taxa Selic' },
        { id: 'tesouro_ipca', nome: 'Tesouro IPCA+', descricao: 'Tesouro Direto indexado ao IPCA' },
        { id: 'tesouro_prefixado', nome: 'Tesouro Prefixado', descricao: 'Tesouro Direto com taxa prefixada' },
        { id: 'debentures', nome: 'Debêntures', descricao: 'Títulos de dívida corporativa' },
        { id: 'poupanca', nome: 'Poupança', descricao: 'Caderneta de poupança' },
        { id: 'outros_renda_fixa', nome: 'Outros (Renda Fixa)', descricao: 'Outros investimentos de renda fixa' }
    ],
    renda_variavel: [
        { id: 'acoes_financeiro', nome: 'Ações - Financeiro', descricao: 'Ações de empresas do setor financeiro' },
        { id: 'acoes_consumo', nome: 'Ações - Consumo', descricao: 'Ações de empresas do setor de consumo' },
        { id: 'acoes_energia', nome: 'Ações - Energia', descricao: 'Ações de empresas do setor de energia' },
        { id: 'acoes_tecnologia', nome: 'Ações - Tecnologia', descricao: 'Ações de empresas do setor de tecnologia' },
        { id: 'acoes_saude', nome: 'Ações - Saúde', descricao: 'Ações de empresas do setor de saúde' },
        { id: 'acoes_materiais', nome: 'Ações - Materiais', descricao: 'Ações de empresas do setor de materiais básicos' },
        { id: 'acoes_imobiliario', nome: 'Ações - Imobiliário', descricao: 'Ações de empresas do setor imobiliário' },
        { id: 'acoes_outros', nome: 'Ações - Outros Setores', descricao: 'Ações de empresas de outros setores' },
        { id: 'etf_brasil', nome: 'ETF Brasil', descricao: 'ETFs do mercado brasileiro' },
        { id: 'etf_internacional', nome: 'ETF Internacional', descricao: 'ETFs de mercados internacionais' },
        { id: 'bdr', nome: 'BDR', descricao: 'Brazilian Depositary Receipts' },
        { id: 'outros_renda_variavel', nome: 'Outros (Renda Variável)', descricao: 'Outros investimentos de renda variável' }
    ],
    fundos: [
        { id: 'fundo_di', nome: 'Fundo DI', descricao: 'Fundos de investimento referenciados DI' },
        { id: 'fundo_rf', nome: 'Fundo Renda Fixa', descricao: 'Fundos de renda fixa' },
        { id: 'fundo_acoes', nome: 'Fundo de Ações', descricao: 'Fundos de ações' },
        { id: 'fundo_multimercado', nome: 'Fundo Multimercado', descricao: 'Fundos multimercado' },
        { id: 'fundo_imobiliario', nome: 'Fundo Imobiliário (FII)', descricao: 'Fundos de investimento imobiliário' },
        { id: 'fundo_cambial', nome: 'Fundo Cambial', descricao: 'Fundos cambiais' },
        { id: 'fundo_previdencia', nome: 'Fundo Previdência', descricao: 'Fundos de previdência privada' },
        { id: 'outros_fundos', nome: 'Outros Fundos', descricao: 'Outros tipos de fundos' }
    ],
    cripto: [
        { id: 'bitcoin', nome: 'Bitcoin (BTC)', descricao: 'Bitcoin' },
        { id: 'ethereum', nome: 'Ethereum (ETH)', descricao: 'Ethereum' },
        { id: 'outras_cripto', nome: 'Outras Criptomoedas', descricao: 'Outras criptomoedas' }
    ],
    outros: [
        { id: 'imoveis', nome: 'Imóveis', descricao: 'Investimentos em imóveis' },
        { id: 'previdencia', nome: 'Previdência Privada', descricao: 'Planos de previdência privada' },
        { id: 'outros_investimentos', nome: 'Outros Investimentos', descricao: 'Outros tipos de investimentos' }
    ]
};

// Função para obter todas as categorias de investimentos
function obterTodasCategoriasInvestimentos() {
    let todasCategorias = [];
    
    // Adicionar todas as categorias de cada tipo
    Object.keys(categoriasPadraoInvestimentos).forEach(tipo => {
        categoriasPadraoInvestimentos[tipo].forEach(categoria => {
            todasCategorias.push({
                ...categoria,
                tipo: tipo
            });
        });
    });
    
    return todasCategorias;
}

// Função para obter categorias de investimentos por tipo
function obterCategoriasInvestimentosPorTipo(tipo) {
    if (categoriasPadraoInvestimentos[tipo]) {
        return categoriasPadraoInvestimentos[tipo];
    }
    
    return [];
}

// Função para obter categoria de investimento por ID
function obterCategoriaInvestimentoPorId(id) {
    const todasCategorias = obterTodasCategoriasInvestimentos();
    return todasCategorias.find(c => c.id === id);
}

// Função para gerar HTML de opções de select para categorias de investimentos
function gerarOpcoesSelectCategoriaInvestimentos(tipoSelecionado = null, categoriaSelecionada = null) {
    let html = '<option value="">Selecione...</option>';
    
    // Se um tipo específico foi selecionado
    if (tipoSelecionado && categoriasPadraoInvestimentos[tipoSelecionado]) {
        categoriasPadraoInvestimentos[tipoSelecionado].forEach(categoria => {
            const selected = categoria.id === categoriaSelecionada ? 'selected' : '';
            html += `<option value="${categoria.id}" ${selected}>${categoria.nome}</option>`;
        });
    } 
    // Caso contrário, mostrar todas as categorias agrupadas por tipo
    else {
        Object.keys(categoriasPadraoInvestimentos).forEach(tipo => {
            const tipoFormatado = tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            html += `<optgroup label="${tipoFormatado}">`;
            
            categoriasPadraoInvestimentos[tipo].forEach(categoria => {
                const selected = categoria.id === categoriaSelecionada ? 'selected' : '';
                html += `<option value="${categoria.id}" ${selected}>${categoria.nome}</option>`;
            });
            
            html += '</optgroup>';
        });
    }
    
    return html;
}

// Função para atualizar selects de categorias de investimentos na interface
function atualizarSelectsCategoriaInvestimentos() {
    // Atualizar select de tipo de investimento
    const tipoInvestimentoSelect = document.getElementById('tipoInvestimento');
    
    if (tipoInvestimentoSelect) {
        // Manter o valor selecionado atual
        const valorSelecionado = tipoInvestimentoSelect.value;
        
        // Gerar HTML para as opções
        let html = '<option value="">Selecione...</option>';
        
        Object.keys(categoriasPadraoInvestimentos).forEach(tipo => {
            const tipoFormatado = tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const selected = tipo === valorSelecionado ? 'selected' : '';
            
            html += `<option value="${tipo}" ${selected}>${tipoFormatado}</option>`;
        });
        
        tipoInvestimentoSelect.innerHTML = html;
        
        // Disparar evento de change para atualizar subcategorias
        if (valorSelecionado) {
            const event = new Event('change');
            tipoInvestimentoSelect.dispatchEvent(event);
        }
    }
    
    // Atualizar select de filtro de tipo de investimento
    const filtroTipoInvestimentoSelect = document.getElementById('filtroTipoInvestimento');
    
    if (filtroTipoInvestimentoSelect) {
        // Manter o valor selecionado atual
        const valorSelecionado = filtroTipoInvestimentoSelect.value;
        
        // Gerar HTML para as opções
        let html = '<option value="todos" selected>Todos</option>';
        
        Object.keys(categoriasPadraoInvestimentos).forEach(tipo => {
            const tipoFormatado = tipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
            const selected = tipo === valorSelecionado ? 'selected' : '';
            
            html += `<option value="${tipo}" ${selected}>${tipoFormatado}</option>`;
        });
        
        filtroTipoInvestimentoSelect.innerHTML = html;
    }
}

// Função para atualizar select de subcategorias de investimentos com base no tipo selecionado
function atualizarSelectSubcategoriaInvestimentos(tipoSelecionado, selectId, categoriaSelecionada = null) {
    const select = document.getElementById(selectId);
    
    if (select && tipoSelecionado) {
        select.innerHTML = gerarOpcoesSelectCategoriaInvestimentos(tipoSelecionado, categoriaSelecionada);
    }
}

// Configuração dos eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar selects de categorias de investimentos
    atualizarSelectsCategoriaInvestimentos();
    
    // Configurar evento para atualizar subcategorias quando o tipo de investimento mudar
    const tipoInvestimentoSelect = document.getElementById('tipoInvestimento');
    const subcategoriaInvestimentoSelect = document.getElementById('subcategoriaInvestimento');
    
    if (tipoInvestimentoSelect && subcategoriaInvestimentoSelect) {
        tipoInvestimentoSelect.addEventListener('change', function() {
            atualizarSelectSubcategoriaInvestimentos(this.value, 'subcategoriaInvestimento');
        });
    }
    
    // Configurar evento para o select de tipo de investimento no formulário de nova operação
    const tipoInvestimentoOperacaoSelect = document.getElementById('tipoInvestimentoOperacao');
    const subcategoriaInvestimentoOperacaoSelect = document.getElementById('subcategoriaInvestimentoOperacao');
    
    if (tipoInvestimentoOperacaoSelect && subcategoriaInvestimentoOperacaoSelect) {
        tipoInvestimentoOperacaoSelect.addEventListener('change', function() {
            atualizarSelectSubcategoriaInvestimentos(this.value, 'subcategoriaInvestimentoOperacao');
        });
    }
});

// Exportar funções para uso em outros módulos
window.investmentCategoryController = {
    obterTodasCategoriasInvestimentos,
    obterCategoriasInvestimentosPorTipo,
    obterCategoriaInvestimentoPorId,
    gerarOpcoesSelectCategoriaInvestimentos,
    atualizarSelectsCategoriaInvestimentos,
    atualizarSelectSubcategoriaInvestimentos
};
