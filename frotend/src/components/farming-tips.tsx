import { FARMING_TIPS } from "@/lib/farming-data";
import { RefreshCw, Leaf, FlaskConical, Sprout, Mountain, CloudRain } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  rotate: <RefreshCw className="h-8 w-8 text-primary" />,
  mulch: <Leaf className="h-8 w-8 text-amber-500" />,
  test: <FlaskConical className="h-8 w-8 text-purple-500" />,
  seeds: <Sprout className="h-8 w-8 text-green-500" />,
  contour: <Mountain className="h-8 w-8 text-stone-500" />,
  rain: <CloudRain className="h-8 w-8 text-blue-500" />,
};
export function FarmingTips() {
  return (
    <section className="container mx-auto mt-16 px-4">
      <div>
        <h2 className="text-2xl font-bold text-primary md:text-3xl">Expert Farming Tips</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Practical guidance from Rwandan agriculture experts
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FARMING_TIPS.map((t) => (
          <article
            key={t.title}
            className="rounded-xl bg-card p-5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/50">
              {iconMap[t.icon]}
            </div>
            <h3 className="mt-3 text-base font-bold text-foreground">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
