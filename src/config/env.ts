// Configuração centralizada - VALORES DIRETOS PARA TESTE
export const config = {
  supabase: {
    url: 'https://toyegzbckmtrvnfxbign.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRveWVnemJja210cnZuZnhiaWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzAsImV4cCI6MjA1MDU0ODk3MH0.YOUR_REAL_ANON_KEY_HERE',
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
