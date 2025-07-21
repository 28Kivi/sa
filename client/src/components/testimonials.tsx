import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    initial: "A",
    name: "Ahmet T.",
    review: "Hizmetler çok uygun fiyatlı ve destek ekibi her zaman yardımcı oluyor. Kesinlikle tavsiye ederim.",
    color: "from-green-500 to-blue-500",
  },
  {
    initial: "Y",
    name: "Yıldız A.",
    review: "Başta tereddüt ettim, ama şimdi sürekli kullanıyorum. Hızlı teslimat ve kaliteli hizmet! Tavsiye Ederim.",
    color: "from-blue-500 to-purple-500",
  },
  {
    initial: "F",
    name: "Faruk E.",
    review: "Daha önce farklı paneller denedim ama burası hem uygun fiyatlı hem de müşteri desteği harika!",
    color: "from-purple-500 to-pink-500",
  },
  {
    initial: "M",
    name: "Murat B.",
    review: "Hızlı teslimat ve kaliteli hizmet! Sadece birkaç dakika içinde sonuçları görmeye başladım.",
    color: "from-pink-500 to-green-500",
  },
  {
    initial: "A",
    name: "Aydın K.",
    review: "İşletmem için en iyi yatırım bu oldu. Her şey çok hızlı ve düzenli çalışıyor.",
    color: "from-green-500 to-blue-500",
  },
  {
    initial: "S",
    name: "Selin M.",
    review: "Profesyonel bir platform. Siparişlerim her zaman zamanında ve eksiksiz geliyor.",
    color: "from-blue-500 to-purple-500",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Müşterilerin Geri Bildirimleri</h2>
          <p className="text-muted-foreground text-lg">Binlerce mutlu müşterimizin deneyimlerini keşfedin</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-secondary border-border hover:border-green-500 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-lg font-bold text-white">{testimonial.initial}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.review}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
