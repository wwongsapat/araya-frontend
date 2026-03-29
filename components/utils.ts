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
