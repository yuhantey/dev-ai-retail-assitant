import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ProductSuggestion } from '../types/product.ts'

export class RetrievalService {
  private supabase

  constructor() {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials are required')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async getSuggestions(query: string, limit: number = 3): Promise<{
    products: ProductSuggestion[]
    context: string
  }> {
    try {
      console.log(`Searching for: "${query}" with limit: ${limit}`)
      
      // 1. Search for relevant products using vector similarity
      const { data: products, error } = await this.supabase
        .rpc('search_products', {
          query_text: query,
          match_threshold: 0.1,
          match_count: limit
        })

      if (error) {
        console.error('Search error:', error)
        throw error
      }

      if (!products || products.length === 0) {
        console.log('No products found')
        return {
          products: [],
          context: 'No products found matching your query.'
        }
      }

      // Log the raw results with their IDs
      console.log('Raw search results:')
      products.forEach((p: any) => {
        console.log(`- ID: ${p.id}, Name: ${p.name}, Similarity: ${p.similarity}`)
      })

      // Since we only have 3 unique products, we should just return them
      // No need for deduplication since we know they're unique
      const uniqueProducts = products as ProductSuggestion[]

      // 2. Build context from retrieved products
      const context = this.buildContext(uniqueProducts)

      return {
        products: uniqueProducts,
        context
      }
    } catch (error) {
      console.error('Error getting suggestions:', error)
      throw new Error('Failed to get product suggestions')
    }
  }

  private buildContext(products: any[]): string {
    return products
      .map(product => `
        Product: ${product.name}
        Description: ${product.description}
        Price: $${product.price}
        Category: ${product.category}
        Stock: ${product.stock}
        Last Updated: ${new Date(product.updated_at).toLocaleDateString()}
      `)
      .join('\n')
  }

  // Helper method to add a new product
  async addProduct(product: Omit<ProductSuggestion, 'id'>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('products')
        .insert({
          ...product,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw new Error('Failed to add product')
    }
  }

  // Create a new customer
  async createCustomer(customer: {
    id: string
    name: string
    email?: string
    phone?: string
  }): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('customers')
        .insert({
          ...customer,
          purchase_history: [],
          preferences: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      throw new Error('Failed to create customer')
    }
  }

  // Get customer purchase history
  async getCustomerHistory(customerId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('purchase_history')
        .eq('id', customerId)
        .single()

      if (error) {
        throw error
      }

      return data?.purchase_history || []
    } catch (error) {
      console.error('Error getting customer history:', error)
      throw new Error('Failed to get customer history')
    }
  }

  // Save conversation
  async saveConversation(customerId: string, messages: any[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('conversations')
        .insert({
          customer_id: customerId,
          messages,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
      throw new Error('Failed to save conversation')
    }
  }
} 