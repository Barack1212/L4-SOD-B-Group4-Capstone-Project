import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Search, Sprout, MapPin, Building2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CROPS,
  RWANDA_DISTRICTS,
  detectSeason,
  recommendCropsFor,
  suggestIrrigation,
} from "@/lib/farming-data";
import { fetchWeather, weatherCodeToText } from "@/lib/weather.functions";
import { useAuth } from "@/hooks/use-auth";

const PROVINCES = ["Kigali", "Northern", "Southern", "Eastern", "Western"] as const;

export function RecommendationForm() {
  const [crop, setCrop] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [result, setResult] = useState<null | {
    crop: string;
    district: string;
    season: string;
    advice: string;
    weatherLabel: string;
    rain: string;
    temp: string;
    irrigationLevel: string;
    irrigationLiters: string;
    suggestedCrops: string[];
  }>(null);
  const { user } = useAuth();

  const districts = useMemo(
    () =>
      province
        ? RWANDA_DISTRICTS.filter((d) => d.province === province)
        : RWANDA_DISTRICTS,
    [province],
  );

  const fetchWeatherFn = useServerFn(fetchWeather);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!crop || !district) throw new Error("Please choose a crop and district.");
      const dist = RWANDA_DISTRICTS.find((d) => d.name === district)!;
      const cropData = CROPS.find((c) => c.id === crop)!;
      const season = detectSeason();
      const weather = await fetchWeatherFn({ data: { lat: dist.lat, lon: dist.lon } });
      const w = weatherCodeToText(weather.current.code);
      const irrigation = suggestIrrigation(
        weather.recentRainMm,
        weather.daily[0]?.tempMax ?? weather.current.tempC,
        cropData.waterNeed,
      );
      const suggested = recommendCropsFor(district, season.key).map((c) => c.name);
      const isBest = cropData.bestSeasons.includes(season.key);
      const advice = `${cropData.name} is ${isBest ? "well-suited" : "not the best fit"
        } for ${season.label} in ${district}. ${cropData.notes} ${irrigation.message}`;

      return {
        crop: cropData.name,
        district,
        season: season.label,
        advice,
        weatherLabel: `${w.emoji} ${w.label}`,
        rain: `${weather.recentRainMm.toFixed(1)} mm last 3 days`,
        temp: `${Math.round(weather.current.tempC)}°C`,
        irrigationLevel: irrigation.level,
        irrigationLiters: irrigation.liters,
        suggestedCrops: suggested,
      };
    },
    onSuccess: (r) => setResult(r),
    onError: (e: Error) => toast.error(e.message),
  });

  async function handleSave() {
    if (!user) {
      toast.info("Sign in to save recommendations.");
      return;
    }
    if (!result) return;
    const token = window.localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please sign in first.");
      return;
    }
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        crop: result.crop,
        district: result.district,
        season: result.season,
        advice: result.advice,
      }),
    });
    const data = await response.json();
    if (!response.ok) toast.error(data.error || "Unable to save recommendation.");
    else toast.success("Recommendation saved to your dashboard.");
  }

  return (
    <section className="container relative z-10 mx-auto -mt-20 px-4">
      <div
        className="rounded-2xl bg-card p-6 md:p-7"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <h2 className="text-lg font-bold text-foreground">Find the Best Season for Your Crop</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
          <Field label="Select Crop" icon={<Sprout className="h-4 w-4 text-primary" />}>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger className="border-input bg-background">
                <SelectValue placeholder="Select Crop" />
              </SelectTrigger>
              <SelectContent>
                {CROPS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Select Province" icon={<MapPin className="h-4 w-4 text-primary" />}>
            <Select
              value={province}
              onValueChange={(v) => {
                setProvince(v);
                setDistrict("");
              }}
            >
              <SelectTrigger className="border-input bg-background">
                <SelectValue placeholder="Select Province" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Select District" icon={<Building2 className="h-4 w-4 text-primary" />}>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="border-input bg-background">
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d.name} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="flex items-end">
            <Button
              size="lg"
              className="h-11 w-full gap-2 px-6 md:w-auto"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Get Recommendation
            </Button>
          </div>
        </div>

        {result && (
          <div className="mt-7 grid gap-4 rounded-xl bg-secondary/40 p-5 md:grid-cols-3">
            <ResultStat label="Current Season" value={result.season} />
            <ResultStat label="Weather" value={`${result.weatherLabel} · ${result.temp}`} />
            <ResultStat
              label="Irrigation"
              value={`${result.irrigationLevel} · ${result.irrigationLiters}`}
            />
            <div className="md:col-span-3">
              <p className="text-sm leading-relaxed text-foreground">
                <span className="font-semibold text-primary">Advice:</span> {result.advice}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Recent rainfall:</span> {result.rain}
              </p>
              {result.suggestedCrops.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Other crops thriving here this season:
                  </span>{" "}
                  {result.suggestedCrops.join(" · ")}
                </p>
              )}
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
                  <Save className="h-4 w-4" />
                  Save recommendation
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-base font-semibold text-foreground">{value}</div>
    </div>
  );
}
