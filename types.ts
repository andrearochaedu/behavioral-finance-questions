
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum Category {
  HOUSING = 'Moradia',
  TRANSPORT = 'Transporte',
  FOOD = 'Alimentação',
  LEISURE = 'Lazer',
  HEALTH = 'Saúde',
  EDUCATION = 'Educação',
  SHOPPING = 'Compras',
  FINANCIAL = 'Serviços Financeiros',
  DEPENDENTS = 'Dependentes & Pets',
  INVESTMENTS = 'Investimentos',
  OTHER = 'Outros',
  INCOME = 'Renda'
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito',
  PIX = 'PIX',
  BANK_TRANSFER = 'Boleto',
  OTHER = 'Outros',
}

export enum Recurrence {
  NONE = 'Único',
  WEEKLY = 'Semanal',
  MONTHLY = 'Mensal',
  ANNUAL = 'Anual',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string;
  category: Category;
  subcategory?: string;
  paymentMethod?: PaymentMethod;
  recurrence: Recurrence;
  recurrenceCount?: number;
}

export enum InvestmentYieldType {
    PRE_FIXED = 'Pré-fixado',
    POST_FIXED_CDI = 'Pós-fixado (% do CDI)',
    POST_FIXED_IPCA = 'Híbrido (IPCA + %)',
    VARIABLE = 'Renda Variável (Cotação)',
}

export interface Investment {
    id: string;
    name: string;
    initialAmount: number;
    type: string; 
    yieldType: InvestmentYieldType;
    yieldRate: number; 
    startDate: string; 
    redemptionDate?: string;
    ticker?: string; 
    quantity?: number; 
    unitPrice?: number; 
}

export interface Goal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string;
    icon?: string;
    color?: string;
}

export interface MonthlyBudgetConfig {
    spendingLimits: { [key in Category]?: number };
    monthlySavingsGoal: number;
}

export interface Settings {
    // Deprecated/Legacy fields (kept for type compatibility during migration)
    monthlySavingsGoal: number;
    spendingLimits: { [key in Category]?: number };
    
    // New structure for historical budgets: Key is 'YYYY-MM'
    monthlyBudgets?: { [monthKey: string]: MonthlyBudgetConfig };
    
    goals?: Goal[];
}

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    name: string;
}

export type QuestionType = 'scale' | 'boolean' | 'text' | 'multiple_choice'; 

export type QuestionCategory = 
    | 'general' 
    | 'profile' 
    | 'well_being' 
    | 'self_control' 
    | 'mental_accounting' 
    | 'literacy' 
    | 'attitude' 
    | 'knowledge';

export interface QuestionOption {
    text: string;
    score: number;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    category: QuestionCategory;
    weight?: number;
    introTitle?: string;
    introText?: string;
    options?: QuestionOption[]; // Changed from string[] to object array
}

export interface AssessmentAnswer {
    questionId: string;
    questionText: string;
    value: string | number; // Stores the score or the selected text
    category: QuestionCategory;
}

export interface Assessment {
    id: string;
    userId: string;
    date: string;
    answers: AssessmentAnswer[];
    status: 'completed' | 'partial';
    r_calculated_score?: number;
}

export type FontSize = 'small' | 'medium' | 'large';
