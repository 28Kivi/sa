import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Admin authentication hook
function useAdminAuth() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    const token = localStorage.getItem("adminSessionToken");
    if (!token) {
      setLocation("/kiwi-management-portal");
    }
  }, [setLocation]);
  
  return localStorage.getItem("adminSessionToken");
}

// API request with admin token
async function adminApiRequest(method: string, url: string, data?: any) {
  const token = localStorage.getItem("adminSessionToken");
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Session": token || "",
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response;
}

export default function AdminPanel() {
  const token = useAdminAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // State for forms
  const [apiForm, setApiForm] = useState({
    name: "",
    apiUrl: "",
    apiKey: "",
  });
  
  const [keyForm, setKeyForm] = useState({
    serviceIds: "",
    usageLimit: "",
    count: "1",
  });

  // Queries
  const { data: apiProviders } = useQuery({
    queryKey: ["admin", "api-providers"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/api-providers");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: services } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/services");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: apiKeys } = useQuery({
    queryKey: ["admin", "api-keys"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/api-keys");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: orders } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/orders");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: activityLogs } = useQuery({
    queryKey: ["admin", "activity-logs"],
    queryFn: async () => {
      const response = await adminApiRequest("GET", "/api/admin/activity-logs");
      return response.json();
    },
    enabled: !!token,
  });

  // Mutations
  const createApiProviderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await adminApiRequest("POST", "/api/admin/api-providers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "api-providers"] });
      toast({ title: "Başarılı", description: "API sağlayıcı eklendi" });
      setApiForm({ name: "", apiUrl: "", apiKey: "" });
    },
    onError: () => {
      toast({ title: "Hata", description: "API sağlayıcı eklenemedi", variant: "destructive" });
    },
  });

  const fetchServicesMutation = useMutation({
    mutationFn: async (providerId: number) => {
      const response = await adminApiRequest("POST", `/api/admin/fetch-services/${providerId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      toast({ title: "Başarılı", description: "Servisler çekildi" });
    },
    onError: () => {
      toast({ title: "Hata", description: "Servisler çekilemedi", variant: "destructive" });
    },
  });

  const createApiKeysMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await adminApiRequest("POST", "/api/admin/api-keys", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "api-keys"] });
      toast({ title: "Başarılı", description: "API anahtarları oluşturuldu" });
      setKeyForm({ serviceIds: "", usageLimit: "", count: "1" });
    },
    onError: () => {
      toast({ title: "Hata", description: "API anahtarları oluşturulamadı", variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    try {
      await adminApiRequest("POST", "/api/admin/logout");
    } catch (error) {
      // Ignore error
    }
    localStorage.removeItem("adminSessionToken");
    setLocation("/kiwi-management-portal");
  };

  const handleCreateApiProvider = (e: React.FormEvent) => {
    e.preventDefault();
    createApiProviderMutation.mutate(apiForm);
  };

  const handleCreateApiKeys = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceIds = keyForm.serviceIds.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    createApiKeysMutation.mutate({
      serviceIds,
      usageLimit: parseInt(keyForm.usageLimit),
      count: parseInt(keyForm.count),
    });
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Kiwi Management Portal</h1>
            <p className="text-muted-foreground">SMM Panel Yönetim Sistemi</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Çıkış Yap
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="apis">API Yönetimi</TabsTrigger>
            <TabsTrigger value="services">Servisler</TabsTrigger>
            <TabsTrigger value="keys">Anahtar Oluştur</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="activity">Aktivite</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-500">API Sağlayıcılar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{apiProviders?.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-500">Toplam Servis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{services?.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-purple-500">API Anahtarları</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{apiKeys?.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-500">Toplam Sipariş</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{orders?.length || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Son Aktiviteler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs?.slice(0, 10).map((log: any) => (
                    <div key={log.id} className="flex justify-between items-center py-2 border-b border-border">
                      <div>
                        <p className="font-medium">{log.description}</p>
                        <p className="text-sm text-muted-foreground">{log.type}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString("tr-TR")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Yeni API Sağlayıcı Ekle</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateApiProvider} className="space-y-4">
                  <div>
                    <Label htmlFor="api-name">API Adı</Label>
                    <Input
                      id="api-name"
                      value={apiForm.name}
                      onChange={(e) => setApiForm({ ...apiForm, name: e.target.value })}
                      placeholder="Örnek: MedyaBayim"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="api-url">API URL</Label>
                    <Input
                      id="api-url"
                      value={apiForm.apiUrl}
                      onChange={(e) => setApiForm({ ...apiForm, apiUrl: e.target.value })}
                      placeholder="https://medyabayim.com/api/v2"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input
                      id="api-key"
                      value={apiForm.apiKey}
                      onChange={(e) => setApiForm({ ...apiForm, apiKey: e.target.value })}
                      placeholder="9532853999ef044484e4282fe6afcff3"
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={createApiProviderMutation.isPending}>
                    {createApiProviderMutation.isPending ? "Ekleniyor..." : "API Ekle"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* API Providers List */}
            <Card>
              <CardHeader>
                <CardTitle>Mevcut API Sağlayıcılar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiProviders?.map((provider: any) => (
                    <div key={provider.id} className="flex justify-between items-center p-4 border border-border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">{provider.apiUrl}</p>
                        <Badge variant={provider.isActive ? "default" : "secondary"}>
                          {provider.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => fetchServicesMutation.mutate(provider.id)}
                        disabled={fetchServicesMutation.isPending}
                      >
                        Servis Çek
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Servis Listesi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {services?.map((service: any) => (
                    <div key={service.id} className="flex justify-between items-center p-3 border border-border rounded">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {service.id} | Platform: {service.platform} | Fiyat: {service.price}
                        </p>
                      </div>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Aktif" : "Pasif"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Anahtarı Oluştur</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateApiKeys} className="space-y-4">
                  <div>
                    <Label htmlFor="service-ids">Servis ID'leri (virgülle ayırın)</Label>
                    <Textarea
                      id="service-ids"
                      value={keyForm.serviceIds}
                      onChange={(e) => setKeyForm({ ...keyForm, serviceIds: e.target.value })}
                      placeholder="10611, 10612, 10613"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="usage-limit">Kullanım Limiti</Label>
                    <Input
                      id="usage-limit"
                      type="number"
                      value={keyForm.usageLimit}
                      onChange={(e) => setKeyForm({ ...keyForm, usageLimit: e.target.value })}
                      placeholder="1000"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="key-count">Kaç Adet Anahtar</Label>
                    <Input
                      id="key-count"
                      type="number"
                      value={keyForm.count}
                      onChange={(e) => setKeyForm({ ...keyForm, count: e.target.value })}
                      placeholder="1"
                      min="1"
                      max="10"
                      required
                    />
                  </div>
                  
                  <Button type="submit" disabled={createApiKeysMutation.isPending}>
                    {createApiKeysMutation.isPending ? "Oluşturuluyor..." : "Anahtar Oluştur"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* API Keys List */}
            <Card>
              <CardHeader>
                <CardTitle>Mevcut API Anahtarları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys?.map((key: any) => (
                    <div key={key.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">{key.keyValue}</code>
                        <Badge variant={key.isActive ? "default" : "secondary"}>
                          {key.isActive ? "Aktif" : "Pasif"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Kullanım: {key.usageCount}/{key.usageLimit} | 
                        Servis Sayısı: {key.serviceIds ? key.serviceIds.length : 0}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sipariş Listesi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders?.map((order: any) => (
                    <div key={order.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{order.orderId}</p>
                          <p className="text-sm text-muted-foreground">{order.link}</p>
                        </div>
                        <Badge>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Miktar: {order.quantity} | Ücret: ${order.charge} | 
                        {new Date(order.createdAt).toLocaleString("tr-TR")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sistem Aktiviteleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs?.map((log: any) => (
                    <div key={log.id} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{log.description}</p>
                          <Badge variant="outline" className="mt-1">
                            {log.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.createdAt).toLocaleString("tr-TR")}
                        </span>
                      </div>
                      {log.metadata && (
                        <pre className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
