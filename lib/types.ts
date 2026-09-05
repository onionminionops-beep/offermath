export interface OfferInput {
  baseSalary: number;
  bonus: number;
  equityShares?: number;
  equityPercent?: number;
  strikePrice?: number;
  fmv?: number;
  vestingYears: number;
}

export interface OfferAnalysis {
  totalCash: number;
  annualCash: number;
  equityValue: number;
  equityValuePerYear: number;
  totalComp: number;
  totalCompPerYear: number;
  summary: string;
  questions: string[];
  emailTemplate: string;
}
