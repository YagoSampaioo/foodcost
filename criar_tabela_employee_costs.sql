-- =============================================
-- CRIAÇÃO DA TABELA EMPLOYEE_COSTS
-- Sistema Multi-Cliente para Supabase
-- =============================================

-- Criar tabela de custos de funcionários
CREATE TABLE IF NOT EXISTS employee_costs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  professional VARCHAR(255) NOT NULL,
  hourly_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  average_salary DECIMAL(10,2) NOT NULL DEFAULT 0,
  benefits DECIMAL(10,2) NOT NULL DEFAULT 0, -- Vale Transp, Refeição, Plano de Saúde, Seguro
  fgts DECIMAL(10,2) NOT NULL DEFAULT 0,
  vacation_allowance DECIMAL(10,2) NOT NULL DEFAULT 0, -- Férias 1/12
  vacation_bonus DECIMAL(10,2) NOT NULL DEFAULT 0, -- 1/3 Férias
  fgts_vacation_bonus DECIMAL(10,2) NOT NULL DEFAULT 0, -- FGTS FÉRIAS e ADICIONAL DE 1/3
  thirteenth_salary DECIMAL(10,2) NOT NULL DEFAULT 0, -- 13º Salário
  fgts_thirteenth DECIMAL(10,2) NOT NULL DEFAULT 0, -- FGTS 13º Salário
  notice_period DECIMAL(10,2) NOT NULL DEFAULT 0, -- Aviso Prévio
  fgts_notice_period DECIMAL(10,2) NOT NULL DEFAULT 0, -- FGTS Aviso Prévio
  fgts_penalty DECIMAL(10,2) NOT NULL DEFAULT 0, -- Multa FGTS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_employee_costs_client_id ON employee_costs(client_id);
CREATE INDEX IF NOT EXISTS idx_employee_costs_professional ON employee_costs(professional);
CREATE INDEX IF NOT EXISTS idx_employee_costs_created_at ON employee_costs(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE employee_costs ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Users can only access their own employee costs" ON employee_costs
FOR ALL USING (client_id = auth.uid());

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employee_costs_updated_at 
    BEFORE UPDATE ON employee_costs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo para "JM Hot Dog Prensado"
-- Substitua o UUID abaixo pelo ID real do cliente no seu banco
INSERT INTO employee_costs (
  client_id,
  professional,
  hourly_cost,
  average_salary,
  benefits,
  fgts,
  vacation_allowance,
  vacation_bonus,
  fgts_vacation_bonus,
  thirteenth_salary,
  fgts_thirteenth,
  notice_period,
  fgts_notice_period,
  fgts_penalty
) VALUES (
  'SUBSTITUA_PELO_UUID_DO_CLIENTE_JM_HOT_DOG', -- Substitua pelo UUID real
  'Hora profissional senior',
  62.00,
  5000.00,
  881.00,
  400.00,
  416.67,
  138.89,
  44.44,
  416.67,
  33.33,
  416.67,
  33.33,
  255.56
);

-- Comentários sobre os campos
COMMENT ON TABLE employee_costs IS 'Tabela para armazenar custos detalhados de funcionários por cliente';
COMMENT ON COLUMN employee_costs.professional IS 'Nome ou categoria do profissional';
COMMENT ON COLUMN employee_costs.hourly_cost IS 'Custo por hora trabalhada';
COMMENT ON COLUMN employee_costs.average_salary IS 'Salário médio mensal';
COMMENT ON COLUMN employee_costs.benefits IS 'Encargos: Vale Transp, Refeição, Plano de Saúde, Seguro';
COMMENT ON COLUMN employee_costs.fgts IS 'Contribuição FGTS mensal';
COMMENT ON COLUMN employee_costs.vacation_allowance IS 'Férias 1/12 (1/12 do salário)';
COMMENT ON COLUMN employee_costs.vacation_bonus IS '1/3 de férias (adicional de férias)';
COMMENT ON COLUMN employee_costs.fgts_vacation_bonus IS 'FGTS sobre férias e 1/3 de férias';
COMMENT ON COLUMN employee_costs.thirteenth_salary IS '13º Salário (1/12 do salário)';
COMMENT ON COLUMN employee_costs.fgts_thirteenth IS 'FGTS sobre 13º salário';
COMMENT ON COLUMN employee_costs.notice_period IS 'Aviso prévio (1/12 do salário)';
COMMENT ON COLUMN employee_costs.fgts_notice_period IS 'FGTS sobre aviso prévio';
COMMENT ON COLUMN employee_costs.fgts_penalty IS 'Multa FGTS (40% sobre saldo FGTS)';

-- Verificar se a tabela foi criada corretamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'employee_costs'
ORDER BY ordinal_position;
