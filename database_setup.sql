-- =============================================
-- FOODCOST - ESTRUTURA COMPLETA DO BANCO DE DADOS
-- Sistema Multi-Cliente para Supabase
-- =============================================

-- 1. TABELA DE CLIENTES (USUÁRIOS)
-- =============================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 2. TABELA DE INSUMOS (RAW MATERIALS)
-- =============================================
CREATE TABLE IF NOT EXISTS raw_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  measurement_unit VARCHAR(20) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  supplier VARCHAR(255),
  minimum_stock DECIMAL(10,2) DEFAULT 0,
  current_stock DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_id, code)
);

-- 3. TABELA DE PRODUTOS
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  portion_yield DECIMAL(10,2) NOT NULL DEFAULT 1,
  portion_unit VARCHAR(20) NOT NULL DEFAULT 'porções',
  selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA DE INGREDIENTES DOS PRODUTOS
-- =============================================
CREATE TABLE IF NOT EXISTS product_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  raw_material_id UUID NOT NULL REFERENCES raw_materials(id) ON DELETE CASCADE,
  quantity DECIMAL(10,3) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA DE DESPESAS FIXAS
-- =============================================
CREATE TABLE IF NOT EXISTS fixed_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('mensal', 'trimestral', 'semestral', 'anual')),
  due_date INTEGER NOT NULL CHECK (due_date >= 1 AND due_date <= 31),
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA DE DESPESAS VARIÁVEIS
-- =============================================
CREATE TABLE IF NOT EXISTS variable_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  payment_method VARCHAR(50),
  receipt VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABELA DE VENDAS
-- =============================================
CREATE TABLE IF NOT EXISTS sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sale_date DATE NOT NULL,
  total_sales DECIMAL(10,2) NOT NULL,
  number_of_orders INTEGER NOT NULL,
  average_ticket DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ÍNDICES PARA PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_raw_materials_client_id ON raw_materials(client_id);
