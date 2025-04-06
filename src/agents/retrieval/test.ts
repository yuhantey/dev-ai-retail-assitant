import { RetrievalService } from './service.ts';
import { ProductQuery } from './types.ts';

async function testRetrievalSystem() {
  console.log('Testing Retrieval System...\n');
  
  const retrievalService = new RetrievalService();
  
  // Test 1: Basic product search
  console.log('Test 1: Basic Product Search');
  const basicQuery: ProductQuery = {
    text: 'comfortable shirt',
    category: 'clothing',
    maxPrice: 50
  };


  
  try {
    const basicResults = await retrievalService.searchProducts(basicQuery);
    console.log('Search Results:', JSON.stringify(basicResults, null, 2));
  } catch (error) {
    console.error('Error in basic search:', error);
  }

  const basicQuery2: ProductQuery = {
    text: 'denim jeans',
    category: 'clothing',
    maxPrice: 100
  };
  
  // Test 2: Customer context retrieval
  console.log('\nTest 2: Customer Context Retrieval');
  try {
    const customerContext = await retrievalService.getCustomerContext('sample-customer-1');
    console.log('Customer Context:', JSON.stringify(customerContext, null, 2));
  } catch (error) {
    console.error('Error in customer context retrieval:', error);
  }
  
  // Test 3: Full query processing
  console.log('\nTest 3: Full Query Processing');
  const fullQuery: ProductQuery = {
    text: 'I need a new pair of shoes for running',
    category: 'footwear',
    maxPrice: 100
  };
  
  try {
    const fullResults = await retrievalService.processQuery(fullQuery, 'sample-customer-1');
    console.log('Full Processing Results:', JSON.stringify(fullResults, null, 2));
  } catch (error) {
    console.error('Error in full query processing:', error);
  }
}

// Run the tests
testRetrievalSystem().catch(console.error); 