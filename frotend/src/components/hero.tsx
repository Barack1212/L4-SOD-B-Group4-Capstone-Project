import { Calendar, Sprout, TrendingUp, MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero-farmer.jpg";

const BADGES = [
  { icon: Calendar, label: "Right Season", color: "text-warning" },
  { icon: Sprout, label: "Better Yield", color: "text-warning" },
  { icon: TrendingUp, label: "Higher Profit", color: "text-warning" },
  { icon: MessageCircle, label: "Expert Tips", color: "text-warning" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-b-3xl">
          <img
            src={heroImg}
            alt="Smiling Rwandan farmer in a green crop field at sunset"
            width={1920}
            height={1080}
            className="h-[520px] w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-hero)" }}
            aria-hidden
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-2xl text-primary-foreground">
                <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
                  Know the Right Time,
                  <br />
                  Grow Better,{" "}
                  <span className="text-warning">Earn Better</span>
                </h1>
                <p className="mt-5 max-w-lg text-base text-primary-foreground/85 md:text-lg">
                  Get the best planting time, suitable season, and expert tips for every crop in
                  your region.
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {BADGES.map((b) => (
                    <span
                      key={b.label}
                      className="inline-flex items-center gap-2 rounded-md bg-black/35 px-3.5 py-2 text-sm font-medium text-primary-foreground backdrop-blur-sm"
                    >
                      <b.icon className={`h-4 w-4 ${b.color}`} />
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
