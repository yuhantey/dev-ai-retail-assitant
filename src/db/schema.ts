import { sql } from '@drizzle-orm/postgres-js';
import { pgTable, text, timestamp, uuid, jsonb, numeric } from '@drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: numeric('stock', { precision: 10, scale: 0 }).notNull(),
  category: text('category').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  purchaseHistory: jsonb('purchase_history').$type<string[]>().default([]),
  preferences: jsonb('preferences').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sales = pgTable('sales', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id),
  products: jsonb('products').$type<Array<{
    productId: string;
    quantity: number;
    price: number;
  }>>().notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text('payment_method').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  customerId: uuid('customer_id').references(() => customers.id),
  messages: jsonb('messages').$type<Array<{
    role: 'assistant' | 'customer';
    content: string;
    timestamp: Date;
  }>>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 