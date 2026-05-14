import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RWANDA_DISTRICTS } from "@/lib/farming-data";
import { fetchWeather, weatherCodeToText } from "@/lib/weather.functions";
import { Droplets, Thermometer, Wind, Loader2 } from "lucide-react";

export const Route = createFileRoute("/weather")({
  component: WeatherPage,
  head: () => ({
    meta: [
      { title: "Weather · Smart Farming Rwanda" },
      {
        name: "description",
        content: "7-day weather forecast for every Rwandan district powered by Open-Meteo.",
      },
    ],
  }),
});

function WeatherPage() {
  const [district, setDistrict] = useState("Gasabo");
  const dist = RWANDA_DISTRICTS.find((d) => d.name === district)!;
  const fetchWeatherFn = useServerFn(fetchWeather);

  const { data, isLoading } = useQuery({
    queryKey: ["weather", district],
    queryFn: () => fetchWeatherFn({ data: { lat: dist.lat, lon: dist.lon } }),
  });

  const w = data ? weatherCodeToText(data.current.code) : null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary md:text-4xl">Weather Forecast</h1>
            <p className="mt-2 text-muted-foreground">
              Real-time weather + 7-day forecast from Open-Meteo for every Rwandan district.
            </p>
          </div>
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="w-56 bg-card">
              <SelectValue />
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

        {isLoading || !data ? (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <section
              className="mt-8 grid gap-6 rounded-2xl bg-card p-6 md:grid-cols-[2fr_3fr]"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div>
                <div className="text-sm font-medium text-muted-foreground">{district}</div>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-6xl">{w?.emoji}</span>
                  <div>
                    <div className="text-5xl font-bold text-foreground">
                      {Math.round(data.current.tempC)}°C
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">{w?.label}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Stat icon={<Thermometer className="h-4 w-4" />} label="Today" value={`${Math.round(data.current.tempC)}°C`} />
                <Stat
                  icon={<Droplets className="h-4 w-4" />}
                  label="Rain (3d)"
                  value={`${data.recentRainMm.toFixed(1)} mm`}
                />
                <Stat
                  icon={<Wind className="h-4 w-4" />}
                  label="Wind"
                  value={`${Math.round(data.current.windKph)} km/h`}
                />
              </div>
            </section>

            <h2 className="mt-10 text-xl font-bold text-foreground">7-day forecast</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-7">
              {data.daily.map((d) => {
                const dw = weatherCodeToText(d.code);
                return (
                  <div
                    key={d.date}
                    className="rounded-xl bg-card p-4 text-center"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    <div className="text-xs font-medium text-muted-foreground">
                      {new Date(d.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="my-2 text-3xl">{dw.emoji}</div>
                    <div className="text-sm font-bold">{Math.round(d.tempMax)}°</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(d.tempMin)}° · {d.rainMm.toFixed(1)}mm
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
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
  value: string;
}) {
  return (
    <div className="rounded-lg bg-secondary/40 p-3">
      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}
