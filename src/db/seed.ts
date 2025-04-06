import { createClient } from '@supabase/supabase-js';
import { config } from '../utils/env.ts';

const sampleProducts = [
  {
    name: 'Classic Cotton T-Shirt',
    description: 'Comfortable and breathable cotton t-shirt for everyday wear',
    price: 29.99,
    stock: 100,
    category: 'clothing'
  },
  {
    name: 'Premium Denim Jeans',
    description: 'High-quality denim jeans with perfect fit',
    price: 79.99,
    stock: 50,
    category: 'clothing'
  },
  {
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    price: 199.99,
    stock: 30,
    category: 'electronics'
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 249.99,
    stock: 25,
    category: 'electronics'
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight and comfortable running shoes',
    price: 89.99,
    stock: 40,
    category: 'footwear'
  }
];

async function seedDatabase() {
  const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

  try {
    console.log('Starting database seeding...');

    // Insert products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .insert(sampleProducts)
      .select();

    if (productsError) {
      throw productsError;
    }

    console.log('✅ Successfully inserted sample products:', products.length);

    // Create a sample customer
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .insert([
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          preferences: {
            favoriteCategories: ['clothing', 'electronics'],
            sizePreferences: { shirt: 'L', shoes: '42' }
          },
          purchase_history: []
        }
      ])
      .select()
      .single();

    if (customerError) {
      throw customerError;
    }

    console.log('✅ Successfully created sample customer:', customer.id);

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
}

// Run the seeding
seedDatabase(); 