import dataJson from "./dashboard.json";
import type { DashboardData } from "@/lib/types";

export interface DashboardRepository {
  getSnapshot(): Promise<DashboardData>;
}

export class StaticDashboardRepository implements DashboardRepository {
  async getSnapshot(): Promise<DashboardData> {
    return dataJson as DashboardData;
  }
}

export const dashboardRepository: DashboardRepository =
  new StaticDashboardRepository();
