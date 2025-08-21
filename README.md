# FoodCost Pro - Sistema de Gestão de Custos Alimentícios

Um sistema completo para gestão de custos em estabelecimentos de alimentação, desenvolvido em React com TypeScript.

## 🚀 Funcionalidades

### 1. **Dashboard**
- Visão geral dos produtos e custos
- Estatísticas e métricas em tempo real
- Gráficos de produtos por categoria
- Top produtos por custo

### 2. **Gestão de Insumos**
- Cadastro completo de ingredientes
- Controle de estoque mínimo e atual
- Categorização por tipo (carnes, frutas, verduras, etc.)
- Preços unitários e fornecedores
- Alertas de estoque baixo

### 3. **Gestão de Produtos**
- Criação de fichas técnicas
- Seleção de insumos cadastrados
- Cálculo automático de custos
- Definição de rendimento (porções/kg)
- Precificação com margem de lucro
- Controle de despesas fixas e variáveis por produto

### 4. **Despesas Fixas**
- Controle de gastos recorrentes
- Frequências: mensal, trimestral, semestral, anual
- Categorização por tipo
- Cálculo automático de custos anuais
- Status ativo/inativo

### 5. **Despesas Variáveis**
- Registro de gastos pontuais
- Categorização e formas de pagamento
- Controle de recibos e comprovantes
- Relatórios por período (mês/ano)
- Análise por categoria

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **LocalStorage** - Persistência de dados

## 📦 Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd project
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:5173
```

## 📱 Como Usar

### Primeiro Passo: Cadastrar Insumos
1. Acesse a página "Insumos"
2. Clique em "Novo Insumo"
3. Preencha:
   - Código único
   - Nome do ingrediente
   - Categoria
   - Unidade de medida
   - Preço unitário
   - Fornecedor
   - Estoque mínimo e atual

### Segundo Passo: Criar Produtos
1. Acesse a página "Produtos"
2. Clique em "Novo Produto"
3. Preencha informações básicas
4. Adicione ingredientes selecionando dos insumos cadastrados
5. Defina quantidades e o sistema calculará custos automaticamente
6. Configure despesas fixas e variáveis do produto

### Terceiro Passo: Controlar Despesas
1. **Despesas Fixas**: Cadastre gastos recorrentes (aluguel, funcionários, etc.)
2. **Despesas Variáveis**: Registre gastos pontuais (manutenção, equipamentos, etc.)

### Quarto Passo: Monitorar no Dashboard
- Acompanhe estatísticas gerais
- Visualize produtos por categoria
- Monitore custos e margens

## 🎯 Benefícios

- **Controle Total**: Gestão completa de custos
- **Precisão**: Cálculos automáticos baseados em dados reais
- **Organização**: Categorização e estruturação clara
- **Relatórios**: Visão consolidada das operações
- **Facilidade**: Interface intuitiva e responsiva

## 🔧 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.tsx           # Página principal
│   ├── Layout.tsx              # Layout com navegação
│   ├── RawMaterialsForm.tsx    # Gestão de insumos
│   ├── ProductForm.tsx         # Gestão de produtos
│   ├── FixedExpensesForm.tsx   # Despesas fixas
│   └── VariableExpensesForm.tsx # Despesas variáveis
├── types/              # Definições de tipos TypeScript
├── utils/              # Utilitários e storage
└── App.tsx             # Componente principal
```

## 📊 Tipos de Dados

### Insumo (RawMaterial)
- Informações básicas (código, nome, categoria)
- Preços e estoque
- Fornecedor e datas

### Produto (Product)
- Ficha técnica completa
- Lista de ingredientes
- Precificação e margens
- Despesas associadas

### Despesas
- **Fixas**: Recorrentes com frequência definida
- **Variáveis**: Pontuais com data específica

## 🚀 Próximas Funcionalidades

- [ ] Relatórios em PDF
- [ ] Gráficos avançados
- [ ] Backup na nuvem
- [ ] Múltiplos usuários
- [ ] Integração com sistemas externos
- [ ] App mobile

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para facilitar a gestão de custos em estabelecimentos de alimentação.**
# foodcost
