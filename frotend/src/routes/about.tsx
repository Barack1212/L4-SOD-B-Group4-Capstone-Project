import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About · Smart Farming Season Advisor" },
      {
        name: "description",
        content:
          "Smart Farming Season Advisor helps Rwandan farmers know when to plant, what to grow and how much to irrigate.",
      },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">About</h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground">
          Smart Farming Season Advisor is a digital extension service for Rwandan farmers. It
          combines local season knowledge, district-level weather forecasts and crop suitability
          rules into a single, simple recommendation.
        </p>
        <p className="mt-4 text-muted-foreground">
          Weather data comes from Open-Meteo's free forecast API. Crop and season knowledge is
          modeled on guidance from the Rwanda Agriculture Board (RAB) and is regularly reviewed
          by agronomists.
        </p>
        <h2 className="mt-10 text-xl font-bold">What it does</h2>
        <ul className="mt-3 space-y-2 text-muted-foreground">
          <li>• Detects the current Rwandan agricultural season automatically.</li>
          <li>• Recommends the best crops for your district and the current season.</li>
          <li>• Suggests how much to irrigate based on real rainfall and temperature.</li>
          <li>• Saves your recommendations to a personal dashboard.</li>
        </ul>
      </main>
      <SiteFooter />
    </div>
  );
}