CREATE INDEX IF NOT EXISTS idx_products_client_id ON products(client_id);
CREATE INDEX IF NOT EXISTS idx_product_ingredients_product_id ON product_ingredients(product_id);
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_client_id ON fixed_expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_variable_expenses_client_id ON variable_expenses(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_client_id ON sales(client_id);
CREATE INDEX IF NOT EXISTS idx_sales_date ON sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_variable_expenses_date ON variable_expenses(expense_date);

-- =============================================
-- FUNÇÕES DE TRIGGER PARA UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_raw_materials_updated_at BEFORE UPDATE ON raw_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixed_expenses_updated_at BEFORE UPDATE ON fixed_expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar last_modified em products
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_last_modified BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_last_modified_column();

-- =============================================
-- DADOS DE EXEMPLO
-- =============================================

-- Cliente 1: Restaurante do João
INSERT INTO clients (id, email, password_hash, name, company_name, phone) VALUES 
('11111111-1111-1111-1111-111111111111', 'joao@restaurante.com', '$2b$10$example_hash_password_123', 'João Silva', 'Restaurante do João', '(11) 99999-9999');

-- Cliente 2: Padaria da Maria
INSERT INTO clients (id, email, password_hash, name, company_name, phone) VALUES 
('22222222-2222-2222-2222-222222222222', 'maria@padaria.com', '$2b$10$example_hash_password_456', 'Maria Santos', 'Padaria da Maria', '(11) 88888-8888');

-- INSUMOS - Cliente 1 (João)
INSERT INTO raw_materials (client_id, code, name, category, measurement_unit, unit_price, supplier, minimum_stock, current_stock) VALUES 
('11111111-1111-1111-1111-111111111111', 'FRG001', 'Peito de Frango', 'Carnes', 'kg', 15.50, 'Frigorífico ABC', 5.0, 20.0),
('11111111-1111-1111-1111-111111111111', 'VEG001', 'Batata', 'Vegetais', 'kg', 3.20, 'Hortifruti Central', 10.0, 25.0),
('11111111-1111-1111-1111-111111111111', 'LAT001', 'Mussarela', 'Laticínios', 'kg', 28.90, 'Laticínios São Paulo', 2.0, 8.0),
('11111111-1111-1111-1111-111111111111', 'GRA001', 'Farinha de Trigo', 'Grãos', 'kg', 4.50, 'Moinho Central', 15.0, 30.0);

-- INSUMOS - Cliente 2 (Maria)
INSERT INTO raw_materials (client_id, code, name, category, measurement_unit, unit_price, supplier, minimum_stock, current_stock) VALUES 
('22222222-2222-2222-2222-222222222222', 'PAD001', 'Farinha Especial', 'Grãos', 'kg', 6.80, 'Moinho Premium', 10.0, 45.0),
('22222222-2222-2222-2222-222222222222', 'PAD002', 'Fermento Biológico', 'Fermentos', 'kg', 12.50, 'Fermento Flex', 1.0, 3.0),
('22222222-2222-2222-2222-222222222222', 'PAD003', 'Açúcar Cristal', 'Açúcares', 'kg', 3.80, 'Usina São João', 20.0, 50.0),
('22222222-2222-2222-2222-222222222222', 'PAD004', 'Ovos', 'Proteínas', 'dúzia', 8.90, 'Granja Feliz', 5.0, 15.0);

-- PRODUTOS - Cliente 1 (João)
INSERT INTO products (id, client_id, name, category, description, portion_yield, portion_unit, selling_price) VALUES 
('aaaa1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Frango Grelhado com Batatas', 'Pratos Principais', 'Peito de frango grelhado acompanhado de batatas assadas', 1, 'porções', 28.50),
('bbbb1111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Pizza Margherita', 'Pizzas', 'Pizza tradicional com mussarela e manjericão', 8, 'fatias', 45.90);

-- PRODUTOS - Cliente 2 (Maria)
INSERT INTO products (id, client_id, name, category, description, portion_yield, portion_unit, selling_price) VALUES 
('aaaa2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Pão Francês', 'Pães', 'Pão francês tradicional crocante', 50, 'unidades', 0.80),
('bbbb2222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Bolo de Chocolate', 'Bolos', 'Bolo de chocolate com cobertura', 12, 'fatias', 6.50);

-- INGREDIENTES DOS PRODUTOS - Cliente 1
-- Frango Grelhado com Batatas
INSERT INTO product_ingredients (product_id, raw_material_id, quantity, total_cost) VALUES 
('aaaa1111-1111-1111-1111-111111111111', (SELECT id FROM raw_materials WHERE code = 'FRG001'), 0.250, 3.88),
('aaaa1111-1111-1111-1111-111111111111', (SELECT id FROM raw_materials WHERE code = 'VEG001'), 0.200, 0.64);

-- Pizza Margherita
INSERT INTO product_ingredients (product_id, raw_material_id, quantity, total_cost) VALUES 
('bbbb1111-1111-1111-1111-111111111111', (SELECT id FROM raw_materials WHERE code = 'GRA001'), 0.300, 1.35),
('bbbb1111-1111-1111-1111-111111111111', (SELECT id FROM raw_materials WHERE code = 'LAT001'), 0.150, 4.34);

-- INGREDIENTES DOS PRODUTOS - Cliente 2
-- Pão Francês
INSERT INTO product_ingredients (product_id, raw_material_id, quantity, total_cost) VALUES 
('aaaa2222-2222-2222-2222-222222222222', (SELECT id FROM raw_materials WHERE code = 'PAD001'), 1.000, 6.80),
('bbbb2222-2222-2222-2222-222222222222', (SELECT id FROM raw_materials WHERE code = 'PAD002'), 0.020, 0.25);

-- Bolo de Chocolate
INSERT INTO product_ingredients (product_id, raw_material_id, quantity, total_cost) VALUES 
('bbbb2222-2222-2222-2222-222222222222', (SELECT id FROM raw_materials WHERE code = 'PAD001'), 0.500, 3.40),
('bbbb2222-2222-2222-2222-222222222222', (SELECT id FROM raw_materials WHERE code = 'PAD003'), 0.300, 1.14),
('bbbb2222-2222-2222-2222-222222222222', (SELECT id FROM raw_materials WHERE code = 'PAD004'), 0.500, 4.45);

-- DESPESAS FIXAS - Cliente 1 (João)
INSERT INTO fixed_expenses (client_id, name, category, amount, frequency, due_date, description, is_active) VALUES 
('11111111-1111-1111-1111-111111111111', 'Aluguel do Restaurante', 'Infraestrutura', 3500.00, 'mensal', 10, 'Aluguel mensal do espaço comercial', true),
('11111111-1111-1111-1111-111111111111', 'Energia Elétrica', 'Utilidades', 800.00, 'mensal', 15, 'Conta de energia elétrica', true),
('11111111-1111-1111-1111-111111111111', 'Seguro do Estabelecimento', 'Seguros', 2400.00, 'anual', 20, 'Seguro contra incêndio e roubo', true);

-- DESPESAS FIXAS - Cliente 2 (Maria)
INSERT INTO fixed_expenses (client_id, name, category, amount, frequency, due_date, description, is_active) VALUES 
('22222222-2222-2222-2222-222222222222', 'Aluguel da Padaria', 'Infraestrutura', 2200.00, 'mensal', 5, 'Aluguel da padaria', true),
('22222222-2222-2222-2222-222222222222', 'Gás', 'Utilidades', 450.00, 'mensal', 12, 'Gás para fornos', true);

-- DESPESAS VARIÁVEIS - Cliente 1 (João)
INSERT INTO variable_expenses (client_id, name, category, amount, expense_date, payment_method, receipt, description) VALUES 
('11111111-1111-1111-1111-111111111111', 'Manutenção do Fogão', 'Manutenção', 250.00, '2024-01-15', 'Dinheiro', 'REC001', 'Reparo no fogão industrial'),
('11111111-1111-1111-1111-111111111111', 'Produtos de Limpeza', 'Limpeza', 180.00, '2024-01-10', 'Cartão', 'REC002', 'Detergentes e desinfetantes'),
('11111111-1111-1111-1111-111111111111', 'Marketing Digital', 'Marketing', 500.00, '2024-01-20', 'PIX', 'REC003', 'Impulsionamento redes sociais');

-- DESPESAS VARIÁVEIS - Cliente 2 (Maria)
INSERT INTO variable_expenses (client_id, name, category, amount, expense_date, payment_method, receipt, description) VALUES 
('22222222-2222-2222-2222-222222222222', 'Manutenção Forno', 'Manutenção', 180.00, '2024-01-12', 'Dinheiro', 'REC004', 'Limpeza do forno'),
('22222222-2222-2222-2222-222222222222', 'Sacolas Plásticas', 'Embalagens', 95.00, '2024-01-08', 'Cartão', 'REC005', 'Sacolas para clientes');

-- VENDAS - Cliente 1 (João)
INSERT INTO sales (client_id, sale_date, total_sales, number_of_orders, average_ticket, notes) VALUES 
('11111111-1111-1111-1111-111111111111', '2024-01-01', 1250.00, 35, 35.71, 'Dia de movimento normal'),
('11111111-1111-1111-1111-111111111111', '2024-01-02', 1480.00, 42, 35.24, 'Movimento bom, muitos pratos principais'),
('11111111-1111-1111-1111-111111111111', '2024-01-03', 980.00, 28, 35.00, 'Quarta-feira mais fraca'),
('11111111-1111-1111-1111-111111111111', '2024-01-04', 1650.00, 45, 36.67, 'Quinta-feira excelente'),
('11111111-1111-1111-1111-111111111111', '2024-01-05', 2100.00, 58, 36.21, 'Sexta-feira cheia');

-- VENDAS - Cliente 2 (Maria)
INSERT INTO sales (client_id, sale_date, total_sales, number_of_orders, average_ticket, notes) VALUES 
('22222222-2222-2222-2222-222222222222', '2024-01-01', 850.00, 120, 7.08, 'Início do ano fraco'),
('22222222-2222-2222-2222-222222222222', '2024-01-02', 950.00, 135, 7.04, 'Movimento normal'),
('22222222-2222-2222-2222-222222222222', '2024-01-03', 1100.00, 148, 7.43, 'Bom movimento de pães'),
('22222222-2222-2222-2222-222222222222', '2024-01-04', 1200.00, 160, 7.50, 'Muitos bolos vendidos'),
('22222222-2222-2222-2222-222222222222', '2024-01-05', 1350.00, 180, 7.50, 'Sexta excelente');

-- =============================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY)
-- =============================================

