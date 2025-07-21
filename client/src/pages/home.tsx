import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface KeyValidationInfo {
  keyId: number;
  isValid: boolean;
  usageCount: number;
  usageLimit: number;
  remainingUses: number;
  services: Array<{
    id: number;
    name: string;
    category: string;
    min: number;
    max: number;
    rate: number;
  }>;
}

export default function Home() {
  const [productKey, setProductKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [keyInfo, setKeyInfo] = useState<KeyValidationInfo | null>(null);
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [selectedService, setSelectedService] = useState("");
  const [quantity, setQuantity] = useState("");
  const [link, setLink] = useState("");
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productKey.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen ürün anahtarınızı girin",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First try to validate the key
      const validateResponse = await fetch(`/api/validate-key/${productKey}`);
      if (validateResponse.ok) {
        const keyData = await validateResponse.json();
        setKeyInfo(keyData);
        
        toast({
          title: "Başarılı",
          description: "Ürün anahtarı doğrulandı. Sipariş bilgilerini girin.",
        });
        return;
      }
      
      // If validation fails, try to get existing orders
      const response = await fetch(`/api/product/${productKey}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Geçersiz ürün anahtarı");
      }
      
      const data = await response.json();
      setOrderInfo(data);
      
      toast({
        title: "Başarılı",
        description: "Sipariş bilgileri getirildi",
      });
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Geçersiz ürün anahtarı",
        variant: "destructive",
      });
      setKeyInfo(null);
      setOrderInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !quantity || !link) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun",
        variant: "destructive",
      });
      return;
    }

    const service = keyInfo?.services.find(s => s.id.toString() === selectedService);
    if (!service) {
      toast({
        title: "Hata",
        description: "Geçersiz servis seçimi",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = parseInt(quantity);
    if (quantityNum < service.min || quantityNum > service.max) {
      toast({
        title: "Hata",
        description: `Miktar ${service.min} ile ${service.max} arasında olmalıdır`,
        variant: "destructive",
      });
      return;
    }

    setIsCreatingOrder(true);
    try {
      const response = await apiRequest(`/api/create-order/${productKey}`, {
        method: "POST",
        body: JSON.stringify({
          serviceId: parseInt(selectedService),
          quantity: quantityNum,
          link: link.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sipariş oluşturulamadı");
      }

      const orderData = await response.json();
      
      toast({
        title: "Başarılı",
        description: `Sipariş oluşturuldu: ${orderData.orderId}`,
      });

      // Reset form and get updated order info
      setKeyInfo(null);
      setSelectedService("");
      setQuantity("");
      setLink("");
      
      // Fetch the created order details
      const orderResponse = await fetch(`/api/product/${productKey}`);
      if (orderResponse.ok) {
        const data = await orderResponse.json();
        setOrderInfo(data);
      }

    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Sipariş oluşturulamadı",
        variant: "destructive",
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Card className="bg-card border-border shadow-2xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-foreground mb-4">
              Ürünü Teslim Al
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Lütfen ürün anahtarınızı girin
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!keyInfo && !orderInfo && (
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    value={productKey}
                    onChange={(e) => setProductKey(e.target.value)}
                    placeholder="Ürün Anahtarı"
                    className="h-12 text-center text-lg bg-input border-border focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold text-lg rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Doğrulanıyor..." : "✓ Doğrula"}
                </Button>
              </form>
            )}

            {keyInfo && (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    Anahtar Doğrulandı ✓
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Kalan kullanım: {keyInfo.remainingUses}/{keyInfo.usageLimit}
                  </p>
                </div>

                <form onSubmit={handleCreateOrder} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Servis Seçin</label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Servis seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        {keyInfo.services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name} ({service.min}-{service.max}) - ₺{service.rate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Miktar</label>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Miktar girin..."
                      className="h-12"
                      disabled={isCreatingOrder}
                    />
                    {selectedService && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Min: {keyInfo.services.find(s => s.id.toString() === selectedService)?.min} - 
                        Max: {keyInfo.services.find(s => s.id.toString() === selectedService)?.max}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Link/URL</label>
                    <Input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      className="h-12"
                      disabled={isCreatingOrder}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12"
                      onClick={() => {
                        setKeyInfo(null);
                        setSelectedService("");
                        setQuantity("");
                        setLink("");
                      }}
                    >
                      İptal
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold"
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder ? "Oluşturuluyor..." : "Sipariş Oluştur"}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {orderInfo && (
              <div className="mt-8 p-6 bg-secondary rounded-lg border border-border">
                <h3 className="text-lg font-semibold mb-4 text-center">✅ Sipariş Başarıyla Teslim Edildi</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sipariş ID:</span>
                    <span className="font-semibold">{orderInfo.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Servis:</span>
                    <span className="font-semibold">{orderInfo.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Link:</span>
                    <span className="font-semibold text-blue-500 break-all">{orderInfo.link}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Miktar:</span>
                    <span className="font-semibold">{orderInfo.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durum:</span>
                    <span className={`font-semibold ${
                      orderInfo.status === 'Completed' ? 'text-green-500' : 
                      orderInfo.status === 'In Progress' ? 'text-yellow-500' : 
                      orderInfo.status === 'Pending' ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {orderInfo.status === 'Pending' ? 'Beklemede' : 
                       orderInfo.status === 'In Progress' ? 'İşlemde' : 
                       orderInfo.status === 'Completed' ? 'Tamamlandı' : orderInfo.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ücret:</span>
                    <span className="font-semibold">{orderInfo.charge} TL</span>
                  </div>
                  {orderInfo.startCount && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Başlangıç Sayısı:</span>
                      <span className="font-semibold">{orderInfo.startCount}</span>
                    </div>
                  )}
                  {orderInfo.remains !== null && orderInfo.remains !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Kalan:</span>
                      <span className="font-semibold">{orderInfo.remains}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sipariş Tarihi:</span>
                    <span className="font-semibold">
                      {new Date(orderInfo.createdAt).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  {orderInfo.orderCount > 1 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Toplam Sipariş:</span>
                      <span className="font-semibold">{orderInfo.orderCount} adet</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-300 text-sm text-center font-medium">
                    Siparişiniz başarıyla işleme alındı. Takip için bu sayfayı favorilerinize ekleyebilirsiniz.
                  </p>
                </div>
              </div>
            )}

            <p className="text-center text-muted-foreground text-xs mt-6">
              Sipariş oluşturduktan sonra ürün anahtarınızı girerek durumunu kontrol edebilirsiniz.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
