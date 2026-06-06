
import { Category, PaymentMethod, Recurrence, InvestmentYieldType } from './types';

export const CATEGORIES: Category[] = [
  Category.HOUSING,
  Category.TRANSPORT,
  Category.FOOD,
  Category.LEISURE,
  Category.HEALTH,
  Category.EDUCATION,
  Category.SHOPPING,
  Category.FINANCIAL,
  Category.DEPENDENTS,
  Category.INVESTMENTS,
  Category.OTHER,
];

export const EXPENSE_CATEGORIES: Category[] = CATEGORIES; 
export const INCOME_CATEGORIES: Category[] = [Category.INCOME];

export const SUBCATEGORIES: Record<Category, string[]> = {
    [Category.HOUSING]: ['Aluguel/Condomínio', 'Energia', 'Água', 'Internet/TV', 'Celular/Telefonia', 'Manutenção', 'Gás', 'IPTU', 'Serviços Domésticos'],
    [Category.TRANSPORT]: ['Combustível', 'Uber/Táxi', 'Transporte Público', 'Manutenção', 'IPVA/Licenciamento', 'Seguro Auto', 'Estacionamento', 'Pedágio'],
    [Category.FOOD]: ['Supermercado', 'Restaurante', 'Delivery', 'Padaria/Café'],
    [Category.LEISURE]: ['Viagens', 'Cinema/Streaming', 'Bares/Festas', 'Hobbies', 'Jogos'],
    [Category.HEALTH]: ['Farmácia', 'Consultas/Exames', 'Plano de Saúde', 'Academia/Esportes', 'Terapia'],
    [Category.EDUCATION]: ['Cursos', 'Mensalidade Escolar', 'Livros/Material', 'Idiomas'],
    [Category.SHOPPING]: ['Vestuário', 'Eletrônicos', 'Casa/Decoração', 'Beleza/Estética', 'Presentes', 'Cosméticos'],
    [Category.FINANCIAL]: ['Taxas Bancárias', 'Juros', 'Impostos', 'Seguros (Vida/Residencial)', 'Empréstimo/Financiamento'],
    [Category.DEPENDENTS]: ['Escola Filhos', 'Roupas Filhos', 'Veterinário/Pet Shop', 'Mesada'],
    [Category.INVESTMENTS]: ['Aporte Mensal', 'Reinvestimento'],
    [Category.OTHER]: ['Doações', 'Imprevistos', 'Outros'],
    [Category.INCOME]: ['Salário', 'Freelance/Extra', '13º Salário/Férias', 'Dividendos', 'Venda de Bens', 'Reembolso', 'Restituição IR']
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  PaymentMethod.CASH,
  PaymentMethod.CREDIT_CARD,
  PaymentMethod.DEBIT_CARD,
  PaymentMethod.PIX,
  PaymentMethod.BANK_TRANSFER,
  PaymentMethod.OTHER,
];

export const RECURRENCE_TYPES: Recurrence[] = [
  Recurrence.NONE,
  Recurrence.WEEKLY,
  Recurrence.MONTHLY,
  Recurrence.ANNUAL,
];

export const INVESTMENT_YIELD_TYPES: InvestmentYieldType[] = [
    InvestmentYieldType.PRE_FIXED,
    InvestmentYieldType.POST_FIXED_CDI,
    InvestmentYieldType.POST_FIXED_IPCA,
    InvestmentYieldType.VARIABLE,
]

export const INVESTMENT_TYPES: string[] = [
    "CDB",
    "Tesouro Direto",
    "Ações",
    "Fundos Imobiliários",
    "Poupança",
    "LCI/LCA",
    "Criptomoedas",
    "Outros"
];

// Tipos que exigem Ticker e Quantidade
export const VARIABLE_INCOME_TYPES = [
    "Ações",
    "Fundos Imobiliários",
    "Criptomoedas"
];
