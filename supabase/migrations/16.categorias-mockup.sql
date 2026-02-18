-- ================================================================
-- SEED DATA SIMPLIFICADO - DADOS FICTÍCIOS PARA TESTE (2025)
-- ================================================================
-- INSTRUÇÕES:
-- 1. Faça login no Supabase
-- 2. Execute: SELECT auth.uid(); para obter seu user_id
-- 3. Copie o UUID retornado
-- 4. Substitua '6846e082-b6a4-4f2d-a63f-6e628902803f' por seu UUID real
-- 5. Execute este arquivo completo
-- 
-- ⚠️  ATENÇÃO: Todos os dados são de MARÇO A JULHO de 2025
-- ================================================================

-- SUBSTITUA '6846e082-b6a4-4f2d-a63f-6e628902803f' PELO SEU UUID REAL
-- Exemplo: '12345678-1234-1234-1234-123456789012'

-- ================================================================
-- CATEGORIAS FINANCEIRAS
-- ================================================================
INSERT INTO public.categorias (user_id, nome, tipo, cor, icone) VALUES
-- Receitas
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Salário', 'receita', '#10B981', 'DollarSign'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Freelance', 'receita', '#3B82F6', 'Briefcase'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Investimentos', 'receita', '#8B5CF6', 'TrendingUp'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Vendas', 'receita', '#F59E0B', 'ShoppingBag'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Aluguel Recebido', 'receita', '#059669', 'Home'),

-- Despesas
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Alimentação', 'despesa', '#EF4444', 'Utensils'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Transporte', 'despesa', '#F97316', 'Car'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Moradia', 'despesa', '#6366F1', 'Home'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Saúde', 'despesa', '#EC4899', 'Heart'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Educação', 'despesa', '#14B8A6', 'BookOpen'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Lazer', 'despesa', '#8B5CF6', 'Gamepad2'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Roupas', 'despesa', '#F59E0B', 'Shirt'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Tecnologia', 'despesa', '#6B7280', 'Smartphone'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Serviços', 'despesa', '#84CC16', 'Settings');

-- ================================================================
-- RECEITAS FICTÍCIAS (MARÇO A JULHO 2025)
-- ================================================================
INSERT INTO public.receitas (user_id, categoria_id, descricao, valor, data) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Salário' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Salário Março 2025', 5500.00, '2025-03-05'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Freelance' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Projeto Website Cliente A', 2800.00, '2025-03-15'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Investimentos' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Dividendos Ações', 450.00, '2025-03-20'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Salário' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Salário Abril 2025', 5500.00, '2025-04-05'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Vendas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Venda Produto Digital', 1200.00, '2025-04-25'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Freelance' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Consultoria Empresa B', 3200.00, '2025-05-10'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Aluguel Recebido' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Aluguel Apartamento', 1800.00, '2025-06-15'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Investimentos' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Rendimento Poupança', 120.00, '2025-07-30');

-- ================================================================
-- DESPESAS FICTÍCIAS (MARÇO A JULHO 2025)
-- ================================================================
INSERT INTO public.despesas (user_id, categoria_id, descricao, valor, data) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Alimentação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Supermercado Pão de Açúcar', 450.00, '2025-03-03'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Transporte' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Combustível Posto Shell', 280.00, '2025-03-05'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Moradia' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Aluguel Apartamento', 1800.00, '2025-03-10'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Saúde' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Consulta Médica', 200.00, '2025-03-12'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Alimentação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Restaurante Japonês', 120.00, '2025-04-15'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Lazer' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Cinema + Pipoca', 65.00, '2025-04-18'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Tecnologia' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Netflix Mensalidade', 45.00, '2025-04-20'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Roupas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Camisa Social', 89.00, '2025-05-22'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Serviços' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Corte de Cabelo', 35.00, '2025-05-25'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Alimentação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Supermercado Extra', 520.00, '2025-06-05'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Transporte' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Uber + 99', 180.00, '2025-06-08'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Moradia' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Conta de Luz', 220.00, '2025-06-12'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Educação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Curso Online Udemy', 150.00, '2025-07-15'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Lazer' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Show Música', 180.00, '2025-07-20');

-- ================================================================
-- TRANSAÇÕES RECENTES (JULHO 2025)
-- ================================================================
INSERT INTO public.transacoes (user_id, categoria_id, tipo, descricao, valor, data) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Alimentação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'despesa', 'Padaria da Esquina', 25.50, '2025-07-25'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Transporte' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'despesa', 'Uber para Trabalho', 18.00, '2025-07-24'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Freelance' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'receita', 'Pagamento Cliente C', 800.00, '2025-07-23'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Lazer' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'despesa', 'Streaming Spotify', 21.90, '2025-07-21');

