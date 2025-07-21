import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for regular users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  balance: decimal("balance", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin sessions for admin panel access
export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
});

// API providers table
export const apiProviders = pgTable("api_providers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  apiUrl: text("api_url").notNull(),
  apiKey: text("api_key").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Services from APIs
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  apiProviderId: integer("api_provider_id").references(() => apiProviders.id),
  externalServiceId: varchar("external_service_id", { length: 255 }).notNull(),
  name: text("name").notNull(),
  category: varchar("category", { length: 100 }),
  platform: varchar("platform", { length: 50 }), // Instagram, TikTok, YouTube, etc.
  description: text("description"),
  price: text("price"),
  minOrder: integer("min_order").default(1),
  maxOrder: integer("max_order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Generated keys for API access
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  keyValue: varchar("key_value", { length: 255 }).notNull().unique(),
  serviceIds: jsonb("service_ids"), // Array of service IDs this key can access
  totalLimit: integer("total_limit").notNull(), // Toplam miktar limiti
  remainingLimit: integer("remaining_limit").notNull(), // Kalan miktar
  usageCount: integer("usage_count").default(0), // Sipariş sayısı
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders placed by users or via API keys
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderId: varchar("order_id", { length: 50 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  apiKeyId: integer("api_key_id").references(() => apiKeys.id),
  serviceId: integer("service_id").references(() => services.id),
  link: text("link").notNull(),
  quantity: integer("quantity").notNull(),
  charge: decimal("charge", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("Pending"), // Pending, In Progress, Completed, Cancelled
  startCount: integer("start_count"),
  remains: integer("remains"),
  externalOrderId: varchar("external_order_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity logs for admin panel
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(), // order_created, key_generated, etc.
  description: text("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const apiProvidersRelations = relations(apiProviders, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  apiProvider: one(apiProviders, {
    fields: [services.apiProviderId],
    references: [apiProviders.id],
  }),
  orders: many(orders),
}));

export const apiKeysRelations = relations(apiKeys, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  apiKey: one(apiKeys, {
    fields: [orders.apiKeyId],
    references: [apiKeys.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiProviderSchema = createInsertSchema(apiProviders).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ApiProvider = typeof apiProviders.$inferSelect;
export type InsertApiProvider = z.infer<typeof insertApiProviderSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
