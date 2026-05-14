import { Sprout } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="container mx-auto grid gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Sprout className="h-4 w-4" />
            </span>
            <span className="font-bold text-primary">Smart Farming</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Season-aware crop advice for every Rwandan farmer.
          </p>
        </div>
        <FooterCol
          title="Product"
          items={["Crop Guide", "Weather", "Season Calendar", "Tips"]}
        />
        <FooterCol title="Resources" items={["RAB Guidelines", "Soil Health", "Markets"]} />
        <FooterCol title="Company" items={["About", "Contact", "Privacy"]} />
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Smart Farming Season Advisor · Built for Rwandan agriculture
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i} className="hover:text-primary cursor-pointer">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
