import { drizzle } from '@drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../utils/env.ts';
import * as schema from './schema.ts';

// Create the connection
const client = postgres(config.database.url);

// Create the Drizzle instance
export const db = drizzle(client, { schema }); 