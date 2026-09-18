export type NullableNumber = number | null;

export interface DashboardMeta {
  title: string;
  asOfDate: string;
  targetYear: number;
  sourceWorkbook: string;
  sourceUpdatedAt: string;
}

export interface BookingThresholds {
  discountBelow: number;
  standardBelow: number;
  premiumFrom: number;
}

export interface MasterData {
  bookingThresholds: BookingThresholds;
  currentGolfTax: number;
  plannedGolfTaxCap: number;
  annualFeeIncrease: number;
  memberPlayFeeIncrease: number;
  plannedRobotMowers: number;
  bunkerReductionTarget: number;
}

export interface PricePosition {
  facility: string;
  course: string;
  style: string;
  weekdayPrice: NullableNumber;
  weekendPrice: NullableNumber;
  positioning: string;
  note: string | null;
}

export interface RevenueRow {
  id: number;
  year: number;
  month: number;
  facility: string;
  course: string;
  style: string;
  dayType: string;
  timeBand: string;
  basePrice: NullableNumber;
  plannedPrice: NullableNumber;
  actualAvgPrice: NullableNumber;
  capacitySlots: NullableNumber;
  bookedSlots: NullableNumber;
  bookingRate: NullableNumber;
  plannedPlayers: NullableNumber;
  actualPlayers: NullableNumber;
  plannedRevenue: NullableNumber;
  actualRevenue: NullableNumber;
  priceStage: string;
  note: string | null;
}

export interface CourseQualityRow {
  date: string | null;
  facility: string | null;
  course: string | null;
  green: string | null;
  turfDensity: NullableNumber;
  rootLengthMm: NullableNumber;
  thatchMm: NullableNumber;
  rootZoneMoisturePct: NullableNumber;
  permeabilityMmH: NullableNumber;
  soilHardness: NullableNumber;
  soilTempC: NullableNumber;
  surfaceTempC: NullableNumber;
  irrigationUniformityPct: NullableNumber;
  diseaseScore: NullableNumber;
  wateringHours: NullableNumber;
  chemFertilizerCost: NullableNumber;
  renovationHours: NullableNumber;
  weaknessFlag: string | null;
  owner: string | null;
  note: string | null;
  measurementSource: string | null;
}

export interface WorkforceRow {
  date: string | null;
  facility: string | null;
  department: string | null;
  plannedHeadcount: NullableNumber;
  actualHeadcount: NullableNumber;
  headcountVariance: NullableNumber;
  laborHours: NullableNumber;
  overtimeHours: NullableNumber;
  paidLeavePeople: NullableNumber;
  clockCorrections: NullableNumber;
  throughput: NullableNumber;
  productivity: NullableNumber;
  laborCost: NullableNumber;
  owner: string | null;
  note: string | null;
  source: string | null;
}

export interface DxInitiative {
  id: number;
  category: string;
  initiative: string;
  purpose: string;
  owner: string;
  startDate: string | null;
  dueDate: string | null;
  priority: string;
  status: string;
  progress: number;
  kpi: string;
  actualState: string | null;
  nextAction: string;
  risk: string;
  note: string | null;
}

export interface Investment {
  id: number;
  facility: string;
  category: string;
  project: string;
  purpose: string;
  estimatedCost: NullableNumber;
  subsidy: NullableNumber;
  netCost: NullableNumber;
  savedHours: NullableNumber;
  hourlyCost: NullableNumber;
  laborSavings: NullableNumber;
  otherAnnualBenefit: NullableNumber;
  annualBenefit: NullableNumber;
  paybackYears: NullableNumber;
  qualityImpact: number;
  bcpImpact: number;
  priority: string;
  note: string | null;
}

export interface ActionItem {
  id: number;
  area: string;
  action: string;
  owner: string;
  dueDate: string | null;
  priority: string;
  status: string;
  progress: number;
  timing: string | null;
  deliverableKpi: string;
  dependencies: string | null;
  nextAction: string;
  updatedAt: string | null;
  note: string | null;
  source: string;
}

export interface KpiDefinition {
  id: number;
  level: string;
  area: string;
  metric: string;
  definition: string;
  target: NullableNumber;
  actual: NullableNumber;
  unit: string;
  direction: string;
  status: string;
  frequency: string;
  source: string;
}

export interface DashboardData {
  meta: DashboardMeta;
  master: MasterData;
  prices: PricePosition[];
  revenue: RevenueRow[];
  courseQuality: CourseQualityRow[];
  workforce: WorkforceRow[];
  dx: DxInitiative[];
  investments: Investment[];
  actions: ActionItem[];
  kpis: KpiDefinition[];
}

export interface OverviewMetrics {
  revenueAchievement: number | null;
  weightedBookingRate: number | null;
  actualAvgPrice: number | null;
  weakGreenCount: number | null;
  overtimeHours: number | null;
  dxProgress: number | null;
  overdueActions: number;
  actionCompletionRate: number | null;
}
