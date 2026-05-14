import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { RecommendationForm } from "@/components/recommendation-form";
import { FeatureCards } from "@/components/feature-cards";
import { PopularCrops } from "@/components/popular-crops";
import { FarmingTips } from "@/components/farming-tips";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <RecommendationForm />
        <FeatureCards />
        <PopularCrops />
        <FarmingTips />
      </main>
      <SiteFooter />
    </div>
  );
}
