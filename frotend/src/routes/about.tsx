import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Sprout, CloudSun, Bot, Users, Globe, Database, ArrowRight, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About · Smart Farming Season Advisor" },
      {
        name: "description",
        content:
          "Discover how Smart Farming Season Advisor helps Rwandan farmers with AI insights, weather data, and season detection.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/20 py-20 md:py-28">
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-6 shadow-sm">
              <Sprout className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Empowering Rwandan Farmers with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">Data-Driven</span> Agriculture.
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              Smart Farming is a next-generation digital extension service. We combine local agricultural knowledge, real-time satellite weather, and artificial intelligence into a single, simple platform for every district in Rwanda.
            </p>
          </div>
          
          {/* Decorative background blurs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
        </section>

        {/* 2. Core Capabilities */}
        <section className="py-20 bg-card border-y border-border/50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">Platform Capabilities</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Everything you need to maximize your crop yield and adapt to changing climate conditions, built right into your browser.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <FeatureCard 
                icon={<Globe className="h-6 w-6 text-blue-500" />}
                title="Smart Season Detection"
                desc="Automatically aligns with Rwanda's agricultural calendar (Umuhindo, Itumba, Impeshyi) to recommend exactly what to plant and when."
              />
              <FeatureCard 
                icon={<Bot className="h-6 w-6 text-purple-500" />}
                title="AI Agronomist Chatbot"
                desc="Got a specific question? Ask our AI expert for real-time advice on crop diseases, fertilizer application, and best practices."
              />
              <FeatureCard 
                icon={<CloudSun className="h-6 w-6 text-orange-500" />}
                title="Hyper-Local Weather"
                desc="We pull live satellite weather forecasts for your specific district, analyzing rainfall to give you precise irrigation advice."
              />
              <FeatureCard 
                icon={<Users className="h-6 w-6 text-primary" />}
                title="Global Farmer Community"
                desc="Join discussions with other farmers across the country. Share tips, ask questions, and learn from a network of experts."
              />
            </div>
          </div>
        </section>

        {/* 3. Data & Technology */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl font-bold text-foreground">Trusted Data Sources</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto mb-12">
              Our recommendations aren't guesses. They are modeled on official guidance and powered by world-class APIs.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-3xl border border-border/50 bg-card p-8 md:p-10 shadow-sm flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">RAB Guidelines</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Crop suitability, planting seasons, and farming tips are closely modeled on the official guidance provided by the <strong>Rwanda Agriculture Board</strong> to ensure local accuracy and high yields.
                </p>
              </div>

              <div className="rounded-3xl border border-border/50 bg-card p-8 md:p-10 shadow-sm flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Open-Meteo API</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We integrate directly with <strong>Open-Meteo's</strong> high-resolution satellite APIs to fetch real-time temperature, precipitation, and wind data for all 30 Rwandan districts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Call to Action */}
        <section className="py-24 bg-primary text-primary-foreground text-center px-4 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to grow smarter?</h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Get your first personalized crop and irrigation recommendation based on your district's real-time weather.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 text-base shadow-lg">
                <Link to="/">Get Recommendation <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-8 text-base bg-black/20 hover:bg-black/30 text-white border-transparent">
                <Link to="/community">Join Community</Link>
              </Button>
            </div>
          </div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}></div>
        </section>

      </main>
      
      <SiteFooter />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-5 p-6 rounded-2xl transition-colors hover:bg-muted/50">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-background shadow-sm border border-border/50">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  )
}
