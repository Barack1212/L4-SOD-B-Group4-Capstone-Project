import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FarmingTips } from "@/components/farming-tips";

export const Route = createFileRoute("/tips")({
  component: TipsPage,
  head: () => ({
    meta: [
      { title: "Farming Tips · Smart Farming Rwanda" },
      {
        name: "description",
        content: "Practical farming tips from Rwandan agriculture experts.",
      },
    ],
  }),
});

function TipsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="pb-12 pt-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary md:text-4xl">Farming Tips</h1>
          <p className="mt-2 text-muted-foreground">
            Practical, locally-relevant advice for boosting yield and protecting your soil.
          </p>
        </div>
        <FarmingTips />
      </main>
      <SiteFooter />
    </div>
  );
}
