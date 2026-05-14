import { FARMING_TIPS } from "@/lib/farming-data";

export function FarmingTips() {
  return (
    <section className="container mx-auto mt-16 px-4">
      <div>
        <h2 className="text-2xl font-bold text-primary md:text-3xl">Expert Farming Tips</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Practical guidance from Rwandan agriculture experts
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FARMING_TIPS.map((t) => (
          <article
            key={t.title}
            className="rounded-xl bg-card p-5"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-3xl">{t.icon}</div>
            <h3 className="mt-3 text-base font-bold text-foreground">{t.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
