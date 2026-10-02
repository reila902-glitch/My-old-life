export interface PensionAssets {
  nationalPensionEstimatedMonthly: number; // in 10,000 KRW (e.g., 120 = 1,200,000 won)
  retirementPensionTotal: number; // in 10,000 KRW (e.g., 15000 = 1.5억 won)
  personalPensionMonthly: number; // in 10,000 KRW (e.g., 50 = 500,000 won)
}

export interface AssetsInput {
  housing: number; // in 10,000 KRW (e.g. 50000 = 5억 won)
  housingType: 'own' | 'jeonse' | 'monthly' | 'other';
  housingPensionEligible: boolean;
  savings: number; // in 10,000 KRW
  insurance: string; // text description
  insuranceMonthlyRefund: number; // in 10,000 KRW (if any)
  pensions: PensionAssets;
  stocks: number; // in 10,000 KRW
  others: number; // in 10,000 KRW
  debts: number; // in 10,000 KRW
}

export interface HealthInput {
  physicalConcerns: string;
  physicalTags: string[];
  psychologicalConcerns: string;
  psychologicalTags: string[];
  bucketList: string;
  bucketListTags: string[];
}

export interface SeniorConsultationInput {
  currentAge: number;
  retirementAge: number;
  desiredMonthlyExpense: number; // in 10,000 KRW (e.g., 280 = 2,800,000 won)
  assets: AssetsInput;
  health: HealthInput;
}

export interface FiveYearInterval {
  startAge: number;
  endAge: number;
  stageName: string;
  stageSub: string;
  monthlyLivingCost: number; // in 10,000 KRW
  primaryIncomeSource: string;
  keyAction: string;
  healthFocus: string;
  isCrevasse: boolean;
}

export interface ConsultationResult {
  markdownLetter: string;
  createdAt: string;
  input: SeniorConsultationInput;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'senior';
  text: string;
  timestamp: string;
}
