import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { load } from 'https://deno.land/std@0.208.0/dotenv/mod.ts'

// Load environment variables
await load({ export: true })

async function testRAG() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are required')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Testing RAG system...\n')

  // Test different search queries
  const testQueries = [
    'laptop with 16GB RAM',
    'noise cancelling headphones',
    'expensive electronics'
  ]

  for (const query of testQueries) {
    console.log(`Testing query: "${query}"`)
    
    const { data: products, error } = await supabase
      .rpc('search_products', {
        query_text: query,
        match_threshold: 0.1,
        match_count: 5
      })

    if (error) {
      console.error('Search error:', error)
      continue
    }

    if (!products || products.length === 0) {
      console.log('No products found')
      continue
    }

    // Check for duplicates
    const uniqueIds = new Set(products.map(p => p.id))
    if (uniqueIds.size !== products.length) {
      console.error('❌ Found duplicate products!')
      console.log('Products:', products)
    } else {
      console.log('✅ All products are unique')
    }

    // Log results
    console.log('\nFound products:')
    products.forEach(product => {
      console.log(`- ${product.name} ($${product.price})`)
      console.log(`  Similarity: ${product.similarity.toFixed(4)}`)
      console.log(`  ID: ${product.id}`)
    })
    console.log('\n' + '='.repeat(50) + '\n')
  }

  console.log('✅ RAG test completed')
}

// Run the test
testRAG().catch(console.error) 