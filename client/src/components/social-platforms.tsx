const platforms = [
  { icon: "📷", name: "Instagram", color: "from-purple-500 to-pink-500" },
  { icon: "🐦", name: "Twitter", color: "from-blue-500 to-blue-600" },
  { icon: "📺", name: "YouTube", color: "from-red-500 to-red-600" },
  { icon: "🎵", name: "TikTok", color: "from-black to-gray-800" },
  { icon: "💼", name: "LinkedIn", color: "from-blue-600 to-blue-700" },
  { icon: "👻", name: "Snapchat", color: "from-yellow-400 to-yellow-500" },
  { icon: "✈️", name: "Telegram", color: "from-blue-400 to-blue-500" },
  { icon: "🎧", name: "Spotify", color: "from-green-500 to-green-600" },
  { icon: "🎮", name: "Discord", color: "from-indigo-500 to-purple-500" },
];

export default function SocialPlatforms() {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Desteklenen Platformlar</h2>
        
        <div className="overflow-hidden">
          <div className="flex animate-scroll space-x-8">
            {[...platforms, ...platforms].map((platform, index) => (
              <div 
                key={index}
                className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center hover:scale-110 transition-transform`}
              >
                <span className="text-3xl">{platform.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
