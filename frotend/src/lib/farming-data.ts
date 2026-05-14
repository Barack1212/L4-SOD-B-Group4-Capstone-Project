// Smart Farming domain data: Rwanda districts, seasons, crops, and recommendation logic.

export const RWANDA_DISTRICTS = [
  // Kigali City
  { name: "Gasabo", province: "Kigali", lat: -1.9167, lon: 30.1333 },
  { name: "Kicukiro", province: "Kigali", lat: -1.9833, lon: 30.1 },
  { name: "Nyarugenge", province: "Kigali", lat: -1.95, lon: 30.05 },
  // Northern
  { name: "Burera", province: "Northern", lat: -1.4833, lon: 29.85 },
  { name: "Gakenke", province: "Northern", lat: -1.7, lon: 29.7833 },
  { name: "Gicumbi", province: "Northern", lat: -1.5833, lon: 30.1 },
  { name: "Musanze", province: "Northern", lat: -1.5, lon: 29.6333 },
  { name: "Rulindo", province: "Northern", lat: -1.7667, lon: 30.0667 },
  // Southern
  { name: "Gisagara", province: "Southern", lat: -2.6, lon: 29.85 },
  { name: "Huye", province: "Southern", lat: -2.6, lon: 29.75 },
  { name: "Kamonyi", province: "Southern", lat: -2.0167, lon: 29.9 },
  { name: "Muhanga", province: "Southern", lat: -2.0833, lon: 29.75 },
  { name: "Nyamagabe", province: "Southern", lat: -2.4667, lon: 29.55 },
  { name: "Nyanza", province: "Southern", lat: -2.35, lon: 29.75 },
  { name: "Nyaruguru", province: "Southern", lat: -2.6833, lon: 29.4 },
  { name: "Ruhango", province: "Southern", lat: -2.2333, lon: 29.7833 },
  // Eastern
  { name: "Bugesera", province: "Eastern", lat: -2.2, lon: 30.15 },
  { name: "Gatsibo", province: "Eastern", lat: -1.5833, lon: 30.45 },
  { name: "Kayonza", province: "Eastern", lat: -1.8833, lon: 30.6167 },
  { name: "Kirehe", province: "Eastern", lat: -2.2167, lon: 30.7 },
  { name: "Ngoma", province: "Eastern", lat: -2.1667, lon: 30.4667 },
  { name: "Nyagatare", province: "Eastern", lat: -1.3, lon: 30.3333 },
  { name: "Rwamagana", province: "Eastern", lat: -1.95, lon: 30.4333 },
  // Western
  { name: "Karongi", province: "Western", lat: -2.0667, lon: 29.4 },
  { name: "Ngororero", province: "Western", lat: -1.85, lon: 29.6167 },
  { name: "Nyabihu", province: "Western", lat: -1.65, lon: 29.5 },
  { name: "Nyamasheke", province: "Western", lat: -2.4167, lon: 29.1333 },
  { name: "Rubavu", province: "Western", lat: -1.6833, lon: 29.2667 },
  { name: "Rusizi", province: "Western", lat: -2.4833, lon: 28.9 },
  { name: "Rutsiro", province: "Western", lat: -1.95, lon: 29.3333 },
] as const;

export type District = (typeof RWANDA_DISTRICTS)[number];

export type RwandaSeason = "Itumba" | "Impeshyi" | "Umuhindo" | "Urugaryi";

export interface SeasonInfo {
  key: RwandaSeason;
  label: string;
  months: string;
  description: string;
}

// Rwanda's 4 agricultural seasons
export function detectSeason(date: Date = new Date()): SeasonInfo {
  const m = date.getMonth() + 1; // 1..12
  if (m >= 2 && m <= 5)
    return {
      key: "Itumba",
      label: "Itumba (Long rains)",
      months: "Feb – May",
      description: "Main planting season — heavy reliable rainfall, ideal for most crops.",
    };
  if (m >= 6 && m <= 8)
    return {
      key: "Impeshyi",
      label: "Impeshyi (Long dry)",
      months: "Jun – Aug",
      description: "Long dry season — focus on harvest, irrigation and drought-tolerant crops.",
    };
  if (m >= 9 && m <= 11)
    return {
      key: "Umuhindo",
      label: "Umuhindo (Short rains)",
      months: "Sep – Nov",
      description: "Second planting season — good for short-cycle crops and beans.",
    };
  return {
    key: "Urugaryi",
    label: "Urugaryi (Short dry)",
    months: "Dec – Jan",
    description: "Short dry season — land preparation and harvesting late crops.",
  };
}

