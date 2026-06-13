export interface HealthData {
  datetime: string;
  timestamp: number;
  systolic: number;
  diastolic: number;
  heart_rate: number;
  period: "Morning" | "Afternoon" | "Night" | "Average";
}

export function aggregateData(data: HealthData[], bucketMs: number): HealthData[] {
  // Force a fresh array reference to bypass Recharts cache corruption on scale domains
  if (bucketMs === 0) return [...data];

  const buckets = new Map<number, HealthData[]>();
  
  data.forEach((d) => {
    const bucketUnix = Math.floor(d.timestamp / bucketMs) * bucketMs;
    if (!buckets.has(bucketUnix)) buckets.set(bucketUnix, []);
    buckets.get(bucketUnix)!.push(d);
  });

  const sortedBuckets = Array.from(buckets.keys()).sort();
  return sortedBuckets.map((bucketUnix) => {
    const items = buckets.get(bucketUnix)!;
    const avgSys = Math.round(items.reduce((sum, d) => sum + d.systolic, 0) / items.length);
    const avgDia = Math.round(items.reduce((sum, d) => sum + d.diastolic, 0) / items.length);
    const avgHr = Math.round(items.reduce((sum, d) => sum + d.heart_rate, 0) / items.length);
    
    return {
       datetime: new Date(bucketUnix).toISOString(),
       timestamp: bucketUnix,
       systolic: avgSys,
       diastolic: avgDia,
       heart_rate: avgHr,
       period: "Average", 
    } as HealthData;
  });
}

export function formatUTC(timestamp: number, formatStr: string): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // 0-11
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const minStr = minutes.toString().padStart(2, "0");

  switch (formatStr) {
    case "MMM d, yyyy":
      return `${monthsShort[month]} ${day}, ${year}`;
    case "h:mm a":
      return `${hours12}:${minStr} ${ampm}`;
    case "MMM d, yyyy - h:mm a":
      return `${monthsShort[month]} ${day}, ${year} - ${hours12}:${minStr} ${ampm}`;
    case "MMM d":
      return `${monthsShort[month]} ${day}`;
    case "MMM yyyy":
      return `${monthsShort[month]} ${year}`;
    default:
      return date.toISOString();
  }
}

