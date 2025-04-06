import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { load } from 'https://deno.land/std@0.208.0/dotenv/mod.ts'

// Load environment variables
await load({ export: true })

async function setupSQL() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials are required')
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('Setting up SQL functions...')

  // 1. Create products table
  const createTableSQL = `
    create table if not exists products (
      id uuid default gen_random_uuid() primary key,
      name text not null,
      description text,
      price decimal(10,2) not null,
      stock integer not null,
      category text not null,
      embedding vector(1536),
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );
  `

  const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
  if (tableError) {
    console.error('Error creating products table:', tableError)
    return
  }
  console.log('✅ Products table created')

  // 2. Create search function
  const searchFunctionSQL = `
    create or replace function search_products(
      query_text text,
      match_threshold float,
      match_count int
    )
    returns table (
      id uuid,
      name text,
      description text,
      price decimal,
      category text,
      stock int,
      created_at timestamp with time zone,
      updated_at timestamp with time zone,
      similarity float
    )
    language plpgsql
    as $$
    begin
      return query
      select distinct on (p.id)
        p.id,
        p.name,
        p.description,
        p.price,
        p.category,
        p.stock,
        p.created_at,
        p.updated_at,
        1 - (p.embedding <=> query_embedding) as similarity
      from products p
      where 1 - (p.embedding <=> query_embedding) > match_threshold
      order by p.id, similarity desc
      limit match_count;
    end;
    $$;
  `

  const { error: functionError } = await supabase.rpc('exec_sql', { sql: searchFunctionSQL })
  if (functionError) {
    console.error('Error creating search function:', functionError)
    return
  }
  console.log('✅ Search function created')

  // 3. Create trigger for updating timestamps
  const triggerSQL = `
    create or replace function update_updated_at_column()
    returns trigger as $$
    begin
      new.updated_at = timezone('utc'::text, now());
      return new;
    end;
    $$ language plpgsql;

    drop trigger if exists update_products_updated_at on products;
    create trigger update_products_updated_at
      before update on products
      for each row
      execute function update_updated_at_column();
  `

  const { error: triggerError } = await supabase.rpc('exec_sql', { sql: triggerSQL })
  if (triggerError) {
    console.error('Error creating trigger:', triggerError)
    return
  }
  console.log('✅ Update trigger created')

  console.log('✅ SQL setup completed successfully')
}

// Run the setup
setupSQL().catch(console.error) 