export interface Crop {
  id: string;
  name: string;
  emoji: string;
  season: string;
  months: string;
  bestSeasons: RwandaSeason[];
  waterNeed: "Low" | "Medium" | "High";
  notes: string;
}

export const CROPS: Crop[] = [
  {
    id: "maize",
    name: "Maize",
    emoji: "🌽",
    season: "Season A & B",
    months: "Sep – Jan / Feb – Jun",
    bestSeasons: ["Umuhindo", "Itumba"],
    waterNeed: "Medium",
    notes: "Plant at start of rains. Use NPK 17-17-17 at planting and urea top-dressing.",
  },
  {
    id: "beans",
    name: "Beans",
    emoji: "🫘",
    season: "Season A & B",
    months: "Sep – Dec / Mar – Jun",
    bestSeasons: ["Umuhindo", "Itumba"],
    waterNeed: "Medium",
    notes: "Short-cycle (3 months). Rotate with maize to fix nitrogen in soil.",
  },
  {
    id: "rice",
    name: "Rice",
    emoji: "🌾",
    season: "Season A",
    months: "Mar – Jul",
    bestSeasons: ["Itumba"],
    waterNeed: "High",
    notes: "Lowland marshes only. Needs continuous flooding during vegetative stage.",
  },
  {
    id: "irish-potato",
    name: "Irish Potato",
    emoji: "🥔",
    season: "Season A & B",
    months: "Sep – Dec / Feb – Jun",
    bestSeasons: ["Umuhindo", "Itumba"],
    waterNeed: "Medium",
    notes: "Best in highlands (Musanze, Burera, Nyabihu). Needs cool nights.",
  },
  {
    id: "cassava",
    name: "Cassava",
    emoji: "🥯",
    season: "Year-round",
    months: "Plant Sep – Nov",
    bestSeasons: ["Umuhindo", "Itumba"],
    waterNeed: "Low",
    notes: "Drought-tolerant. Harvest after 9–12 months. Great for dry districts.",
  },
  {
    id: "banana",
    name: "Banana",
    emoji: "🍌",
    season: "Year-round",
    months: "Plant in rains",
    bestSeasons: ["Itumba", "Umuhindo"],
    waterNeed: "High",
    notes: "Permanent crop. Mulch heavily to retain moisture during dry season.",
  },
  {
    id: "coffee",
    name: "Coffee",
    emoji: "☕",
    season: "Perennial",
    months: "Harvest Mar – Jul",
    bestSeasons: ["Itumba"],
    waterNeed: "Medium",
    notes: "Cash crop. Mid-altitude (1,400–2,000m). Prune after harvest.",
  },
  {
    id: "tea",
    name: "Tea",
    emoji: "🍃",
    season: "Perennial",
    months: "Year-round plucking",
    bestSeasons: ["Itumba", "Umuhindo"],
    waterNeed: "High",
    notes: "Highland cash crop (Nyamagabe, Nyaruguru, Karongi). Needs 1,500mm rain.",
  },
  {
    id: "sorghum",
    name: "Sorghum",
    emoji: "🌾",
    season: "Season A & B",
    months: "Sep – Feb",
    bestSeasons: ["Umuhindo"],
    waterNeed: "Low",
    notes: "Drought-resistant. Ideal for Eastern Province (Bugesera, Nyagatare).",
  },
  {
    id: "soybean",
    name: "Soybean",
    emoji: "🫛",
    season: "Season A & B",
    months: "Mar – Jul",
    bestSeasons: ["Itumba"],
    waterNeed: "Medium",
    notes: "Improves soil. Inoculate seeds with rhizobium for best yield.",
  },
  {
    id: "wheat",
    name: "Wheat",
    emoji: "🌾",
    season: "Season B",
    months: "Feb – Jul",
    bestSeasons: ["Itumba"],
    waterNeed: "Medium",
    notes: "Highland crop (above 1,800m). Grown in Musanze, Nyabihu, Burera.",
  },
  {
    id: "tomato",
    name: "Tomato",
    emoji: "🍅",
    season: "Season A & B",
    months: "Year-round (irrigated)",
    bestSeasons: ["Umuhindo", "Itumba", "Urugaryi"],
    waterNeed: "High",
    notes: "High-value vegetable. Stake plants and mulch to prevent disease.",
  },
];

