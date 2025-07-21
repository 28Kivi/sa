import {
  users,
  apiProviders,
  services,
  apiKeys,
  orders,
  activityLogs,
  adminSessions,
  type User,
  type InsertUser,
  type ApiProvider,
  type InsertApiProvider,
  type Service,
  type InsertService,
  type ApiKey,
  type InsertApiKey,
  type Order,
  type InsertOrder,
  type ActivityLog,
  type InsertActivityLog,
  type AdminSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserBalance(userId: number, newBalance: string): Promise<void>;

  // Admin session operations
  createAdminSession(sessionToken: string, expiresAt: Date): Promise<AdminSession>;
  getAdminSession(sessionToken: string): Promise<AdminSession | undefined>;
  deleteAdminSession(sessionToken: string): Promise<void>;

  // API Provider operations
  createApiProvider(provider: InsertApiProvider): Promise<ApiProvider>;
  getApiProviders(): Promise<ApiProvider[]>;
  getApiProvider(id: number): Promise<ApiProvider | undefined>;
  updateApiProvider(id: number, updates: Partial<InsertApiProvider>): Promise<void>;
  deleteApiProvider(id: number): Promise<void>;

  // Service operations
  createService(service: InsertService): Promise<Service>;
  getServices(): Promise<Service[]>;
  getServicesByProvider(apiProviderId: number): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServiceByExternalId(externalServiceId: string, apiProviderId: number): Promise<Service | undefined>;
  updateService(id: number, updates: Partial<InsertService>): Promise<void>;
  deleteService(id: number): Promise<void>;
  bulkCreateServices(services: InsertService[]): Promise<Service[]>;

  // API Key operations
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  getApiKeys(): Promise<ApiKey[]>;
  getApiKey(keyValue: string): Promise<ApiKey | undefined>;
  updateApiKeyUsage(keyValue: string): Promise<void>;
  updateApiKey(id: number, updates: Partial<InsertApiKey>): Promise<void>;
  deleteApiKey(id: number): Promise<void>;

  // Order operations
  createOrder(order: InsertOrder): Promise<Order>;
  getOrders(): Promise<Order[]>;
  getOrdersByUser(userId: number): Promise<Order[]>;
  getOrdersByApiKey(apiKeyId: number): Promise<Order[]>;
  getOrder(orderId: string): Promise<Order | undefined>;
  updateOrder(orderId: string, updates: Partial<InsertOrder>): Promise<void>;
  updateOrderStatus(orderId: string, status: string, extra?: { externalOrderId?: string }): Promise<void>;
  getApiKeyByValue(keyValue: string): Promise<ApiKey | undefined>;

  // Activity log operations
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserBalance(userId: number, newBalance: string): Promise<void> {
    await db.update(users).set({ balance: newBalance }).where(eq(users.id, userId));
  }

  // Admin session operations
  async createAdminSession(sessionToken: string, expiresAt: Date): Promise<AdminSession> {
    const [session] = await db
      .insert(adminSessions)
      .values({ sessionToken, expiresAt })
      .returning();
    return session;
  }

  async getAdminSession(sessionToken: string): Promise<AdminSession | undefined> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.sessionToken, sessionToken));
    return session || undefined;
  }

  async deleteAdminSession(sessionToken: string): Promise<void> {
    await db.delete(adminSessions).where(eq(adminSessions.sessionToken, sessionToken));
  }

  // API Provider operations
  async createApiProvider(provider: InsertApiProvider): Promise<ApiProvider> {
    const [created] = await db.insert(apiProviders).values(provider).returning();
    return created;
  }

  async getApiProviders(): Promise<ApiProvider[]> {
    return await db.select().from(apiProviders).orderBy(desc(apiProviders.createdAt));
  }

  async getApiProvider(id: number): Promise<ApiProvider | undefined> {
    const [provider] = await db.select().from(apiProviders).where(eq(apiProviders.id, id));
    return provider || undefined;
  }

  async updateApiProvider(id: number, updates: Partial<InsertApiProvider>): Promise<void> {
    await db.update(apiProviders).set(updates).where(eq(apiProviders.id, id));
  }

  async deleteApiProvider(id: number): Promise<void> {
    await db.delete(apiProviders).where(eq(apiProviders.id, id));
  }

  // Service operations
  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(desc(services.createdAt));
  }

  async getServicesByProvider(apiProviderId: number): Promise<Service[]> {
    return await db
      .select()
      .from(services)
      .where(eq(services.apiProviderId, apiProviderId));
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service || undefined;
  }

  async getServiceByExternalId(externalServiceId: string, apiProviderId: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(
        and(
          eq(services.externalServiceId, externalServiceId),
          eq(services.apiProviderId, apiProviderId)
        )
      );
    return service || undefined;
  }

  async updateService(id: number, updates: Partial<InsertService>): Promise<void> {
    await db.update(services).set(updates).where(eq(services.id, id));
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async bulkCreateServices(serviceList: InsertService[]): Promise<Service[]> {
    return await db.insert(services).values(serviceList).returning();
  }

  // API Key operations
  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const [created] = await db.insert(apiKeys).values(apiKey).returning();
    return created;
  }

  async getApiKeys(): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
  }

  async getApiKeyByValue(keyValue: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.keyValue, keyValue));
    return apiKey;
  }

  async getOrdersByApiKey(apiKeyId: number): Promise<Order[]> {
    return await db.select().from(orders)
      .where(eq(orders.apiKeyId, apiKeyId))
      .orderBy(desc(orders.createdAt));
  }

  async getApiKey(keyValue: string): Promise<ApiKey | undefined> {
    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.keyValue, keyValue));
    return key || undefined;
  }

  async updateApiKeyUsage(keyValue: string): Promise<void> {
    const key = await this.getApiKey(keyValue);
    if (key) {
      await db
        .update(apiKeys)
        .set({ usageCount: (key.usageCount || 0) + 1 })
        .where(eq(apiKeys.keyValue, keyValue));
    }
  }

  async updateApiKey(id: number, updates: Partial<InsertApiKey>): Promise<void> {
    await db.update(apiKeys).set(updates).where(eq(apiKeys.id, id));
  }

  async deleteApiKey(id: number): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  // Order operations
  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderId, orderId));
    return order || undefined;
  }

  async updateOrder(orderId: string, updates: Partial<InsertOrder>): Promise<void> {
    await db.update(orders).set(updates).where(eq(orders.orderId, orderId));
  }

  async updateOrderStatus(orderId: string, status: string, extra?: { externalOrderId?: string }): Promise<void> {
    const updateData: any = { status };
    if (extra?.externalOrderId) {
      updateData.externalOrderId = extra.externalOrderId;
    }
    await db.update(orders).set(updateData).where(eq(orders.orderId, orderId));
  }

  // Activity log operations
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [created] = await db.insert(activityLogs).values(log).returning();
    return created;
  }

  async getActivityLogs(limit: number = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
