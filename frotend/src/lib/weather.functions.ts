import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

export interface WeatherSummary {
  current: { tempC: number; rainMm: number; windKph: number; code: number };
  daily: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    rainMm: number;
    code: number;
  }>;
  recentRainMm: number; // sum past 3 days
}

export const fetchWeather = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<WeatherSummary> => {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(data.lat));
    url.searchParams.set("longitude", String(data.lon));
    url.searchParams.set(
      "current",
      "temperature_2m,precipitation,wind_speed_10m,weather_code",
    );
    url.searchParams.set(
      "daily",
      "temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code",
    );
    url.searchParams.set("past_days", "3");
    url.searchParams.set("forecast_days", "7");
    url.searchParams.set("timezone", "Africa/Kigali");

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Weather API error ${res.status}`);
    const json = (await res.json()) as {
      current: {
        temperature_2m: number;
        precipitation: number;
        wind_speed_10m: number;
        weather_code: number;
      };
      daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
        weather_code: number[];
      };
    };

    const daily = json.daily.time.map((t, i) => ({
      date: t,
      tempMax: json.daily.temperature_2m_max[i],
      tempMin: json.daily.temperature_2m_min[i],
      rainMm: json.daily.precipitation_sum[i],
      code: json.daily.weather_code[i],
    }));

    const recentRainMm = daily.slice(0, 3).reduce((s, d) => s + (d.rainMm || 0), 0);

    return {
      current: {
        tempC: json.current.temperature_2m,
        rainMm: json.current.precipitation,
        windKph: json.current.wind_speed_10m,
        code: json.current.weather_code,
      },
      daily: daily.slice(3), // forecast only
      recentRainMm,
    };
  });

export function weatherCodeToText(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear sky", emoji: "☀️" };
  if (code <= 2) return { label: "Mostly sunny", emoji: "🌤️" };
  if (code === 3) return { label: "Cloudy", emoji: "☁️" };
  if (code <= 48) return { label: "Foggy", emoji: "🌫️" };
  if (code <= 57) return { label: "Drizzle", emoji: "🌦️" };
  if (code <= 67) return { label: "Rain", emoji: "🌧️" };
  if (code <= 77) return { label: "Snow", emoji: "🌨️" };
  if (code <= 82) return { label: "Showers", emoji: "🌧️" };
  if (code <= 99) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "—", emoji: "🌥️" };
}
