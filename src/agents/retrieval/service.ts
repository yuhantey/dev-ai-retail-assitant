import { createClient } from '@supabase/supabase-js';
import { config } from '../../utils/env.ts';
import type { ProductQuery, ProductSuggestion, CustomerContext, RetrievalResult } from './types.ts';

export class RetrievalService {
  private supabase;

  constructor() {
    this.supabase = createClient(config.supabase.url, config.supabase.anonKey);
  }

  async searchProducts(query: ProductQuery): Promise<ProductSuggestion[]> {
    let queryBuilder = this.supabase
      .from('products')
      .select('*');

    // Apply filters
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    if (query.minPrice !== undefined) {
      queryBuilder = queryBuilder.gte('price', query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte('price', query.maxPrice);
    }

    // Execute query
    const { data: products, error } = await queryBuilder;
    
    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    // Convert to ProductSuggestion[]
    return products.map(product => ({
      ...product,
      confidence: 0.9, // TODO: Implement proper confidence scoring
      reasoning: `Found product matching your search: ${query.text}` // TODO: Implement proper reasoning
    }));
  }

  async getCustomerContext(customerId: string): Promise<CustomerContext | null> {
    const { data: customer, error } = await this.supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();

    if (error || !customer) {
      console.error('Error fetching customer context:', error);
      return null;
    }

    return {
      id: customer.id,
      preferences: customer.preferences,
      purchaseHistory: customer.purchase_history
    };
  }

  async generateFollowUpQuestions(
    query: ProductQuery,
    suggestions: ProductSuggestion[]
  ): Promise<string[]> {
    // TODO: Implement proper follow-up question generation
    return [
      'Would you like to see items in a different price range?',
      'Are you interested in similar products from other categories?',
      'Would you like more details about any specific product?'
    ];
  }

  async processQuery(
    query: ProductQuery,
    customerId?: string
  ): Promise<RetrievalResult> {
    // Get customer context if available
    const context = customerId ? await this.getCustomerContext(customerId) : null;

    // Search for products
    const suggestions = await this.searchProducts(query);

    // Generate follow-up questions
    const followUpQuestions = await this.generateFollowUpQuestions(query, suggestions);

    return {
      suggestions,
      followUpQuestions,
      context: context ? JSON.stringify(context) : 'No customer context available'
    };
  }
} 