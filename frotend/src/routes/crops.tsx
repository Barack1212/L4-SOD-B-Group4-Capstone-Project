import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CROPS } from "@/lib/farming-data";
import { Droplets } from "lucide-react";

export const Route = createFileRoute("/crops")({
  component: CropsPage,
  head: () => ({
    meta: [
      { title: "Crops · Smart Farming Rwanda" },
      {
        name: "description",
        content: "Browse all crops grown in Rwanda — best seasons, water needs and tips.",
      },
    ],
  }),
});

function CropsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">All Crops</h1>
        <p className="mt-2 text-muted-foreground">
          Detailed guidance for crops grown across Rwanda's five provinces.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CROPS.map((c) => (
            <article
              key={c.id}
              className="rounded-xl bg-card p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-4xl">{c.emoji}</div>
                  <h2 className="mt-2 text-lg font-bold">{c.name}</h2>
                  <p className="text-xs font-medium text-muted-foreground">{c.season}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-info/10 px-2 py-1 text-xs font-medium text-info">
                  <Droplets className="h-3 w-3" />
                  {c.waterNeed}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">{c.months}</p>
              <p className="mt-1 text-sm text-muted-foreground">{c.notes}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.bestSeasons.map((s) => (
                  <span
                    key={s}
                    className="rounded bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
