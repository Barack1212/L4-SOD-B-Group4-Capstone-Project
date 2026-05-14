import { Link } from "@tanstack/react-router";
import { Sprout, UserRound, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Crops", to: "/crops" },
  { label: "Season Guide", to: "/seasons" },
  { label: "Weather", to: "/weather" },
  { label: "Tips", to: "/tips" },
  { label: "About", to: "/about" },
] as const;

export function SiteHeader() {
  const { user, isAdmin, signOut } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-primary">Smart Farming</span>
            <span className="block text-[11px] font-medium text-muted-foreground">
              Season Advisor
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/admin">Admin</Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => void signOut()}>
                <LogOut className="mr-1.5 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/login">
                <UserRound className="h-4 w-4" />
                Farmer Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
