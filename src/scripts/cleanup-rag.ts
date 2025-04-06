import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { load } from 'https://deno.land/std@0.208.0/dotenv/mod.ts'

// Load environment variables
await load({ export: true })

async function cleanupRAG() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are required')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Starting RAG cleanup...')

  // 1. Delete all products
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all but keep one dummy record

  if (deleteError) {
    console.error('Error deleting products:', deleteError)
    return
  }

  console.log('✅ Products deleted')

  // 2. Reset the vector search function
  const { error: functionError } = await supabase.rpc('reset_search_function')
  
  if (functionError) {
    console.error('Error resetting search function:', functionError)
    return
  }

  console.log('✅ Search function reset')

  // 3. Verify the cleanup
  const { data: remainingProducts, error: verifyError } = await supabase
    .from('products')
    .select('*')

  if (verifyError) {
    console.error('Error verifying cleanup:', verifyError)
    return
  }

  console.log('Cleanup verification:')
  console.log(`- Remaining products: ${remainingProducts?.length || 0}`)
  console.log('✅ Cleanup completed successfully')
}

// Run the cleanup
cleanupRAG().catch(console.error) 