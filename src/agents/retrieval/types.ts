export interface ProductQuery {
  text: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSuggestion {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  confidence: number;
  reasoning: string;
}

export interface CustomerContext {
  id: string;
  preferences: Record<string, any>;
  purchaseHistory: string[];
  currentQuery?: ProductQuery;
}

export interface RetrievalResult {
  suggestions: ProductSuggestion[];
  followUpQuestions: string[];
  context: string;
} 