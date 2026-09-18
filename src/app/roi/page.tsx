import { dashboardRepository } from "@/data/repository";
import { RoiDashboard } from "@/features/roi/RoiDashboard";

export default async function RoiPage() {
  const data = await dashboardRepository.getSnapshot();
  return <RoiDashboard data={data} />;
}