export const POPULAR_CROPS = ["maize", "beans", "rice", "irish-potato", "cassava", "banana"];

export interface IrrigationAdvice {
  level: "Low" | "Moderate" | "High" | "Critical";
  message: string;
  liters: string;
}

export function suggestIrrigation(
  rainMm: number,
  tempMaxC: number,
  waterNeed: Crop["waterNeed"],
): IrrigationAdvice {
  const need = waterNeed === "High" ? 30 : waterNeed === "Medium" ? 20 : 10;
  const evap = Math.max(0, (tempMaxC - 22) * 1.5);
  const deficit = need + evap - rainMm;

  if (deficit <= 0)
    return {
      level: "Low",
      message: "Recent rainfall is sufficient. No irrigation needed today.",
      liters: "0 L/m²",
    };
  if (deficit < 8)
    return {
      level: "Moderate",
      message: "Light irrigation recommended in the early morning or evening.",
      liters: `${deficit.toFixed(1)} L/m²`,
    };
  if (deficit < 18)
    return {
      level: "High",
      message: "Soil moisture is low. Irrigate today and mulch to retain water.",
      liters: `${deficit.toFixed(1)} L/m²`,
    };
  return {
    level: "Critical",
    message: "Drought stress likely. Irrigate immediately and consider shade nets.",
    liters: `${deficit.toFixed(1)} L/m²`,
  };
}

export function recommendCropsFor(districtName: string, season: RwandaSeason): Crop[] {
  const district = RWANDA_DISTRICTS.find((d) => d.name === districtName);
  const province = district?.province ?? "";

  return CROPS.filter((c) => c.bestSeasons.includes(season))
    .map((c) => {
      let score = 1;
      // Province-aware boosts
      if (province === "Northern" && ["irish-potato", "wheat", "tea"].includes(c.id)) score += 2;
      if (province === "Eastern" && ["sorghum", "cassava", "maize", "beans"].includes(c.id))
        score += 2;
      if (province === "Western" && ["tea", "coffee", "banana"].includes(c.id)) score += 2;
      if (province === "Southern" && ["coffee", "rice", "cassava"].includes(c.id)) score += 2;
      if (province === "Kigali" && ["tomato", "beans", "maize"].includes(c.id)) score += 1;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((x) => x.c);
}

export const FARMING_TIPS = [
  {
    title: "Rotate crops yearly",
    body: "Alternate maize, beans and a root crop to break pest cycles and restore nitrogen.",
    icon: "🔄",
  },
  {
    title: "Mulch to keep moisture",
    body: "Cover soil with grass or banana leaves — reduces evaporation by up to 70%.",
    icon: "🍂",
  },
  {
    title: "Test your soil pH",
    body: "Most Rwandan soils are acidic. Apply agricultural lime where pH is below 5.5.",
    icon: "🧪",
  },
  {
    title: "Use certified seeds",
    body: "Buy from RAB-approved suppliers — yields can double compared to recycled seed.",
    icon: "🌱",
  },
  {
    title: "Plant on contour lines",
    body: "On slopes, plant across the hill to prevent erosion and capture rainwater.",
    icon: "⛰️",
  },
  {
    title: "Time planting with rains",
    body: "Wait for the first 30–40mm of rain before sowing — avoids seed loss to dry spells.",
    icon: "🌧️",
  },
];
