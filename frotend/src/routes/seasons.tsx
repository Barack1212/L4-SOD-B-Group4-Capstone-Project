import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { detectSeason } from "@/lib/farming-data";

export const Route = createFileRoute("/seasons")({
  component: SeasonsPage,
  head: () => ({
    meta: [
      { title: "Season Guide · Rwanda Farming Calendar" },
      {
        name: "description",
        content: "Rwanda's four agricultural seasons explained — Itumba, Impeshyi, Umuhindo and Urugaryi.",
      },
    ],
  }),
});

const SEASONS = [
  {
    key: "Itumba",
    label: "Itumba",
    sub: "Long rainy season",
    months: "February – May",
    color: "bg-[var(--color-tile-calendar)]",
    desc: "Heaviest rainfall of the year. Main planting season for maize, beans, rice, sorghum and most vegetables.",
    crops: ["Maize", "Beans", "Rice", "Soybean", "Wheat"],
  },
  {
    key: "Impeshyi",
    label: "Impeshyi",
    sub: "Long dry season",
    months: "June – August",
    color: "bg-[var(--color-tile-crop)]",
    desc: "Long dry period. Focus on harvesting, land preparation and irrigation for high-value vegetables.",
    crops: ["Tomato (irrigated)", "Cassava (mature)"],
  },
  {
    key: "Umuhindo",
    label: "Umuhindo",
    sub: "Short rainy season",
    months: "September – November",
    color: "bg-[var(--color-tile-tips)]",
    desc: "Second planting season. Perfect for short-cycle crops like beans and maize.",
    crops: ["Maize", "Beans", "Irish Potato", "Sorghum"],
  },
  {
    key: "Urugaryi",
    label: "Urugaryi",
    sub: "Short dry season",
    months: "December – January",
    color: "bg-[var(--color-tile-weather)]",
    desc: "Brief dry spell. Harvest Season A crops, dry beans and prepare land for Season B.",
    crops: ["Tomato", "Cassava"],
  },
];

function SeasonsPage() {
  const current = detectSeason();
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Rwanda Season Guide</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Rwanda has four distinct agricultural seasons. Knowing where you are in the calendar
          is the single most important farming decision you'll make this year.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Right now: {current.label} ({current.months})
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {SEASONS.map((s) => (
            <article
              key={s.key}
              className="overflow-hidden rounded-xl bg-card"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className={`px-6 py-5 ${s.color}`}>
                <h2 className="text-2xl font-bold">{s.label}</h2>
                <p className="text-sm font-medium opacity-80">{s.sub}</p>
                <p className="mt-1 text-sm font-semibold">{s.months}</p>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.crops.map((c) => (
                    <span
                      key={c}
                      className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
