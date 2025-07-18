// data/productKnowledgeData.ts
import { ProductKnowledgeItem } from "@/types/dashboardTypes" // Adjust path if needed

export const productKnowledgeLevels: ProductKnowledgeItem[] = [
  {
    product: "Credit Cards",
    score: 87,
    issues: "Minor hesitation on premium features",
    color: "bg-green-500",
    specificExamples: [
      "Agent paused when asked about annual fee waivers for XYZ card.",
      "Uncertainty regarding bonus point calculation for international spending.",
    ],
    recommendedTraining: [
      { title: "Premium Credit Card Features (Refresher)", link: "#" },
      { title: "Handling Complex Fee Enquiries", link: "#" },
    ],
    scoreTrend: { period: "last month", change: "+3%", direction: "up" },
    actionableSteps: [
      "Review product sheet for XYZ card.",
      "Shadow a senior agent handling premium card queries.",
    ],
  },
  {
    product: "Personal Loans",
    score: 72,
    issues: "Incomplete information on eligibility criteria",
    color: "bg-amber-500",
    specificExamples: [
      "Could not clearly state the minimum income requirement.",
      "Unsure about documentation for self-employed applicants.",
    ],
    recommendedTraining: [
      { title: "Personal Loan Eligibility Masterclass", link: "#" },
      { title: "Documentation Standards for Loans", link: "#" },
    ],
    scoreTrend: { period: "last month", change: "-2%", direction: "down" },
    actionableSteps: [
      "Study the latest eligibility matrix.",
      "Role-play scenarios involving different applicant profiles.",
    ],
  },
  {
    product: "Investment Products",
    score: 64,
    issues: "Significant knowledge gaps on returns calculation",
    color: "bg-red-500",
    specificExamples: [
      "Unable to explain how compound interest is calculated for product A.",
      "Confused risk disclaimers with return guarantees.",
    ],
    recommendedTraining: [
      { title: "Understanding Investment Returns & Risks", link: "#" },
      { title: "Compliance in Investment Advisory", link: "#" },
    ],
    scoreTrend: { period: "last month", change: "+1%", direction: "up" },
    actionableSteps: [
      "Complete the mandatory 'Investment Basics' e-learning.",
      "Seek clarification from the investments specialist team on return calculations.",
    ],
  },
]
