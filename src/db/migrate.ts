import { createClient } from '@supabase/supabase-js';
import { config } from '../utils/env.ts';

async function migrate() {
  const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);

  try {
    // Create products table
    const { error: productsError } = await supabase.rpc('create_products_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price NUMERIC(10,2) NOT NULL,
          stock NUMERIC(10,0) NOT NULL,
          category TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    });
    if (productsError) throw productsError;

    // Create customers table
    const { error: customersError } = await supabase.rpc('create_customers_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          email TEXT,
          phone TEXT,
          purchase_history JSONB DEFAULT '[]',
          preferences JSONB DEFAULT '{}',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    });
    if (customersError) throw customersError;

    // Create sales table
    const { error: salesError } = await supabase.rpc('create_sales_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS sales (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          customer_id UUID REFERENCES customers(id),
          products JSONB NOT NULL,
          total NUMERIC(10,2) NOT NULL,
          payment_method TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    });
    if (salesError) throw salesError;

    // Create conversations table
    const { error: conversationsError } = await supabase.rpc('create_conversations_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS conversations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          customer_id UUID REFERENCES customers(id),
          messages JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `
    });
    if (conversationsError) throw conversationsError;

    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
}

// Run the migration
migrate(); 