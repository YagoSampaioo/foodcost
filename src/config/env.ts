// Configuração centralizada - VALORES DIRETOS PARA TESTE
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  app: {
    name: "FoodCost - JM Hot Dog Prensado",
    version: "1.0.0",
    environment: import.meta.env.MODE,
    apiUrl: import.meta.env.VITE_API_URL,
  },
};

console.log("✅ Configuração carregada com valores diretos");
console.log("🌐 Supabase URL:", config.supabase.url);
console.log("🔑 Supabase Key:", config.supabase.anonKey ? "Configurada" : "Não configurada");
console.log("🏗️ Ambiente:", config.app.environment);
