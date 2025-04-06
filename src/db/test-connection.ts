import { db } from './client.ts';
import { products } from './schema.ts';

async function testConnection() {
  try {
    // Test the connection by querying the products table
    const result = await db.select().from(products).limit(1);
    console.log('✅ Database connection successful!');
    console.log('Sample query result:', result);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    // Close the connection
    Deno.exit(0);
  }
}

// Run the test
testConnection(); 