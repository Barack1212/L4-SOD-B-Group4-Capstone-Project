import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sprout, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RWANDA_DISTRICTS } from "@/lib/farming-data";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create account · Smart Farming" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [district, setDistrict] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, district }),
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      toast.error(result.error || "Unable to create account.");
      return;
    }
    toast.success("Account created — you can now sign in.");
    void navigate({ to: "/login" });
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
          <h2 className="text-3xl font-bold text-primary">Join Rwanda's smart farmers.</h2>
          <p className="mt-3 max-w-sm text-muted-foreground">
            Create a free account to save crop recommendations and unlock weather alerts for your
            district.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© Smart Farming Season Advisor</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-foreground">Create your farmer account</h1>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5"
              />
            </div>
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select your district" />
                </SelectTrigger>
                <SelectContent>
                  {RWANDA_DISTRICTS.map((d) => (
                    <SelectItem key={d.name} value={d.name}>
                      {d.name} · {d.province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
