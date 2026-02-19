-- ================================================================
-- SEED DATA SIMPLIFICADO - DADOS FICTÍCIOS PARA TESTE (2025)
-- ================================================================
-- INSTRUÇÕES:
-- 1. Faça login no Supabase
-- 2. Execute: SELECT auth.uid(); para obter seu user_id
-- 3. Copie o UUID retornado
-- 4. Substitua 'f56be6ae-be52-4c98-9ed2-abda61ecfed6' por seu UUID real
-- 5. Execute este arquivo completo
-- 
-- ⚠️  ATENÇÃO: Todos os dados são de MARÇO A JULHO de 2025
-- ================================================================
-- SUBSTITUA 'f56be6ae-be52-4c98-9ed2-abda61ecfed6' PELO SEU UUID REAL
-- Exemplo: '12345678-1234-1234-1234-123456789012'
-- ================================================================
-- CATEGORIAS FINANCEIRAS
-- ================================================================
INSERT INTO public.categorias (user_id, nome, tipo, cor, icone)
VALUES -- Receitas
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Salário',
        'receita',
        '#10B981',
        'DollarSign'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Freelance',
        'receita',
        '#3B82F6',
        'Briefcase'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Investimentos',
        'receita',
        '#8B5CF6',
        'TrendingUp'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Vendas',
        'receita',
        '#F59E0B',
        'ShoppingBag'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Aluguel Recebido',
        'receita',
        '#059669',
        'Home'
    ),
    -- Despesas
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Alimentação',
        'despesa',
        '#EF4444',
        'Utensils'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Transporte',
        'despesa',
        '#F97316',
        'Car'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Moradia',
        'despesa',
        '#6366F1',
        'Home'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Saúde',
        'despesa',
        '#EC4899',
        'Heart'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Educação',
        'despesa',
        '#14B8A6',
        'BookOpen'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Lazer',
        'despesa',
        '#8B5CF6',
        'Gamepad2'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Roupas',
        'despesa',
        '#F59E0B',
        'Shirt'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Tecnologia',
        'despesa',
        '#6B7280',
        'Smartphone'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Serviços',
        'despesa',
        '#84CC16',
        'Settings'
    );
-- ================================================================
-- RECEITAS FICTÍCIAS (MARÇO A JULHO 2025)
-- ================================================================
INSERT INTO public.receitas (user_id, categoria_id, descricao, valor, data)
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Salário'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Salário Março 2025',
        5500.00,
        '2025-03-05'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Freelance'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Projeto Website Cliente A',
        2800.00,
        '2025-03-15'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Investimentos'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Dividendos Ações',
        450.00,
        '2025-03-20'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Salário'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Salário Abril 2025',
        5500.00,
        '2025-04-05'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Vendas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Venda Produto Digital',
        1200.00,
        '2025-04-25'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Freelance'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Consultoria Empresa B',
        3200.00,
        '2025-05-10'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Aluguel Recebido'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Aluguel Apartamento',
        1800.00,
        '2025-06-15'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Investimentos'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Rendimento Poupança',
        120.00,
        '2025-07-30'
    );
-- ================================================================
-- DESPESAS FICTÍCIAS (MARÇO A JULHO 2025)
-- ================================================================
INSERT INTO public.despesas (user_id, categoria_id, descricao, valor, data)
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Alimentação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Supermercado Pão de Açúcar',
        450.00,
        '2025-03-03'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Transporte'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Combustível Posto Shell',
        280.00,
        '2025-03-05'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Moradia'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Aluguel Apartamento',
        1800.00,
        '2025-03-10'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Saúde'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Consulta Médica',
        200.00,
        '2025-03-12'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Alimentação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Restaurante Japonês',
        120.00,
        '2025-04-15'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Lazer'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Cinema + Pipoca',
        65.00,
        '2025-04-18'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Tecnologia'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Netflix Mensalidade',
        45.00,
        '2025-04-20'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Roupas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Camisa Social',
        89.00,
        '2025-05-22'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Serviços'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Corte de Cabelo',
        35.00,
        '2025-05-25'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Alimentação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Supermercado Extra',
        520.00,
        '2025-06-05'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Transporte'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Uber + 99',
        180.00,
        '2025-06-08'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Moradia'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Conta de Luz',
        220.00,
        '2025-06-12'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Educação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Curso Online Udemy',
        150.00,
        '2025-07-15'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Lazer'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Show Música',
        180.00,
        '2025-07-20'
    );