-- Ativar RLS nas tabelas
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE variable_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;

-- Políticas para clients (apenas o próprio usuário pode ver seus dados)
CREATE POLICY "Users can view own profile" ON clients FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON clients FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para raw_materials
CREATE POLICY "Users can view own raw_materials" ON raw_materials FOR SELECT USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can insert own raw_materials" ON raw_materials FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);
CREATE POLICY "Users can update own raw_materials" ON raw_materials FOR UPDATE USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can delete own raw_materials" ON raw_materials FOR DELETE USING (auth.uid()::text = client_id::text);

-- Políticas para products
CREATE POLICY "Users can view own products" ON products FOR SELECT USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can insert own products" ON products FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);
CREATE POLICY "Users can update own products" ON products FOR UPDATE USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can delete own products" ON products FOR DELETE USING (auth.uid()::text = client_id::text);

-- Políticas para product_ingredients
CREATE POLICY "Users can view own product_ingredients" ON product_ingredients FOR SELECT 
USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_ingredients.product_id AND auth.uid()::text = products.client_id::text));
CREATE POLICY "Users can insert own product_ingredients" ON product_ingredients FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM products WHERE products.id = product_ingredients.product_id AND auth.uid()::text = products.client_id::text));
CREATE POLICY "Users can update own product_ingredients" ON product_ingredients FOR UPDATE 
USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_ingredients.product_id AND auth.uid()::text = products.client_id::text));
CREATE POLICY "Users can delete own product_ingredients" ON product_ingredients FOR DELETE 
USING (EXISTS (SELECT 1 FROM products WHERE products.id = product_ingredients.product_id AND auth.uid()::text = products.client_id::text));

