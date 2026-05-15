import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CROPS } from "@/lib/farming-data";
import { Droplets, Search, ArrowDownAZ, Leaf, Droplet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/crops")({
  component: CropsPage,
  head: () => ({
    meta: [
      { title: "Crops Directory · Smart Farming Rwanda" },
      {
        name: "description",
        content: "Browse all crops grown in Rwanda — best seasons, water needs and expert tips.",
      },
    ],
  }),
});

function CropsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "waterNeed">("name");

  const filteredAndSortedCrops = useMemo(() => {
    let result = CROPS.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "waterNeed") {
      const waterValue = { Low: 1, Moderate: 2, High: 3 };
      result = result.sort(
        (a, b) =>
          (waterValue[a.waterNeed as keyof typeof waterValue] || 0) -
          (waterValue[b.waterNeed as keyof typeof waterValue] || 0)
      );
    }

    return result;
  }, [searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl flex-1">
        
        {/* Header & Controls */}
        <motion.div 
          className="flex flex-col gap-6 md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-border/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground md:text-5xl tracking-tight mb-2">
              Crop Directory
            </h1>
            <p className="text-lg text-muted-foreground">
              Detailed guidance for crops grown across Rwanda's five provinces.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crops or tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-full border border-border/50 bg-card px-10 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-full border-border/50 bg-card shadow-sm h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ArrowDownAZ className="h-4 w-4 text-muted-foreground" /> Alphabetical
                  </div>
                </SelectItem>
                <SelectItem value="waterNeed" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-blue-500" /> Water Need
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Crops Grid */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedCrops.length > 0 ? (
              filteredAndSortedCrops.map((c, i) => (
                <motion.article
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="group flex flex-col rounded-3xl border border-border/50 bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-xl overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <img 
                      src={c.image} 
                      alt={c.name} 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white drop-shadow-md">{c.name}</h2>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{c.season}</p>
                      
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold
                        ${c.waterNeed === "Low" ? "bg-green-500/10 text-green-600 dark:text-green-400" : 
                          c.waterNeed === "Moderate" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" : 
                          "bg-orange-500/10 text-orange-600 dark:text-orange-400"}`}
                      >
                        <Droplets className="h-3.5 w-3.5" />
                        {c.waterNeed} Water
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span> {c.months}
                    </p>
                    
                    <p className="text-sm leading-relaxed text-muted-foreground mb-6 flex-1">
                      {c.notes}
                    </p>
                    
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Optimal Seasons</p>
                      <div className="flex flex-wrap gap-2">
                        {c.bestSeasons.map((s) => (
                          <span
                            key={s}
                            className="rounded-lg bg-secondary/50 border border-border/50 px-2.5 py-1 text-[11px] font-bold text-secondary-foreground"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Search className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-foreground">No crops found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search term.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
