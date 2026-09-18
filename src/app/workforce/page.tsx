import { dashboardRepository } from "@/data/repository";
import { WorkforceDashboard } from "@/features/workforce/WorkforceDashboard";

export default async function WorkforcePage() {
  const data = await dashboardRepository.getSnapshot();
  return <WorkforceDashboard data={data} />;
}
