import { OfferInput, OfferAnalysis } from "./types";

export function calculateOffer(input: OfferInput): OfferAnalysis {
  const totalCash = input.baseSalary + input.bonus;
  const annualCash = totalCash;

  let equityValue = 0;
  if (input.equityShares && input.fmv && input.strikePrice !== undefined) {
    equityValue = input.equityShares * (input.fmv - input.strikePrice);
  } else if (input.equityShares && input.fmv) {
    equityValue = input.equityShares * input.fmv;
  } else if (input.equityPercent && input.fmv) {
    equityValue = input.fmv * (input.equityPercent / 100);
  }

  const equityValuePerYear = input.vestingYears > 0 ? equityValue / input.vestingYears : 0;
  const totalCompPerYear = annualCash + equityValuePerYear;
  const totalComp = totalCash + equityValue;

  const summary = generateSummary(input, {
    totalCash,
    annualCash,
    equityValue,
    equityValuePerYear,
    totalComp,
    totalCompPerYear,
    summary: "",
    questions: [],
    emailTemplate: "",
  });

  const questions = generateQuestions(input);
  const emailTemplate = generateEmailTemplate(input, totalCompPerYear);

  return {
    totalCash,
    annualCash,
    equityValue,
    equityValuePerYear,
    totalComp,
    totalCompPerYear,
    summary,
    questions,
    emailTemplate,
  };
}

function generateSummary(input: OfferInput, analysis: Partial<OfferAnalysis>): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  let summary = `## Your Total Compensation Breakdown\n\n`;
  summary += `**Annual Cash:** ${formatter.format(analysis.annualCash || 0)}\n`;
  summary += `- Base Salary: ${formatter.format(input.baseSalary)}\n`;
  if (input.bonus > 0) {
    summary += `- Bonus: ${formatter.format(input.bonus)}\n`;
  }
  summary += `\n`;

  if (analysis.equityValue && analysis.equityValue > 0) {
    summary += `**Equity Package:** ${formatter.format(analysis.equityValue)}\n`;
    if (input.vestingYears > 0) {
      summary += `- Vesting over ${input.vestingYears} years\n`;
      summary += `- Annual equity value: ${formatter.format(analysis.equityValuePerYear || 0)}\n`;
    }
    summary += `\n`;
  }

  summary += `**Total Annual Compensation:** ${formatter.format(analysis.totalCompPerYear || 0)}\n`;
  summary += `**Total Package Value (${input.vestingYears} years):** ${formatter.format(analysis.totalComp || 0)}\n`;

  return summary;
}

function generateQuestions(input: OfferInput): string[] {
  const questions = [
    "What is the current 409A valuation and when was it last updated?",
    "What was the valuation at the last funding round?",
    "How many outstanding shares exist (fully diluted)?",
    "What is the vesting schedule? (Standard is 4 years with 1-year cliff)",
    "Is there an early exercise option?",
    "What happens to unvested equity if I leave?",
    "Are there any acceleration clauses (single or double trigger)?",
  ];

  if (input.bonus > 0) {
    questions.push("Is the bonus guaranteed or performance-based?");
    questions.push("When and how is bonus eligibility determined?");
  }

  questions.push("What are the health insurance and benefits details?");
  questions.push("Is there a 401(k) match or other retirement benefits?");
  questions.push("What is the remote work / office policy?");

  return questions;
}

function generateEmailTemplate(input: OfferInput, totalCompPerYear: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return `Subject: Questions about my offer

Hi [Recruiter Name],

Thank you for the offer! I'm very excited about the opportunity. I've been reviewing the compensation package and have a few questions to help me make an informed decision:

1. Can you provide the current 409A valuation and the last funding round valuation?
2. What is the total number of outstanding shares (fully diluted)?
3. Could you clarify the exact vesting schedule and any acceleration clauses?
${input.bonus > 0 ? "4. Can you provide more details on how the bonus is structured and paid out?\n" : ""}

Based on my analysis, the total annual compensation would be approximately ${formatter.format(totalCompPerYear)}. I want to make sure I'm understanding the equity component correctly.

I'm hoping to finalize my decision by [DATE]. Would you be available for a quick call this week?

Thank you!
[Your Name]`;
}
