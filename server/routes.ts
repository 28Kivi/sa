import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { z } from "zod";
import { insertUserSchema, insertApiProviderSchema, insertApiKeySchema, insertOrderSchema } from "@shared/schema";

const ADMIN_PASSWORD = "ucFMkvJ5Tngq7QCN9Dl31edSWaPAmIRxfGwL62ih4U8jb0VosKHtO";

// Helper function to generate random order ID
function generateOrderId(): string {
  return "#" + Math.floor(Math.random() * 10000000).toString();
}

// Helper function to generate API key
function generateApiKey(): string {
  const randomPart = crypto.randomBytes(8).toString('hex').toUpperCase();
  return `KIWIPAZARI-${randomPart}`;
}

// Helper function to verify admin session
async function verifyAdminSession(req: any): Promise<boolean> {
  const sessionToken = req.headers['x-admin-session'];
  if (!sessionToken) return false;
  
  const session = await storage.getAdminSession(sessionToken);
  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await storage.deleteAdminSession(sessionToken);
    }
    return false;
  }
  return true;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Geçersiz şifre" });
      }
      
      // Create session token
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.createAdminSession(sessionToken, expiresAt);
      
      res.json({ sessionToken });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    try {
      const sessionToken = req.headers['x-admin-session'] as string;
      if (sessionToken) {
        await storage.deleteAdminSession(sessionToken);
      }
      res.json({ message: "Çıkış yapıldı" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Admin-only routes
  app.use("/api/admin/*", async (req, res, next) => {
    if (req.path === "/api/admin/login") {
      return next();
    }
    
    const isValid = await verifyAdminSession(req);
    if (!isValid) {
      return res.status(401).json({ message: "Yetkisiz erişim" });
    }
    next();
  });

  // API Provider management
  app.post("/api/admin/api-providers", async (req, res) => {
    try {
      const validatedData = insertApiProviderSchema.parse(req.body);
      const provider = await storage.createApiProvider(validatedData);
      
      await storage.createActivityLog({
        type: "api_provider_created",
        description: `API sağlayıcı oluşturuldu: ${provider.name}`,
        metadata: { providerId: provider.id }
      });
      
      res.json(provider);
    } catch (error) {
      console.error("Create API provider error:", error);
      res.status(400).json({ message: "Geçersiz veri" });
    }
  });

  app.get("/api/admin/api-providers", async (req, res) => {
    try {
      const providers = await storage.getApiProviders();
      res.json(providers);
    } catch (error) {
      console.error("Get API providers error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Fetch services from API
  app.post("/api/admin/fetch-services/:providerId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      const provider = await storage.getApiProvider(providerId);
      
      if (!provider) {
        return res.status(404).json({ message: "API sağlayıcı bulunamadı" });
      }
      
      // Fetch services from external API
      const response = await fetch(provider.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: provider.apiKey,
          action: 'services'
        })
      });
      
      if (!response.ok) {
        throw new Error('API yanıtı başarısız');
      }
      
      const services = await response.json();
      console.log('API Response received:', { 
        isArray: Array.isArray(services), 
        length: Array.isArray(services) ? services.length : 'N/A',
        sample: Array.isArray(services) && services.length > 0 ? services[0] : services
      });
      
      // Validate services array
      if (!Array.isArray(services)) {
        console.error('Invalid API response format:', services);
        throw new Error('API yanıtı geçersiz format');
      }
      
      // Save services to database
      const servicesToCreate = services
        .map((service: any) => {
          // Validate required fields
          if (!service.service || !service.name) {
            console.warn('Eksik servis verisi:', service);
            return null;
          }
          
          // Clean and validate price
          let price = "0.001";
          if (service.rate) {
            const parsedPrice = parseFloat(service.rate);
            if (!isNaN(parsedPrice) && parsedPrice >= 0) {
              price = parsedPrice.toString();
            }
          }
          
          return {
            apiProviderId: providerId,
            externalServiceId: service.service.toString(),
            name: service.name.substring(0, 500), // Limit name length
            category: (service.category || 'Diğer').substring(0, 100),
            platform: service.name.toLowerCase().includes('instagram') ? 'Instagram' :
                      service.name.toLowerCase().includes('tiktok') ? 'TikTok' :
                      service.name.toLowerCase().includes('youtube') ? 'YouTube' :
                      service.name.toLowerCase().includes('twitter') ? 'Twitter' :
                      service.name.toLowerCase().includes('facebook') ? 'Facebook' : 'Diğer',
            description: service.name.substring(0, 1000),
            price: price,
            minOrder: Math.max(parseInt(service.min) || 1, 1),
            maxOrder: Math.min(parseInt(service.max) || 10000, 1000000),
            isActive: true
          };
        })
        .filter((service): service is NonNullable<typeof service> => service !== null); // Remove null entries with proper typing
      
      console.log(`Attempting to create ${servicesToCreate.length} services`);
      
      if (servicesToCreate.length === 0) {
        return res.json({ message: "Geçerli servis bulunamadı", services: [] });
      }
      
      const createdServices = await storage.bulkCreateServices(servicesToCreate);
      
      await storage.createActivityLog({
        type: "services_fetched",
        description: `${createdServices.length} servis çekildi: ${provider.name}`,
        metadata: { providerId, serviceCount: createdServices.length }
      });
      
      res.json({ 
        message: `${createdServices.length} servis başarıyla çekildi`,
        services: createdServices 
      });
    } catch (error) {
      console.error("Fetch services error:", error);
      res.status(500).json({ message: "Servisler çekilirken hata oluştu" });
    }
  });

  // Service management
  app.get("/api/admin/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Get services error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // API Key management
  app.post("/api/admin/api-keys", async (req, res) => {
    try {
      const { serviceIds, usageLimit, count = 1 } = req.body;
      
      const keys = [];
      for (let i = 0; i < count; i++) {
        const keyValue = generateApiKey();
        const apiKey = await storage.createApiKey({
          keyValue,
          serviceIds,
          usageLimit: parseInt(usageLimit),
          usageCount: 0,
          isActive: true
        });
        keys.push(apiKey);
      }
      
      await storage.createActivityLog({
        type: "api_keys_generated",
        description: `${count} API anahtarı oluşturuldu`,
        metadata: { count, usageLimit }
      });
      
      res.json(keys);
    } catch (error) {
      console.error("Create API key error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  app.get("/api/admin/api-keys", async (req, res) => {
    try {
      const keys = await storage.getApiKeys();
      res.json(keys);
    } catch (error) {
      console.error("Get API keys error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Order management
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Activity logs
  app.get("/api/admin/activity-logs", async (req, res) => {
    try {
      const logs = await storage.getActivityLogs(100);
      res.json(logs);
    } catch (error) {
      console.error("Get activity logs error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Public API for order creation (with API key)
  app.post("/api/order", async (req, res) => {
    try {
      const { key, service, link, quantity } = req.body;
      
      if (!key || !service || !link || !quantity) {
        return res.status(400).json({ message: "Eksik parametreler" });
      }
      
      // Verify API key
      const apiKey = await storage.getApiKey(key);
      if (!apiKey || !apiKey.isActive) {
        return res.status(401).json({ message: "Geçersiz API anahtarı" });
      }
      
      // Check usage limit
      if ((apiKey.usageCount || 0) >= apiKey.usageLimit) {
        return res.status(403).json({ message: `Bu anahtar maksimum ${apiKey.usageLimit} limitli` });
      }
      
      // Check if quantity exceeds limit
      if (quantity > apiKey.usageLimit) {
        return res.status(400).json({ message: `Bu anahtar maksimum ${apiKey.usageLimit} limitli` });
      }
      
      // Get service details
      const serviceData = await storage.getService(parseInt(service));
      if (!serviceData) {
        return res.status(404).json({ message: "Servis bulunamadı" });
      }
      
      // Check if service is accessible with this key
      const serviceIds = apiKey.serviceIds as number[];
      if (!serviceIds || !serviceIds.includes(serviceData.id)) {
        return res.status(403).json({ message: "Bu servis için yetkiniz yok" });
      }
      
      // Calculate charge
      const charge = (parseFloat(serviceData.price || "0") * quantity).toFixed(2);
      
      // Create order
      const orderId = generateOrderId();
      const order = await storage.createOrder({
        orderId,
        apiKeyId: apiKey.id,
        serviceId: serviceData.id,
        link,
        quantity: parseInt(quantity),
        charge,
        status: "Pending"
      });
      
      // Update API key usage
      await storage.updateApiKeyUsage(key);
      
      // Log activity
      await storage.createActivityLog({
        type: "order_created",
        description: `Sipariş oluşturuldu: ${orderId}`,
        metadata: { orderId, serviceId: serviceData.id, quantity }
      });
      
      res.json({ orderId });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Public API for order status by order ID
  app.get("/api/order/:orderId", async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Sipariş bulunamadı" });
      }
      
      res.json({
        orderId: order.orderId,
        status: order.status,
        charge: order.charge,
        startCount: order.startCount,
        remains: order.remains,
        createdAt: order.createdAt
      });
    } catch (error) {
      console.error("Get order error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Public API for order status by product key (API key)
  app.get("/api/product/:productKey", async (req, res) => {
    try {
      const { productKey } = req.params;
      
      // Find the API key
      const apiKey = await storage.getApiKeyByValue(productKey);
      if (!apiKey) {
        return res.status(404).json({ message: "Geçersiz ürün anahtarı veya sipariş bulunamadı" });
      }
      
      // Get orders for this API key
      const orders = await storage.getOrdersByApiKey(apiKey.id);
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "Bu ürün anahtarı için sipariş bulunamadı" });
      }
      
      // Return the most recent order with service details
      const latestOrder = orders[0];
      const service = latestOrder.serviceId ? await storage.getService(latestOrder.serviceId) : null;
      
      res.json({
        orderId: latestOrder.orderId,
        status: latestOrder.status,
        serviceName: service?.name || "Bilinmeyen Servis",
        link: latestOrder.link,
        quantity: latestOrder.quantity,
        charge: latestOrder.charge,
        startCount: latestOrder.startCount,
        remains: latestOrder.remains,
        createdAt: latestOrder.createdAt,
        orderCount: orders.length
      });
    } catch (error) {
      console.error("Get product order error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Bu e-posta adresi zaten kullanılıyor" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Register error:", error);
      res.status(400).json({ message: "Kayıt başarısız" });
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
      }
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
