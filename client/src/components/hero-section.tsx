export default function HeroSection() {
  return (
    <section id="home" className="pt-24 pb-16 min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="w-32 h-32 mx-auto lg:mx-0 mb-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-float">
              <span className="text-4xl">🌍</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Türkiye'nin En İyi{" "}
              <span className="gradient-text">
                SMM Paneli
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Türkiye'nin en ucuz ve güvenli platformu olan Prime Panel ile sosyal medyada yükselişe geçin.
            </p>
            
            <p className="text-lg text-muted-foreground mb-12">
              Senin için en uygun servisleri bulacağımızdan hiç şüphen olmasın.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 gradient-green-blue rounded-lg text-black font-semibold text-lg hover:opacity-90 transition-opacity">
                Servislerimize Göz At
              </button>
              <button className="px-8 py-4 border-2 border-green-500 rounded-lg text-green-500 font-semibold text-lg hover:bg-green-500 hover:text-black transition-all">
                Demo İzle
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Global network connectivity representing worldwide SMM services" 
                className="rounded-2xl shadow-2xl w-full h-auto animate-float" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
