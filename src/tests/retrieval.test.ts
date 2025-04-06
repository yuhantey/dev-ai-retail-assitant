import { RetrievalService } from '../services/retrieval.ts'
import { ProductSuggestion } from '../types/product.ts'

describe('RetrievalService', () => {
  let retrievalService: RetrievalService

  beforeAll(() => {
    retrievalService = new RetrievalService()
  })

  test('should add a product', async () => {
    const product: Omit<ProductSuggestion, 'id'> = {
      name: 'Test Laptop',
      description: 'A test laptop for testing',
      price: 999.99,
      stock: 10,
      category: 'Electronics'
    }

    await retrievalService.addProduct(product)
  })

  test('should search for products', async () => {
    const { products, context } = await retrievalService.getSuggestions('laptop')
    
    expect(products).toBeDefined()
    expect(context).toBeDefined()
    expect(products.length).toBeGreaterThan(0)
    expect(context).toContain('Product:')
  })

  test('should handle empty search results', async () => {
    const { products, context } = await retrievalService.getSuggestions('nonexistentproduct123')
    
    expect(products).toHaveLength(0)
    expect(context).toBe('No products found matching your query.')
  })

  test('should save and retrieve conversation', async () => {
    const customerId = 'test-customer-id'
    const messages = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' }
    ]

    await retrievalService.saveConversation(customerId, messages)
  })
}) 