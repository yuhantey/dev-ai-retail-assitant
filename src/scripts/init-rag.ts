import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { load } from 'https://deno.land/std@0.208.0/dotenv/mod.ts'

// Load environment variables
await load({ export: true })

async function initRAG() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are required')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Initializing RAG system...')

  // 1. Create the products table if it doesn't exist
  const { error: tableError } = await supabase.rpc('create_products_table')
  
  if (tableError) {
    console.error('Error creating products table:', tableError)
    return
  }

  console.log('✅ Products table created/verified')

  // 2. Create the vector search function
  const { error: functionError } = await supabase.rpc('create_search_function')
  
  if (functionError) {
    console.error('Error creating search function:', functionError)
    return
  }

  console.log('✅ Search function created')

  // 3. Add sample products
  const products = [
    {
      name: 'MacBook Pro 16"',
      description: 'Apple M2 Pro chip, 16GB RAM, 512GB SSD',
      price: 2499.99,
      stock: 5,
      category: 'Electronics'
    },
    {
      name: 'Dell XPS 15',
      description: 'Intel i7, 16GB RAM, 1TB SSD, 4K display',
      price: 1999.99,
      stock: 8,
      category: 'Electronics'
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Premium noise cancelling headphones',
      price: 399.99,
      stock: 15,
      category: 'Audio'
    }
  ]

  console.log('Adding sample products...')
  for (const product of products) {
    const { error: insertError } = await supabase
      .from('products')
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (insertError) {
      console.error(`Error adding product ${product.name}:`, insertError)
      return
    }
    console.log(`✅ Added: ${product.name}`)
  }

  // 4. Verify the setup
  const { data: allProducts, error: verifyError } = await supabase
    .from('products')
    .select('*')

  if (verifyError) {
    console.error('Error verifying setup:', verifyError)
    return
  }

  console.log('\nSetup verification:')
  console.log(`- Total products: ${allProducts?.length || 0}`)
  console.log('✅ RAG system initialized successfully')
}

// Run the initialization
initRAG().catch(console.error) 