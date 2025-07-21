import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🥝</span>
            </div>
            <span className="text-2xl font-bold text-white">
              SMM<span className="text-green-500">Kiwi</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-muted-foreground hover:text-green-500 transition-colors">
              Ana Sayfa
            </a>
            <a href="#services" className="text-muted-foreground hover:text-green-500 transition-colors">
              Servisler
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-green-500 transition-colors">
              Nasıl Çalışır
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-green-500 transition-colors">
              Yorumlar
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-black">
              Giriş Yap
            </Button>
            <Button className="gradient-green-blue text-black font-semibold hover:opacity-90">
              Kayıt Ol
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
