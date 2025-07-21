import { useEffect, useState } from "react";

const stats = [
  { icon: "👥", value: 1500, label: "Mutlu Müşteri", color: "from-green-500 to-blue-500" },
  { icon: "🌐", value: 900, label: "Bayi Web Sitesi", color: "from-blue-500 to-purple-500" },
  { icon: "🛒", value: 12000, label: "Sipariş", color: "from-purple-500 to-pink-500" },
  { icon: "⚙️", value: 527, label: "Servis", color: "from-pink-500 to-green-500" },
];

export default function StatsSection() {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(stats.map(stat => stat.value));
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Piyasanın En İyi Sosyal Medya Paneli!</h2>
          <p className="text-muted-foreground text-lg">
            Tüm sosyal medya ağlarını tek panelden, kaliteli ve ucuz yönetin.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center animate-counter">
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <div className="text-4xl font-bold text-green-500 mb-2">
                +{animatedValues[index].toLocaleString()}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
