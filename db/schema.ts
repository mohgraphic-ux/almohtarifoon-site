import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const content = sqliteTable('content', { id: text('id').primaryKey(), data: text('data').notNull(), version: integer('version').notNull().default(1), updatedAt: text('updated_at').notNull() });
export const admins = sqliteTable('admins', { id: text('id').primaryKey(), userId: text('user_id').notNull().unique(), email: text('email').notNull() });
export const requests = sqliteTable('requests', { id: text('id').primaryKey(), name: text('name').notNull(), phone: text('phone').notNull(), service: text('service').notNull(), message: text('message').notNull(), status: text('status').notNull().default('جديد'), createdAt: text('created_at').notNull() });
export const media = sqliteTable('media', { id: text('id').primaryKey(), name: text('name').notNull(), url: text('url').notNull(), createdAt: text('created_at').notNull() });
export const activity = sqliteTable('activity', { id: text('id').primaryKey(), action: text('action').notNull(), email: text('email').notNull(), createdAt: text('created_at').notNull() });