-- ================================================================
-- TRANSAÇÕES RECENTES (JULHO 2025)
-- ================================================================
INSERT INTO public.transacoes (
        user_id,
        categoria_id,
        tipo,
        descricao,
        valor,
        data
    )
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Alimentação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'despesa',
        'Padaria da Esquina',
        25.50,
        '2025-07-25'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Transporte'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'despesa',
        'Uber para Trabalho',
        18.00,
        '2025-07-24'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Freelance'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'receita',
        'Pagamento Cliente C',
        800.00,
        '2025-07-23'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Lazer'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'despesa',
        'Streaming Spotify',
        21.90,
        '2025-07-21'
    );
-- ================================================================
-- DÍVIDAS (VENCIMENTOS EM 2025)
-- ================================================================
INSERT INTO public.dividas (
        user_id,
        categoria_id,
        descricao,
        valor_total,
        valor_pago,
        data_vencimento,
        parcelas,
        parcelas_pagas,
        credor
    )
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Tecnologia'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Notebook Dell Inspiron',
        3200.00,
        1600.00,
        '2025-06-15',
        10,
        5,
        'Loja TechWorld'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Moradia'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Móveis Sala de Estar',
        2800.00,
        800.00,
        '2025-08-20',
        8,
        2,
        'Móveis & Cia'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Transporte'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Financiamento Carro',
        45000.00,
        12000.00,
        '2026-12-15',
        48,
        12,
        'Banco do Brasil'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Saúde'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Plano Odontológico',
        450.00,
        0.00,
        '2025-03-05',
        1,
        0,
        'OdontoPrev'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias
            WHERE nome = 'Educação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Curso de Inglês',
        1200.00,
        1200.00,
        '2025-02-28',
        12,
        12,
        'Wizard Idiomas'
    );
-- ================================================================
-- CATEGORIAS DE METAS
-- ================================================================
INSERT INTO public.categorias_metas (user_id, nome, cor, descricao)
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Emergência',
        '#EF4444',
        'Reserva para emergências e imprevistos'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Viagem',
        '#3B82F6',
        'Economias para viagens e férias'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Investimentos',
        '#10B981',
        'Aportes em investimentos'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Casa Própria',
        '#F59E0B',
        'Economia para compra da casa própria'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Educação',
        '#8B5CF6',
        'Investimento em cursos e formação'
    );
-- ================================================================
-- METAS FINANCEIRAS (2025)
-- ================================================================
INSERT INTO public.metas (
        user_id,
        categoria_meta_id,
        titulo,
        tipo,
        valor_alvo,
        valor_atual,
        data_inicio,
        data_limite,
        descricao
    )
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_metas
            WHERE nome = 'Emergência'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Reserva de Emergência',
        'economia',
        10000.00,
        6500.00,
        '2025-01-01',
        '2025-12-31',
        'Reserva equivalente a 6 meses de gastos'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_metas
            WHERE nome = 'Viagem'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Viagem Europa',
        'economia',
        8000.00,
        3200.00,
        '2025-03-01',
        '2025-07-31',
        'Viagem de 15 dias pela Europa'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_metas
            WHERE nome = 'Investimentos'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Aportes Mensais',
        'investimento',
        12000.00,
        4800.00,
        '2025-01-01',
        '2025-12-31',
        'Aportar R$ 1.000 por mês'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_metas
            WHERE nome = 'Casa Própria'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Entrada Apartamento',
        'economia',
        50000.00,
        35000.00,
        '2025-01-01',
        '2025-06-30',
        'Entrada para financiamento imobiliário'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_metas
            WHERE nome = 'Educação'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Curso de Programação',
        'economia',
        2500.00,
        2500.00,
        '2025-01-01',
        '2025-07-31',
        'Bootcamp Full Stack'
    );
