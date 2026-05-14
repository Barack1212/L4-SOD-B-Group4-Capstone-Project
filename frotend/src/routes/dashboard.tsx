import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { Sprout, MapPin, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({ meta: [{ title: "Dashboard · Smart Farming" }] }),
});

function DashboardPage() {
  const { user, loading } = useAuth();

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
      <div className="grid min-h-screen place-items-center">
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
      toast.success("Removed");
      void refetch();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <header className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-primary-foreground">
          <p className="text-sm font-medium opacity-90">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold">
            {user.fullName || user.displayName || user.email?.split("@")[0]}
          </h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm opacity-90">
            {user.district && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1">
                <MapPin className="h-3.5 w-3.5" />
                {user.district}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1">
              <Sprout className="h-3.5 w-3.5" />
              Farmer account
            </span>
          </div>
        </header>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-foreground">Saved recommendations</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your personal log of crop recommendations.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recs && recs.length > 0 ? (
              recs.map((r) => (
                <article
                  key={r.id}
                  className="rounded-xl bg-card p-5"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-foreground">{r.crop}</h3>
                      <p className="text-xs text-muted-foreground">
                        {r.district} · {r.season}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => void handleDelete(r.id)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {r.advice}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Saved {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </article>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No saved recommendations yet — get one from the home page.
              </p>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
