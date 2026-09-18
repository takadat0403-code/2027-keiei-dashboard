import { dashboardRepository } from "@/data/repository";
import { DxDashboard } from "@/features/dx/DxDashboard";

export default async function DxPage() {
  const data = await dashboardRepository.getSnapshot();
  return <DxDashboard data={data} />;
}
