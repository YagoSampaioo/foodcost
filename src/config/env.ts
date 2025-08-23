// Configuração centralizada - VALORES DIRETOS PARA TESTE
export const config = {
  supabase: {
    url: 'https://toyegzbckmtrvnfxbign.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVnemJja210cnZuZnhiaWduIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDMyMTQ0OCwiZXhwIjoyMDY5ODk3NDQ4fQ.jYEdnGhVL_B0w2EUIjLTUe7IqZHyAlkUDfalFESD4lQ',
  },
  app: {
    name: 'FoodCost - JM Hot Dog Prensado',
    version: '1.0.0',
    environment: import.meta.env.MODE,
  }
};

console.log('✅ Configuração carregada com valores diretos');
console.log('🌐 Supabase URL:', config.supabase.url);
console.log('🔑 Supabase Key:', config.supabase.anonKey ? 'Configurada' : 'Não configurada');
console.log('🏗️ Ambiente:', config.app.environment);
