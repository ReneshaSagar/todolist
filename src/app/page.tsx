import { Hero } from "@/components/landing/Hero";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Features Section - Placeholder for now */}
      <section id="features" className="py-24 bg-black px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI-Powered Context" 
              description="Automatically Reschedule, Breakdown, and Plan your day with advanced heuristics."
            />
            <FeatureCard 
              title="Spotify Sync" 
              description="Listen to your Liked Songs and focus playlists directly within the workspace."
            />
            <FeatureCard 
              title="RPGamification" 
              description="Earn XP, level up, and maintain streaks. Productivity is a game now."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-8 rounded-3xl glass hover:border-brand/40 transition-all group">
      <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-brand transition-colors">{title}</h3>
      <p className="text-subdued leading-relaxed">{description}</p>
    </div>
  );
}
