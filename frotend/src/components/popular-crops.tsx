import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CROPS, POPULAR_CROPS } from "@/lib/farming-data";

const CROP_BG: Record<string, string> = {
  maize: "from-yellow-400/30 to-yellow-600/30",
  beans: "from-rose-400/30 to-rose-600/30",
  rice: "from-lime-400/30 to-lime-700/30",
  "irish-potato": "from-amber-300/30 to-amber-700/30",
  cassava: "from-stone-400/30 to-stone-600/30",
  banana: "from-yellow-300/30 to-emerald-500/30",
};

export function PopularCrops() {
  const popular = POPULAR_CROPS.map((id) => CROPS.find((c) => c.id === id)!).filter(Boolean);

  return (
    <section className="container mx-auto mt-16 px-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary md:text-3xl">Popular Crops</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore best seasons for commonly grown crops
          </p>
        </div>
        <Button asChild variant="outline" className="gap-1.5">
          <Link to="/crops">
            View All Crops <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {popular.map((c) => (
          <article
            key={c.id}
            className="overflow-hidden rounded-xl bg-card transition-transform hover:-translate-y-1"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div
              className={`flex h-32 items-center justify-center bg-gradient-to-br text-6xl ${
                CROP_BG[c.id] ?? "from-primary/20 to-primary/40"
              }`}
            >
              {c.emoji}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-foreground">{c.name}</h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{c.season}</p>
              <p className="text-xs text-muted-foreground">{c.months}</p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-3 w-full text-primary border-primary/30 hover:bg-primary/5"
              >
                <Link to="/crops">View Details</Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
