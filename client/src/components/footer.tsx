export default function Footer() {
  return (
    <footer className="bg-secondary py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🥝</span>
              </div>
              <span className="text-2xl font-bold text-white">
                SMM<span className="text-green-500">Kiwi</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              Türkiye'nin en güvenilir SMM paneli. Sosyal medya büyümende güvenilir ortağın.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-muted-foreground hover:text-green-500 transition-colors">Ana Sayfa</a></li>
              <li><a href="#services" className="text-muted-foreground hover:text-green-500 transition-colors">Servisler</a></li>
              <li><a href="#how-it-works" className="text-muted-foreground hover:text-green-500 transition-colors">Nasıl Çalışır</a></li>
              <li><a href="#testimonials" className="text-muted-foreground hover:text-green-500 transition-colors">Müşteri Yorumları</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-green-500 transition-colors">SSS</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-500 transition-colors">İletişim</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-500 transition-colors">API Dökümantasyonu</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-green-500 transition-colors">Kullanım Şartları</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-green-500">📧</span>
                <span className="text-muted-foreground">support@smmkiwi.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">🕐</span>
                <span className="text-muted-foreground">7/24 Destek</span>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors">
                <span>🐦</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                <span>✈️</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors">
                <span>📷</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">&copy; 2024 SMM Kiwi. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
