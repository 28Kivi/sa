import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    number: 1,
    title: "Kayıt Oluştur",
    description: "Ücretsiz olarak üye olun. Üye olduğunuzda sisteme girmiş olacaksınız.",
    color: "from-green-500 to-blue-500",
    buttonText: "Kayıt Ol",
  },
  {
    number: 2,
    title: "Servisleri İncele",
    description: "Servisleri kullanmak için bakiye ekleyebilirsiniz. Bir çok farklı bakiye ekleme metotu mevcuttur.",
    color: "from-blue-500 to-purple-500",
  },
  {
    number: 3,
    title: "Bakiye Yükle",
    description: "İstediğiniz kategorideki istediğiniz hizmeti seçip, gerekli alanları doldurup sipariş verebilirsiniz.",
    color: "from-purple-500 to-pink-500",
  },
  {
    number: 4,
    title: "Güvenli Sipariş Oluştur",
    description: "Tüm sistem otomatik çalışmaktadır. Sipariş verdiğinizde bakiyenizden tutar düşer.",
    color: "from-pink-500 to-green-500",
  },
];

const features = [
  {
    icon: "🤝",
    title: "Hizmet Sunumu ve Satışı",
    description: "Kullanıcılar, sosyal medya hizmetlerini (takipçi, beğeni, vb.) seçip ödeme yaparak satın alır.",
    color: "bg-green-500",
  },
  {
    icon: "🎧",
    title: "7/24 Destek Ekibi",
    description: "7/24 destek ekibi, kullanıcıların hizmet alımında karşılaştığı sorunlara anında müdahale eder.",
    color: "bg-blue-500",
  },
  {
    icon: "🤖",
    title: "1.728.242 Sipariş",
    description: "Tüm siparişlerin otomatik işlenmesi, API entegrasyonlarıyla hatasız ve hızlı bir şekilde gerçekleştirilir.",
    color: "bg-purple-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">SMM Panel Nasıl Çalışır?</h2>
          <p className="text-xl text-muted-foreground">
            Sosyal medya pazarlama hizmetlerini hızlı ve uygun fiyatlarla sunan bir platformdur.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <span className="text-3xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground mb-4">{step.description}</p>
              {step.buttonText && (
                <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold">
                  {step.buttonText}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary border-border">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