-- ================================================================
-- DÍVIDAS (VENCIMENTOS EM 2025)
-- ================================================================
INSERT INTO public.dividas (user_id, categoria_id, descricao, valor_total, valor_pago, data_vencimento, parcelas, parcelas_pagas, credor) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Tecnologia' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Notebook Dell Inspiron', 3200.00, 1600.00, '2025-06-15', 10, 5, 'Loja TechWorld'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Moradia' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Móveis Sala de Estar', 2800.00, 800.00, '2025-08-20', 8, 2, 'Móveis & Cia'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Transporte' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Financiamento Carro', 45000.00, 12000.00, '2026-12-15', 48, 12, 'Banco do Brasil'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Saúde' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Plano Odontológico', 450.00, 0.00, '2025-03-05', 1, 0, 'OdontoPrev'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias WHERE nome = 'Educação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Curso de Inglês', 1200.00, 1200.00, '2025-02-28', 12, 12, 'Wizard Idiomas');

-- ================================================================
-- CATEGORIAS DE METAS
-- ================================================================
INSERT INTO public.categorias_metas (user_id, nome, cor, descricao) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Emergência', '#EF4444', 'Reserva para emergências e imprevistos'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Viagem', '#3B82F6', 'Economias para viagens e férias'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Investimentos', '#10B981', 'Aportes em investimentos'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Casa Própria', '#F59E0B', 'Economia para compra da casa própria'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Educação', '#8B5CF6', 'Investimento em cursos e formação');

-- ================================================================
-- METAS FINANCEIRAS (2025)
-- ================================================================
INSERT INTO public.metas (user_id, categoria_meta_id, titulo, tipo, valor_alvo, valor_atual, data_inicio, data_limite, descricao) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_metas WHERE nome = 'Emergência' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Reserva de Emergência', 'economia', 10000.00, 6500.00, '2025-01-01', '2025-12-31', 'Reserva equivalente a 6 meses de gastos'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_metas WHERE nome = 'Viagem' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Viagem Europa', 'economia', 8000.00, 3200.00, '2025-03-01', '2025-07-31', 'Viagem de 15 dias pela Europa'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_metas WHERE nome = 'Investimentos' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Aportes Mensais', 'investimento', 12000.00, 4800.00, '2025-01-01', '2025-12-31', 'Aportar R$ 1.000 por mês'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_metas WHERE nome = 'Casa Própria' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Entrada Apartamento', 'economia', 50000.00, 35000.00, '2025-01-01', '2025-06-30', 'Entrada para financiamento imobiliário'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_metas WHERE nome = 'Educação' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Curso de Programação', 'economia', 2500.00, 2500.00, '2025-01-01', '2025-07-31', 'Bootcamp Full Stack');

-- ================================================================
-- CATEGORIAS DE MERCADO
-- ================================================================
INSERT INTO public.categorias_mercado (user_id, nome, descricao, cor) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Alimentação Básica', 'Itens essenciais de alimentação', '#10B981'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Limpeza', 'Produtos de limpeza e higiene', '#3B82F6'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Higiene Pessoal', 'Produtos de cuidado pessoal', '#8B5CF6'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Bebidas', 'Bebidas em geral', '#F59E0B'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Carnes e Proteínas', 'Carnes, peixes e proteínas', '#EF4444'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Laticínios', 'Leite, queijos e derivados', '#06B6D4'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Frutas e Verduras', 'Hortifruti em geral', '#84CC16');

-- ================================================================
-- ITENS DE MERCADO
-- ================================================================
INSERT INTO public.itens_mercado (user_id, categoria_mercado_id, descricao, unidade_medida, quantidade_atual, quantidade_ideal, preco_atual) VALUES
-- Alimentação Básica
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Alimentação Básica' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Arroz Branco 5kg', 'pacote', 1, 2, 25.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Alimentação Básica' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Feijão Preto 1kg', 'pacote', 0, 3, 8.50),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Alimentação Básica' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Macarrão Espaguete', 'pacote', 2, 4, 4.20),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Alimentação Básica' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Óleo de Soja 900ml', 'garrafa', 1, 2, 6.80),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Alimentação Básica' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Sal Refinado 1kg', 'pacote', 0, 1, 2.50),

-- Limpeza
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Limpeza' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Detergente Líquido', 'frasco', 1, 3, 2.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Limpeza' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Papel Higiênico 12 rolos', 'pacote', 0, 1, 18.50),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Limpeza' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Sabão em Pó 1kg', 'caixa', 1, 2, 12.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Limpeza' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Desinfetante 500ml', 'frasco', 0, 2, 4.50),

-- Higiene Pessoal
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Higiene Pessoal' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Shampoo 400ml', 'frasco', 1, 2, 15.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Higiene Pessoal' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Pasta de Dente', 'tubo', 2, 3, 8.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Higiene Pessoal' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Sabonete 90g', 'unidade', 1, 4, 2.80),

-- Bebidas
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Bebidas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Café em Pó 500g', 'pacote', 1, 2, 12.50),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Bebidas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Suco de Laranja 1L', 'caixa', 0, 2, 6.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Bebidas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Refrigerante 2L', 'garrafa', 1, 2, 8.50),

