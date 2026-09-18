import { dashboardRepository } from "@/data/repository";
import { CourseQualityDashboard } from "@/features/course-quality/CourseQualityDashboard";

export default async function CourseQualityPage() {
  const data = await dashboardRepository.getSnapshot();
  return <CourseQualityDashboard data={data} />;
}
