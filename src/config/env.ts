// Configuração centralizada das variáveis de ambiente
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    name: 'FoodCost - JM Hot Dog Prensado',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  }
};

// Validação das variáveis obrigatórias
export function validateEnvironment() {
  const errors: string[] = [];

  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL não está configurada');
  }

  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY não está configurada');
  }

  if (errors.length > 0) {
    console.error('❌ Erros de configuração:', errors);
    throw new Error(`Variáveis de ambiente não configuradas: ${errors.join(', ')}`);
  }

  console.log('✅ Configuração de ambiente válida');
  console.log('🌐 Supabase URL:', config.supabase.url);
  console.log('🔑 Supabase Key:', config.supabase.anonKey ? 'Configurada' : 'Não configurada');
  console.log('🏗️ Ambiente:', config.app.environment);
}

// Executar validação ao importar
validateEnvironment();
