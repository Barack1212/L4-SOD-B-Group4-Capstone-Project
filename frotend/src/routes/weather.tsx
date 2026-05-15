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
import { RWANDA_DISTRICTS, detectSeason } from "@/lib/farming-data";
import { fetchWeather, weatherCodeToText } from "@/lib/weather.functions";
import { Droplets, Thermometer, Wind, Loader2, MapPin, Sparkles, CloudRain, CloudSun } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/weather")({
  component: WeatherPage,
  head: () => ({
    meta: [
      { title: "Weather & Insights · Smart Farming Rwanda" },
      {
        name: "description",
        content: "7-day weather forecast and AI farming insights for every Rwandan district.",
      },
    ],
  }),
});

function getTemperatureGradient(tempC: number): string {
  if (tempC >= 28) return "from-orange-500 to-red-500";
  if (tempC >= 22) return "from-amber-400 to-orange-500";
  if (tempC >= 15) return "from-blue-400 to-emerald-400";
  return "from-blue-600 to-blue-400";
}

function getInsights(data: any): { title: string; advice: string; color: string; icon: any } {
  const rain = data.recentRainMm;
  const temp = data.current.tempC;
  const season = detectSeason();

  if (rain > 30) {
    return {
      title: "Heavy Rainfall Detected",
      advice: `Your district has received ${rain.toFixed(1)}mm of rain recently. Soil is saturated. Delay any fertilizer application to prevent runoff. Excellent time for transplanting.`,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      icon: <CloudRain className="h-6 w-6 text-blue-500" />
    };
  } else if (temp > 28 && rain < 5) {
    return {
      title: "Heat & Dry Stress Risk",
      advice: `High temperatures (${Math.round(temp)}°C) and low recent rainfall. If you are growing shallow-rooted crops like beans or vegetables, apply mulch immediately to retain soil moisture.`,
      color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
      icon: <Thermometer className="h-6 w-6 text-orange-500" />
    };
  } else if (season.key === "Itumba" && rain > 15) {
    return {
      title: "Optimal Itumba Conditions",
      advice: "Perfect planting conditions for Season B. Moisture levels are ideal for Maize and Rice. Watch out for fungal diseases like potato blight in these humid conditions.",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      icon: <Sparkles className="h-6 w-6 text-emerald-500" />
    };
  } else {
    return {
      title: "Stable Farming Conditions",
      advice: `Conditions are stable for the ${season.label} season. Continue standard weeding and maintenance. Good weather for applying foliar fertilizers or pesticides.`,
      color: "text-primary bg-primary/10 border-primary/20",
      icon: <CloudSun className="h-6 w-6 text-primary" />
    };
  }
}

function WeatherPage() {
  const [district, setDistrict] = useState("Gasabo");
  const dist = RWANDA_DISTRICTS.find((d) => d.name === district)!;
  const fetchWeatherFn = useServerFn(fetchWeather);

  const { data, isLoading } = useQuery({
    queryKey: ["weather", district],
    queryFn: () => fetchWeatherFn({ data: { lat: dist.lat, lon: dist.lon } }),
  });

  const w = data ? weatherCodeToText(data.current.code) : null;
  const tempGradient = data ? getTemperatureGradient(data.current.tempC) : "from-primary to-blue-500";
  const insights = data ? getInsights(data) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <motion.main 
        className="container mx-auto px-4 py-8 md:py-12 flex-1 max-w-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CloudSun className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground md:text-5xl tracking-tight mb-2">Weather & Insights</h1>
            <p className="text-lg text-muted-foreground">
              Real-time weather data and AI-driven agricultural insights for your district.
            </p>
          </div>
          
          <div className="relative z-20">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Select District</label>
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-full md:w-64 h-12 rounded-xl bg-card border-border/50 shadow-sm font-medium text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RWANDA_DISTRICTS.map((d) => (
                  <SelectItem key={d.name} value={d.name} className="cursor-pointer">
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 opacity-50" />
                      {d.name} <span className="text-muted-foreground text-xs ml-1">({d.province})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading || !data ? (
          <div className="mt-20 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="font-medium">Fetching satellite data for {district}...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Main Hero Weather Card */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-6 mb-10">
              
              <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${tempGradient} text-white shadow-xl`}>
                <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                {/* Decorative circle */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start justify-between h-full">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/20 backdrop-blur-md px-3 py-1 text-sm font-semibold mb-6">
                      <MapPin className="h-3.5 w-3.5" /> {district}, Rwanda
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-7xl md:text-8xl drop-shadow-lg">{w?.emoji}</span>
                      <div>
                        <div className="text-6xl md:text-8xl font-extrabold tracking-tighter drop-shadow-md">
                          {Math.round(data.current.tempC)}°
                        </div>
                        <div className="text-xl md:text-2xl font-semibold opacity-90 mt-1">{w?.label}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-0 grid grid-cols-2 md:grid-cols-1 gap-3 w-full md:w-auto">
                    <StatBox icon={<Droplets />} label="Rain (3d)" value={`${data.recentRainMm.toFixed(1)} mm`} />
                    <StatBox icon={<Wind />} label="Wind" value={`${Math.round(data.current.windKph)} km/h`} />
                  </div>
                </div>
              </div>

              {/* AI Insights Panel */}
              <div className={`rounded-3xl border bg-card p-6 md:p-8 flex flex-col shadow-md ${insights?.color.split(' ')[2]}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl ${insights?.color.split(' ')[1]}`}>
                    {insights?.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">AI Farming Insight</h3>
                </div>
                <h4 className={`text-sm font-bold uppercase tracking-wider mb-2 ${insights?.color.split(' ')[0]}`}>
                  {insights?.title}
                </h4>
                <p className="text-[15px] leading-relaxed text-muted-foreground flex-1">
                  {insights?.advice}
                </p>
                <div className="mt-6 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> Auto-generated based on current weather
                  </p>
                </div>
              </div>

            </div>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">7-Day Forecast</h2>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                {data.daily.map((d, i) => {
                  const dw = weatherCodeToText(d.code);
                  const date = new Date(d.date);
                  const isToday = i === 0;
                  
                  return (
                    <motion.div
                      key={d.date}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className={`relative overflow-hidden rounded-3xl border p-5 flex flex-col items-center text-center transition-all hover:shadow-lg hover:-translate-y-1 ${
                        isToday 
                          ? "border-primary/50 bg-primary/5 shadow-md" 
                          : "border-border/50 bg-card"
                      }`}
                    >
                      {isToday && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-400"></div>
                      )}
                      <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        {isToday ? "Today" : date.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div className="text-4xl mb-3 drop-shadow-sm">{dw.emoji}</div>
                      
                      {/* Temperature Range Bar */}
                      <div className="flex flex-col items-center w-full mt-auto">
                        <div className="text-2xl font-extrabold text-foreground mb-1">{Math.round(d.tempMax)}°</div>
                        <div className="text-sm font-semibold text-muted-foreground mb-3">{Math.round(d.tempMin)}°</div>
                        
                        <div className="w-full rounded-full bg-secondary/50 p-1.5 flex items-center justify-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{d.rainMm.toFixed(1)}mm</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </motion.main>
      <SiteFooter />
    </div>
  );
}

function StatBox({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="rounded-2xl bg-black/20 backdrop-blur-md p-4 flex items-center gap-4">
      <div className="text-white/80 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-white/60">{label}</div>
        <div className="text-lg font-bold text-white">{value}</div>
      </div>
    </div>
  );
}
