import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Sprout, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in · Smart Farming" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      toast.error(result.error || "Unable to sign in.");
      return;
    }
    window.localStorage.setItem("auth_token", result.token);
    window.dispatchEvent(new Event("authchange"));
    toast.success("Welcome back!");
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-primary/10 md:flex md:flex-col md:justify-between md:p-10">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15">
            <Sprout className="h-5 w-5" />
          </span>
          <span className="font-bold">Smart Farming</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-primary">
            Grow with confidence,
            <br />season after season.
          </h2>
          <p className="mt-3 max-w-sm text-muted-foreground">
            Sign in to save your crop recommendations, track weather alerts for your district and
            access expert tips.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© Smart Farming Season Advisor</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back to your farming dashboard.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            New to Smart Farming?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
