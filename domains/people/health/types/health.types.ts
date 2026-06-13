export interface HealthData {
  datetime: string;
  timestamp: number;
  systolic: number;
  diastolic: number;
  heart_rate: number;
  period: "Morning" | "Afternoon" | "Night" | "Average";
}
