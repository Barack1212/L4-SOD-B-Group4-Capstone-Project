import { Calendar, CloudRain, Sprout, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CARDS = [
  {
    icon: Calendar,
    title: "Best Planting Time",
    body: "Know the perfect months to plant your crops",
    cta: "View Calendar",
    to: "/seasons",
    bg: "bg-[var(--color-tile-calendar)]",
    iconColor: "text-primary",
  },
  {
    icon: CloudRain,
    title: "Weather Based Advice",
    body: "Get recommendations based on local weather",
    cta: "Check Weather",
    to: "/weather",
    bg: "bg-[var(--color-tile-weather)]",
    iconColor: "text-info",
  },
  {
    icon: Sprout,
    title: "Crop Suitability",
    body: "Find crops that grow best in your soil and climate",
    cta: "Explore Crops",
    to: "/crops",
    bg: "bg-[var(--color-tile-crop)]",
    iconColor: "text-warning",
  },
  {
    icon: GraduationCap,
    title: "Expert Tips",
    body: "Practical tips from agriculture experts",
    cta: "Read Tips",
    to: "/tips",
    bg: "bg-[var(--color-tile-tips)]",
    iconColor: "text-foreground/70",
  },
] as const;

export function FeatureCards() {
  return (
    <section className="container mx-auto mt-12 px-4">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((c) => (
          <article
            key={c.title}
            className="rounded-xl bg-card p-5 transition-shadow hover:shadow-md"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl ${c.bg} ${c.iconColor}`}
            >
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">{c.title}</h3>
            <p className="mt-1 text-sm leading-snug text-muted-foreground">{c.body}</p>
            <Link
              to={c.to}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {c.cta} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
