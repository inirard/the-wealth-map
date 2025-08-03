export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  importance: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

export interface WealthWheelData {
  id: string;
  label: string;
  value: number;
  description: string;
}

export interface Reflection {
  id: string;
  prompt: string;
  content: string;
}

export interface Investment {
  id: string;
  name: string;
  type: string;
  amount: number;
  quantity?: number;
}

export type Language = 'pt' | 'en' | 'es' | 'fr';

// This type is compatible with the AI ChatMessage schema
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
