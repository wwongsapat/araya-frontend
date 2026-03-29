import { fetchHealthData } from "@/components/DataProvider";
import Dashboard from "@/components/Dashboard";

export default async function Home() {
  const healthData = await fetchHealthData();

  return (
    <main className="min-h-screen">
      <Dashboard initialData={healthData} />
    </main>
  );
}
