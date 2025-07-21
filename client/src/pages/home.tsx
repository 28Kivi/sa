import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Home() {
  const [productKey, setProductKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);
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
      const response = await fetch(`/api/product/${productKey}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sipariş bulunamadı");
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
        description: error.message || "Geçersiz ürün anahtarı veya sipariş bulunamadı",
        variant: "destructive",
      });
      setOrderInfo(null);
    } finally {
      setIsLoading(false);
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
