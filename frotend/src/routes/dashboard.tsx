import { createFileRoute, Navigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { 
  Sprout, 
  MapPin, 
  Loader2, 
  Trash2, 
  CalendarRange, 
  MessageSquare, 
  Bot, 
  CloudSun, 
  FolderOpen,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CROPS, detectSeason } from "@/lib/farming-data";
import { motion } from "framer-motion";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard · Smart Farming" }] }),
});

function DashboardPage() {
  const { user, loading } = useAuth();
  const currentSeason = detectSeason();

  const { data: recs, refetch } = useQuery({
    enabled: !!user,
    queryKey: ["saved-recs", user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const token = window.localStorage.getItem("auth_token");
      const response = await fetch("/api/recommendations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Unable to load saved recommendations.");
      }
      return response.json();
    },
  });

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;

  async function handleDelete(id: string) {
    const token = window.localStorage.getItem("auth_token");
    const response = await fetch(`/api/recommendations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    if (!response.ok) toast.error(result.error || "Unable to delete recommendation.");
    else {
      toast.success("Recommendation removed");
      void refetch();
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <motion.main 
        className="container mx-auto px-4 py-8 md:py-12 flex-1 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Welcome Header */}
        <header className="rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-8 md:p-10 text-primary-foreground relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <p className="text-sm font-medium text-primary-foreground/80 tracking-wide uppercase">Welcome back</p>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight">
              {user.fullName || user.displayName || user.email?.split("@")[0]}
            </h1>
            <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium">
              {user.district && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 backdrop-blur-md">
                  <MapPin className="h-4 w-4" />
                  {user.district} District
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-1.5 backdrop-blur-md">
                <Sprout className="h-4 w-4" />
                Farmer Account
              </span>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute right-0 top-0 -mr-16 -mt-16 opacity-10">
            <Sprout className="h-64 w-64" />
          </div>
        </header>

        {/* Quick Stats & Actions Grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Season</p>
              <h3 className="text-lg font-bold text-foreground">{currentSeason.name}</h3>
            </div>
          </div>
          
          <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <FolderOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saved Insights</p>
              <h3 className="text-lg font-bold text-foreground">{recs?.length || 0} Records</h3>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col justify-center gap-3 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Quick Tools</p>
            <div className="flex gap-2">
              <Button asChild variant="secondary" size="sm" className="flex-1 gap-1.5 bg-secondary hover:bg-secondary/80">
                <Link to="/ask-me"><Bot className="h-4 w-4" /> Ask AI</Link>
              </Button>
              <Button asChild variant="secondary" size="sm" className="flex-1 gap-1.5 bg-secondary hover:bg-secondary/80">
                <Link to="/weather"><CloudSun className="h-4 w-4" /> Weather</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="mt-10 lg:grid lg:grid-cols-3 lg:gap-8">
          
          {/* Saved Recommendations */}
          <section className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Recommendations</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Personalized agricultural logs and advice.
                </p>
              </div>
              <Button asChild size="sm" variant="outline" className="hidden md:flex gap-2">
                <Link to="/">New <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid gap-5">
              {recs && recs.length > 0 ? (
                recs.map((r) => {
                  const cropData = CROPS.find(c => c.name.toLowerCase() === r.crop.toLowerCase());
                  
                  return (
                    <motion.article
                      key={r.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md"
                    >
                      <div className="flex items-start gap-4">
                        {cropData ? (
                          <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            <img src={cropData.image} alt={cropData.name} className="h-full w-full object-cover" />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
                            🌱
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                {r.crop}
                              </h3>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="font-medium">{r.district}</Badge>
                                <Badge variant="outline" className="text-muted-foreground">{r.season}</Badge>
                                <span className="text-[11px] text-muted-foreground ml-1">
                                  {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => void handleDelete(r.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1 hover:bg-destructive/10 hover:text-destructive"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="mt-4 rounded-xl bg-muted/30 p-4 border border-border/40">
                            <p className="text-[14px] leading-relaxed text-foreground">
                              {r.advice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-border/60 bg-card/50 p-12 text-center flex flex-col items-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-5">
                    <FolderOpen className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No recommendations yet</h3>
                  <p className="mt-2 text-muted-foreground max-w-sm mb-6">
                    Get your first personalized crop and irrigation recommendation based on your district's real-time weather.
                  </p>
                  <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                    <Link to="/">Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* Sidebar Area */}
          <aside className="mt-8 lg:mt-0 space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <MessageSquare className="h-24 w-24 -mr-6 -mt-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground relative z-10">Community Highlights</h3>
              <p className="mt-2 text-sm text-muted-foreground relative z-10">
                Join discussions with other farmers in Rwanda. Share tips and get expert advice.
              </p>
              <Button asChild variant="outline" className="mt-5 w-full relative z-10 border-primary/20 hover:bg-primary/5 text-primary">
                <Link to="/community">View Forum</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold text-foreground">Season Guide</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Season A (Umuhindo)</span>
                  <span className="text-muted-foreground">Sep - Feb</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Season B (Itumba)</span>
                  <span className="text-muted-foreground">Feb - Jul</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">Season C (Impeshyi)</span>
                  <span className="text-muted-foreground">Jul - Sep</span>
                </div>
              </div>
              <Button asChild variant="ghost" className="mt-4 w-full text-xs h-8">
                <Link to="/seasons">Learn more about seasons</Link>
              </Button>
            </div>
          </aside>
          
        </div>
      </motion.main>
      <SiteFooter />
    </div>
  );
}
