import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { HealthData } from "./utils";

export async function fetchHealthData(): Promise<HealthData[]> {
  const filePath = path.join(process.cwd(), "app", "data", "arma_bp_records.csv");
  const fileContent = fs.readFileSync(filePath, "utf8");

  const results = Papa.parse(fileContent, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
  });

  const parsedData = results.data as Array<{
    datetime: string;
    systolic: number;
    diastolic: number;
    heart_rate: number;
    period: "Morning" | "Afternoon" | "Night";
  }>;

  // Add a valid unix timestamp to make charting time-based much easier
  return parsedData.map((d) => {
    // Replace space with 'T' to ensure strict ISO 8601 parsing cross-platform
    const safeDateStr = d.datetime ? d.datetime.replace(" ", "T") : "";
    return {
      ...d,
      timestamp: new Date(safeDateStr).getTime(),
    };
  }).filter((d) => !isNaN(d.timestamp)).sort((a, b) => a.timestamp - b.timestamp);
}