-- ================================================================
-- CATEGORIAS DE MERCADO
-- ================================================================
INSERT INTO public.categorias_mercado (user_id, nome, descricao, cor)
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Alimentação Básica',
        'Itens essenciais de alimentação',
        '#10B981'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Limpeza',
        'Produtos de limpeza e higiene',
        '#3B82F6'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Higiene Pessoal',
        'Produtos de cuidado pessoal',
        '#8B5CF6'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Bebidas',
        'Bebidas em geral',
        '#F59E0B'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Carnes e Proteínas',
        'Carnes, peixes e proteínas',
        '#EF4444'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Laticínios',
        'Leite, queijos e derivados',
        '#06B6D4'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Frutas e Verduras',
        'Hortifruti em geral',
        '#84CC16'
    );
-- ================================================================
-- ITENS DE MERCADO
-- ================================================================
INSERT INTO public.itens_mercado (
        user_id,
        categoria_mercado_id,
        descricao,
        unidade_medida,
        quantidade_atual,
        quantidade_ideal,
        preco_atual
    )
VALUES -- Alimentação Básica
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Alimentação Básica'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Arroz Branco 5kg',
        'pacote',
        1,
        2,
        25.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Alimentação Básica'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Feijão Preto 1kg',
        'pacote',
        0,
        3,
        8.50
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Alimentação Básica'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Macarrão Espaguete',
        'pacote',
        2,
        4,
        4.20
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Alimentação Básica'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Óleo de Soja 900ml',
        'garrafa',
        1,
        2,
        6.80
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Alimentação Básica'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Sal Refinado 1kg',
        'pacote',
        0,
        1,
        2.50
    ),
    -- Limpeza
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Limpeza'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Detergente Líquido',
        'frasco',
        1,
        3,
        2.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Limpeza'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Papel Higiênico 12 rolos',
        'pacote',
        0,
        1,
        18.50
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Limpeza'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Sabão em Pó 1kg',
        'caixa',
        1,
        2,
        12.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Limpeza'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Desinfetante 500ml',
        'frasco',
        0,
        2,
        4.50
    ),
    -- Higiene Pessoal
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Higiene Pessoal'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Shampoo 400ml',
        'frasco',
        1,
        2,
        15.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Higiene Pessoal'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Pasta de Dente',
        'tubo',
        2,
        3,
        8.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Higiene Pessoal'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Sabonete 90g',
        'unidade',
        1,
        4,
        2.80
    ),
    -- Bebidas
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Bebidas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Café em Pó 500g',
        'pacote',
        1,
        2,
        12.50
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Bebidas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Suco de Laranja 1L',
        'caixa',
        0,
        2,
        6.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Bebidas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Refrigerante 2L',
        'garrafa',
        1,
        2,
        8.50
    ),
    -- Carnes e Proteínas
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Carnes e Proteínas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Frango Inteiro',
        'kg',
        0,
        2,
        8.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Carnes e Proteínas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Carne Moída',
        'kg',
        1,
        1,
        18.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Carnes e Proteínas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Ovos Brancos 12 unidades',
        'dúzia',
        1,
        2,
        8.50
    ),
    -- Laticínios
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Laticínios'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Leite Integral 1L',
        'caixa',
        2,
        4,
        4.50
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Laticínios'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Queijo Mussarela',
        'kg',
        0,
        1,
        35.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Laticínios'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Iogurte Natural',
        'pote',
        1,
        3,
        5.90
    ),
    -- Frutas e Verduras
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Frutas e Verduras'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Banana Prata',
        'kg',
        0,
        2,
        4.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Frutas e Verduras'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Tomate',
        'kg',
        1,
        2,
        7.50
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Frutas e Verduras'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Cebola',
        'kg',
        1,
        1,
        3.90
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM categorias_mercado
            WHERE nome = 'Frutas e Verduras'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        'Alface',
        'unidade',
        0,
        1,
        2.50
    );
-- ================================================================
-- ORÇAMENTOS DE MERCADO (2025)
-- ================================================================
INSERT INTO public.orcamentos_mercado (
        user_id,
        categoria_despesa,
        valor_orcamento,
        estimativa_gastos,
        mes_referencia
    )
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Alimentação',
        800.00,
        650.00,
        '2025-03-01'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Limpeza',
        150.00,
        120.00,
        '2025-04-01'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Higiene Pessoal',
        100.00,
        85.00,
        '2025-05-01'
    );
