import { FARMING_TIPS } from "@/lib/farming-data";
import { RefreshCw, Leaf, FlaskConical, Sprout, Mountain, CloudRain } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, { icon: React.ReactNode, color: string, bg: string }> = {
  rotate: { icon: <RefreshCw className="h-6 w-6" />, color: "text-blue-500", bg: "bg-blue-500/10" },
  mulch: { icon: <Leaf className="h-6 w-6" />, color: "text-amber-500", bg: "bg-amber-500/10" },
  test: { icon: <FlaskConical className="h-6 w-6" />, color: "text-purple-500", bg: "bg-purple-500/10" },
  seeds: { icon: <Sprout className="h-6 w-6" />, color: "text-green-500", bg: "bg-green-500/10" },
  contour: { icon: <Mountain className="h-6 w-6" />, color: "text-stone-500", bg: "bg-stone-500/10" },
  rain: { icon: <CloudRain className="h-6 w-6" />, color: "text-cyan-500", bg: "bg-cyan-500/10" },
};

export function FarmingTips() {
  return (
    <section className="container mx-auto mt-24 px-4">
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex h-10 items-center justify-center rounded-full bg-primary/10 px-4 mb-4 text-sm font-bold text-primary">
          Expert Knowledge
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mb-4">
          Essential Farming Tips
        </h2>
        <p className="text-lg text-muted-foreground">
          Practical guidance from Rwandan agriculture experts to help you maximize your yield and protect your soil.
        </p>
      </div>

      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {FARMING_TIPS.slice(0, 3).map((t) => {
          const styling = iconMap[t.icon] || iconMap.seeds;
          return (
            <motion.article
              key={t.title}
              variants={{ initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } }}
              className="group relative overflow-hidden rounded-3xl border border-border/50 bg-card p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/20"
            >
              {/* Subtle background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              
              <div className="relative z-10">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${styling.bg} ${styling.color} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                  {styling.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{t.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 flex justify-center"
      >
        <a href="/ask-me" className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg">
          Ask AI for More Tips
        </a>
      </motion.div>
    </section>
  );
}
