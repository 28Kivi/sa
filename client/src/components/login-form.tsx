import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Giriş Yapıldı",
      description: "Başarıyla giriş yaptınız!",
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-secondary border-border shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Hesabınıza Giriş Yapın</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Kullanıcı Adı</label>
                  <Input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Kullanıcı adınızı girin"
                    className="bg-background border-border focus:border-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Şifre</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Şifrenizi girin"
                    className="bg-background border-border focus:border-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      Beni hatırla
                    </label>
                  </div>
                  <a href="#" className="text-sm text-green-500 hover:text-blue-500">
                    Parolanızı mı unuttunuz?
                  </a>
                </div>
                
                <Button type="submit" className="w-full gradient-green-blue text-black font-semibold">
                  Giriş Yap
                </Button>
              </form>
              
              <div className="text-center mt-6">
                <span className="text-muted-foreground">Hesabınız yok mu? </span>
                <a href="#" className="text-green-500 hover:text-blue-500">Kayıt Ol</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
