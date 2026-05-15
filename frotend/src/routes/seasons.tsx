import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { detectSeason } from "@/lib/farming-data";
import { motion } from "framer-motion";
import { CalendarDays, CloudRain, Sun, CloudDrizzle, CheckCircle2 } from "lucide-react";

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
    gradient: "from-blue-600 to-blue-400",
    bgLight: "bg-blue-500/10",
    textColor: "text-blue-500",
    icon: <CloudRain className="h-8 w-8 text-white" />,
    desc: "Heaviest rainfall of the year. Main planting season for maize, beans, rice, sorghum and most vegetables.",
    crops: ["Maize", "Beans", "Rice", "Soybean", "Wheat"],
  },
  {
    key: "Impeshyi",
    label: "Impeshyi",
    sub: "Long dry season",
    months: "June – August",
    gradient: "from-orange-500 to-amber-400",
    bgLight: "bg-orange-500/10",
    textColor: "text-orange-500",
    icon: <Sun className="h-8 w-8 text-white" />,
    desc: "Long dry period. Focus on harvesting, land preparation and irrigation for high-value vegetables.",
    crops: ["Tomato (irrigated)", "Cassava (mature)"],
  },
  {
    key: "Umuhindo",
    label: "Umuhindo",
    sub: "Short rainy season",
    months: "September – November",
    gradient: "from-emerald-600 to-green-400",
    bgLight: "bg-emerald-500/10",
    textColor: "text-emerald-500",
    icon: <CloudDrizzle className="h-8 w-8 text-white" />,
    desc: "Second planting season. Perfect for short-cycle crops like beans and maize. Expect moderate rainfall.",
    crops: ["Maize", "Beans", "Irish Potato", "Sorghum"],
  },
  {
    key: "Urugaryi",
    label: "Urugaryi",
    sub: "Short dry season",
    months: "December – January",
    gradient: "from-yellow-600 to-amber-500",
    bgLight: "bg-yellow-500/10",
    textColor: "text-yellow-600",
    icon: <Sun className="h-8 w-8 text-white opacity-80" />,
    desc: "Brief dry spell. Harvest Season A crops, dry beans and prepare land for Season B.",
    crops: ["Tomato", "Cassava"],
  },
];

function SeasonsPage() {
  const current = detectSeason();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <motion.main 
        className="container mx-auto px-4 py-8 md:py-16 flex-1 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8 justify-between items-start md:items-center mb-12">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground md:text-5xl tracking-tight mb-4">Rwanda Season Guide</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Rwanda has four distinct agricultural seasons. Knowing where you are in the calendar
              is the single most important farming decision you'll make this year.
            </p>
          </div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="rounded-3xl border border-primary/30 bg-primary/5 p-6 text-center shadow-sm relative overflow-hidden shrink-0 min-w-[280px]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10 -mr-10 -mt-10"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Current Season</p>
            <h2 className="text-3xl font-extrabold text-foreground">{current.label}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">{current.months}</p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 relative">
          {/* Central timeline line for larger screens */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border/60 -translate-x-1/2 rounded-full"></div>

          {SEASONS.map((s, i) => {
            const isCurrent = current.key === s.key;
            
            return (
              <motion.article
                key={s.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-3xl bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isCurrent ? "ring-2 ring-primary ring-offset-4 ring-offset-background shadow-lg" : "border border-border/50 shadow-sm"
                }`}
              >
                {isCurrent && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-primary shadow-sm">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active Now
                  </div>
                )}
                
                <div className={`px-8 py-8 md:py-10 bg-gradient-to-br ${s.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                  <div className="absolute -right-4 -top-4 opacity-20 transform scale-150">
                    {s.icon}
                  </div>
                  
                  <div className="relative z-10 text-white">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md shadow-sm">
                        {s.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-extrabold drop-shadow-sm">{s.label}</h2>
                        <p className="text-sm font-bold text-white/90 uppercase tracking-wider">{s.sub}</p>
                      </div>
                    </div>
                    <p className="mt-4 inline-block rounded-full bg-black/20 backdrop-blur-sm px-3 py-1 text-sm font-semibold">
                      {s.months}
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-base leading-relaxed text-muted-foreground mb-6">{s.desc}</p>
                  
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Optimal Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {s.crops.map((c) => (
                        <span
                          key={c}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${s.bgLight} ${s.textColor}`}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.main>
      <SiteFooter />
    </div>
  );
}