-- Políticas para fixed_expenses
CREATE POLICY "Users can view own fixed_expenses" ON fixed_expenses FOR SELECT USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can insert own fixed_expenses" ON fixed_expenses FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);
CREATE POLICY "Users can update own fixed_expenses" ON fixed_expenses FOR UPDATE USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can delete own fixed_expenses" ON fixed_expenses FOR DELETE USING (auth.uid()::text = client_id::text);

-- Políticas para variable_expenses
CREATE POLICY "Users can view own variable_expenses" ON variable_expenses FOR SELECT USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can insert own variable_expenses" ON variable_expenses FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);
CREATE POLICY "Users can update own variable_expenses" ON variable_expenses FOR UPDATE USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can delete own variable_expenses" ON variable_expenses FOR DELETE USING (auth.uid()::text = client_id::text);

-- Políticas para sales
CREATE POLICY "Users can view own sales" ON sales FOR SELECT USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can insert own sales" ON sales FOR INSERT WITH CHECK (auth.uid()::text = client_id::text);
CREATE POLICY "Users can update own sales" ON sales FOR UPDATE USING (auth.uid()::text = client_id::text);
CREATE POLICY "Users can delete own sales" ON sales FOR DELETE USING (auth.uid()::text = client_id::text);

-- =============================================
-- VIEWS ÚTEIS PARA RELATÓRIOS
-- =============================================

-- View para produtos com custo total dos ingredientes
CREATE OR REPLACE VIEW products_with_costs AS
SELECT 
  p.*,
  COALESCE(SUM(pi.total_cost), 0) as total_ingredient_cost,
  COUNT(pi.id) as ingredient_count
FROM products p
LEFT JOIN product_ingredients pi ON p.id = pi.product_id
GROUP BY p.id, p.client_id, p.name, p.category, p.description, p.portion_yield, p.portion_unit, p.selling_price, p.created_at, p.last_modified;

-- View para despesas mensais por cliente
CREATE OR REPLACE VIEW monthly_expenses AS
SELECT 
  client_id,
  DATE_TRUNC('month', expense_date) as month,
  SUM(amount) as total_variable_expenses
FROM variable_expenses
GROUP BY client_id, DATE_TRUNC('month', expense_date);

-- View para vendas mensais por cliente
CREATE OR REPLACE VIEW monthly_sales AS
SELECT 
  client_id,
  DATE_TRUNC('month', sale_date) as month,
  SUM(total_sales) as total_revenue,
  SUM(number_of_orders) as total_orders,
  AVG(average_ticket) as avg_ticket
FROM sales
GROUP BY client_id, DATE_TRUNC('month', sale_date);

-- =============================================
-- FINALIZAÇÃO
-- =============================================
-- Este script cria toda a estrutura necessária para o FoodCost
-- com suporte a múltiplos clientes, segurança e dados de exemplo.
-- Execute no Supabase SQL Editor para criar a estrutura completa.
