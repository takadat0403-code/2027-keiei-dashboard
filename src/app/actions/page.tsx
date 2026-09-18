import { dashboardRepository } from "@/data/repository";
import { ActionsDashboard } from "@/features/actions/ActionsDashboard";

export default async function ActionsPage() {
  const data = await dashboardRepository.getSnapshot();
  return <ActionsDashboard data={data} />;
}
