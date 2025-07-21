import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import LoginForm from "@/components/login-form";
import SocialPlatforms from "@/components/social-platforms";
import HowItWorks from "@/components/how-it-works";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <LoginForm />
      <SocialPlatforms />
      <HowItWorks />
      <Testimonials />
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500/10 to-blue-500/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Tüm Dünyanın Gözü{" "}
            <span className="gradient-text">
              Sizin Üzerinizde
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Platformumuz sosyal medya pazarlama hizmetlerini hızlı ve uygun fiyatlarla sunar.
          </p>
          
          <div className="flex justify-center">
            <button className="px-12 py-4 gradient-green-blue rounded-xl text-black font-bold text-xl hover:opacity-90 transition-opacity shadow-2xl">
              Servisler
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