-- Carnes e Proteínas
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Carnes e Proteínas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Frango Inteiro', 'kg', 0, 2, 8.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Carnes e Proteínas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Carne Moída', 'kg', 1, 1, 18.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Carnes e Proteínas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Ovos Brancos 12 unidades', 'dúzia', 1, 2, 8.50),

-- Laticínios
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Laticínios' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Leite Integral 1L', 'caixa', 2, 4, 4.50),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Laticínios' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Queijo Mussarela', 'kg', 0, 1, 35.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Laticínios' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Iogurte Natural', 'pote', 1, 3, 5.90),

-- Frutas e Verduras
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Frutas e Verduras' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Banana Prata', 'kg', 0, 2, 4.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Frutas e Verduras' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Tomate', 'kg', 1, 2, 7.50),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Frutas e Verduras' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Cebola', 'kg', 1, 1, 3.90),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM categorias_mercado WHERE nome = 'Frutas e Verduras' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 'Alface', 'unidade', 0, 1, 2.50);

-- ================================================================
-- ORÇAMENTOS DE MERCADO (2025)
-- ================================================================
INSERT INTO public.orcamentos_mercado (user_id, categoria_despesa, valor_orcamento, estimativa_gastos, mes_referencia) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Alimentação', 800.00, 650.00, '2025-03-01'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Limpeza', 150.00, 120.00, '2025-04-01'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Higiene Pessoal', 100.00, 85.00, '2025-05-01');

-- ================================================================
-- VEÍCULOS (AQUISIÇÃO EM 2025)
-- ================================================================
INSERT INTO public.veiculos (user_id, marca, modelo, ano, placa, cor, combustivel, data_aquisicao, quilometragem) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Honda', 'Civic', '2020', 'ABC-1234', 'Prata', 'Flex', '2025-03-15', 45000),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Yamaha', 'Factor 125', '2019', 'XYZ-9876', 'Azul', 'Gasolina', '2025-04-22', 28000);

-- ================================================================
-- TIPOS DE MANUTENÇÃO
-- ================================================================
INSERT INTO public.tipos_manutencao (user_id, nome, sistema, intervalo_km, descricao) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Troca de Óleo', 'Motor', 10000, 'Troca de óleo e filtro do motor'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Revisão Geral', 'Geral', 20000, 'Revisão completa do veículo'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Troca de Pastilhas', 'Freios', 30000, 'Substituição das pastilhas de freio'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Alinhamento', 'Suspensão', 15000, 'Alinhamento e balanceamento'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Troca de Filtros', 'Motor', 15000, 'Troca de filtro de ar e combustível'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Revisão Elétrica', 'Elétrico', 25000, 'Verificação do sistema elétrico'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Troca de Pneus', 'Rodas', 40000, 'Substituição dos pneus'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', 'Troca de Correia', 'Motor', 50000, 'Troca da correia dentada');

-- ================================================================
-- MANUTENÇÕES (2025)
-- ================================================================
INSERT INTO public.manutencoes (user_id, veiculo_id, tipo_manutencao_id, quilometragem_realizada, data_realizada, quilometragem_proxima, status, observacoes) VALUES
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM veiculos WHERE modelo = 'Civic' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), (SELECT id FROM tipos_manutencao WHERE nome = 'Troca de Óleo' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 40000, '2025-03-15', 50000, 'realizada', 'Óleo Mobil 1 sintético'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM veiculos WHERE modelo = 'Civic' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), (SELECT id FROM tipos_manutencao WHERE nome = 'Alinhamento' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), 42000, '2025-04-20', 57000, 'realizada', 'Alinhamento e balanceamento ok'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM veiculos WHERE modelo = 'Civic' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), (SELECT id FROM tipos_manutencao WHERE nome = 'Revisão Geral' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), NULL, NULL, 60000, 'pendente', 'Próxima revisão aos 60.000 km'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM veiculos WHERE modelo = 'Factor 125' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), (SELECT id FROM tipos_manutencao WHERE nome = 'Troca de Óleo' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), NULL, NULL, 30000, 'pendente', 'Óleo para moto'),
('6846e082-b6a4-4f2d-a63f-6e628902803f', (SELECT id FROM veiculos WHERE modelo = 'Civic' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), (SELECT id FROM tipos_manutencao WHERE nome = 'Troca de Pastilhas' AND user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'), NULL, NULL, 75000, 'pendente', 'Verificar pastilhas dianteiras');

-- ================================================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ================================================================
-- Execute a query abaixo para verificar se todos os dados foram inseridos:
/*
SELECT 'categorias' as tabela, count(*) as total FROM categorias WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'receitas', count(*) FROM receitas WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'despesas', count(*) FROM despesas WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'transacoes', count(*) FROM transacoes WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'dividas', count(*) FROM dividas WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'metas', count(*) FROM metas WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'itens_mercado', count(*) FROM itens_mercado WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f'
UNION ALL
SELECT 'veiculos', count(*) FROM veiculos WHERE user_id = '6846e082-b6a4-4f2d-a63f-6e628902803f';
*/

-- ================================================================
-- DADOS INSERIDOS COM SUCESSO! 🎉
-- ================================================================