-- ================================================================
-- VEÍCULOS (AQUISIÇÃO EM 2025)
-- ================================================================
INSERT INTO public.veiculos (
        user_id,
        marca,
        modelo,
        ano,
        placa,
        cor,
        combustivel,
        data_aquisicao,
        quilometragem
    )
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Honda',
        'Civic',
        '2020',
        'ABC-1234',
        'Prata',
        'Flex',
        '2025-03-15',
        45000
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Yamaha',
        'Factor 125',
        '2019',
        'XYZ-9876',
        'Azul',
        'Gasolina',
        '2025-04-22',
        28000
    );
-- ================================================================
-- TIPOS DE MANUTENÇÃO
-- ================================================================
INSERT INTO public.tipos_manutencao (user_id, nome, sistema, intervalo_km, descricao)
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Troca de Óleo',
        'Motor',
        10000,
        'Troca de óleo e filtro do motor'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Revisão Geral',
        'Geral',
        20000,
        'Revisão completa do veículo'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Troca de Pastilhas',
        'Freios',
        30000,
        'Substituição das pastilhas de freio'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Alinhamento',
        'Suspensão',
        15000,
        'Alinhamento e balanceamento'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Troca de Filtros',
        'Motor',
        15000,
        'Troca de filtro de ar e combustível'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Revisão Elétrica',
        'Elétrico',
        25000,
        'Verificação do sistema elétrico'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Troca de Pneus',
        'Rodas',
        40000,
        'Substituição dos pneus'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        'Troca de Correia',
        'Motor',
        50000,
        'Troca da correia dentada'
    );
-- ================================================================
-- MANUTENÇÕES (2025)
-- ================================================================
INSERT INTO public.manutencoes (
        user_id,
        veiculo_id,
        tipo_manutencao_id,
        quilometragem_realizada,
        data_realizada,
        quilometragem_proxima,
        status,
        observacoes
    )
VALUES (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM veiculos
            WHERE modelo = 'Civic'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        (
            SELECT id
            FROM tipos_manutencao
            WHERE nome = 'Troca de Óleo'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        40000,
        '2025-03-15',
        50000,
        'realizada',
        'Óleo Mobil 1 sintético'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM veiculos
            WHERE modelo = 'Civic'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        (
            SELECT id
            FROM tipos_manutencao
            WHERE nome = 'Alinhamento'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        42000,
        '2025-04-20',
        57000,
        'realizada',
        'Alinhamento e balanceamento ok'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM veiculos
            WHERE modelo = 'Civic'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        (
            SELECT id
            FROM tipos_manutencao
            WHERE nome = 'Revisão Geral'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        NULL,
        NULL,
        60000,
        'pendente',
        'Próxima revisão aos 60.000 km'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM veiculos
            WHERE modelo = 'Factor 125'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        (
            SELECT id
            FROM tipos_manutencao
            WHERE nome = 'Troca de Óleo'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        NULL,
        NULL,
        30000,
        'pendente',
        'Óleo para moto'
    ),
    (
        'f56be6ae-be52-4c98-9ed2-abda61ecfed6',
        (
            SELECT id
            FROM veiculos
            WHERE modelo = 'Civic'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        (
            SELECT id
            FROM tipos_manutencao
            WHERE nome = 'Troca de Pastilhas'
                AND user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
        ),
        NULL,
        NULL,
        75000,
        'pendente',
        'Verificar pastilhas dianteiras'
    );
-- ================================================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ================================================================
-- Execute a query abaixo para verificar se todos os dados foram inseridos:
/*
 SELECT 'categorias' as tabela, count(*) as total FROM categorias WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'receitas', count(*) FROM receitas WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'despesas', count(*) FROM despesas WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'transacoes', count(*) FROM transacoes WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'dividas', count(*) FROM dividas WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'metas', count(*) FROM metas WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'itens_mercado', count(*) FROM itens_mercado WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6'
 UNION ALL
 SELECT 'veiculos', count(*) FROM veiculos WHERE user_id = 'f56be6ae-be52-4c98-9ed2-abda61ecfed6';
 */
-- ================================================================
-- DADOS INSERIDOS COM SUCESSO! 🎉
-- ================================================================