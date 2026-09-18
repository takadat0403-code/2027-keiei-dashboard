import { dashboardRepository } from "@/data/repository";
import { OverviewDashboard } from "@/features/overview/OverviewDashboard";

export default async function HomePage() {
  const data = await dashboardRepository.getSnapshot();
  return <OverviewDashboard data={data} />;
}
