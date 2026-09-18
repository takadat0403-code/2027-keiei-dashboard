import { dashboardRepository } from "@/data/repository";
import { RevenueDashboard } from "@/features/revenue/RevenueDashboard";

export default async function RevenuePage() {
  const data = await dashboardRepository.getSnapshot();
  return <RevenueDashboard data={data} />;
}
