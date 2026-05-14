import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Users, BookmarkCheck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin · Smart Farming" }] }),
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();

  const { data, isLoading } = useQuery({
    enabled: !!user && isAdmin,
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const token = window.localStorage.getItem("auth_token");
      const response = await fetch("/api/admin/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unable to load admin overview.");
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
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto px-4 py-24 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">Admins only</h1>
          <p className="mt-2 text-muted-foreground">
            Your account doesn't have admin access. Ask an existing admin to grant you the role.
          </p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary md:text-4xl">Admin overview</h1>
        <p className="mt-2 text-muted-foreground">Platform-wide metrics across all farmers.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <Stat
            icon={<Users className="h-5 w-5" />}
            label="Registered farmers"
            value={data?.profiles.length ?? 0}
          />
          <Stat
            icon={<BookmarkCheck className="h-5 w-5" />}
            label="Saved recommendations"
            value={data?.recommendations.length ?? 0}
          />
          <Stat
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Districts covered"
            value={new Set(data?.profiles.map((p) => p.district).filter(Boolean)).size}
          />
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold">Recent recommendations</h2>
          {isLoading ? (
            <Loader2 className="mt-4 h-6 w-6 animate-spin text-primary" />
          ) : (
            <div className="mt-4 overflow-hidden rounded-xl bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Season</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.recommendations.slice(0, 20).map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{r.crop}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.district}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.season}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {data && data.recommendations.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No recommendations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-2 text-3xl font-bold text-foreground">{value}</div>
    </div>
  );
}
