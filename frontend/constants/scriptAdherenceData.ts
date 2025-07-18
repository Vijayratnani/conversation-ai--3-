// constants/scriptAdherenceData.ts

import { ScriptAdherenceItem } from "@/types/dashboardTypes"

export  const scriptAdherenceData: ScriptAdherenceItem[] = [
    {
      id: "credit-cards-adherence",
      product: "Credit Cards",
      adherenceScore: 92,
      trend: { direction: "up", change: "+2% MoM", color: "text-green-500" },
      topMissedArea: "Benefits explanation for premium cards",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Explaining travel insurance coverage details",
            frequency: "15% of calls",
            impact: "Customer confusion, potential dissatisfaction if benefits misunderstood.",
            examples: [
              "Agent A: 'It has travel insurance.' (Too vague)",
              "Agent B: 'I think it covers lost luggage.' (Uncertain)",
            ],
          },
          {
            point: "Mentioning specific bonus point categories",
            frequency: "10% of calls",
            impact: "Missed opportunity to highlight value, customer may not maximize rewards.",
          },
          {
            point: "Required compliance disclosure (Reg Z)",
            frequency: "3% of calls",
            impact: "Compliance risk, potential fines.",
            examples: ["Forgot to state APR range clearly."],
          },
        ],
        keyStrengths: [
          { point: "Greeting and call opening", examples: ["Consistently polite and professional openings observed."] },
          { point: "Security verification process", examples: ["Agents follow protocol accurately."] },
        ],
        commonAgentFeedback: [
          "Script for premium benefits is too long.",
          "Unsure how to handle questions about competitor card benefits.",
        ],
        impactOfNonAdherence: [
          { area: "Customer Understanding", description: "Reduced clarity on product value.", severity: "Medium" },
          { area: "Compliance", description: "Minor risk of non-compliance on specific disclosures.", severity: "Low" },
          {
            area: "Sales Opportunity",
            description: "Potential missed cross-sell/upsell if benefits not clear.",
            severity: "Medium",
          },
        ],
        recommendedScriptUpdates: [
          "Create concise bullet points for premium card benefits.",
          "Add a section on how to politely redirect competitor comparisons.",
        ],
        trainingFocusAreas: [
          "Role-playing benefit explanations for premium cards.",
          "Refresher on Reg Z disclosure requirements.",
        ],
      },
    },
    {
      id: "personal-loans-adherence",
      product: "Personal Loans",
      adherenceScore: 88,
      trend: { direction: "stable", change: "0% MoM", color: "text-amber-500" },
      topMissedArea: "Terms & conditions, specifically prepayment penalties",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Explaining prepayment penalty clause",
            frequency: "18% of calls",
            impact: "Customer dissatisfaction if penalized unexpectedly.",
            examples: ["Agent C: 'You can pay it off early, no problem.' (Incorrect/Incomplete)"],
          },
          {
            point: "Clearly stating all applicable fees (origination, late)",
            frequency: "12% of calls",
            impact: "Lack of transparency, potential complaints.",
          },
        ],
        keyStrengths: [
          { point: "Explaining loan application process steps." },
          { point: "Empathy and active listening during eligibility discussions." },
        ],
        impactOfNonAdherence: [
          { area: "Customer Trust", description: "Erosion of trust if key terms are omitted.", severity: "High" },
          {
            area: "Complaints",
            description: "Increased likelihood of formal complaints regarding fees/penalties.",
            severity: "Medium",
          },
        ],
        recommendedScriptUpdates: [
          "Add a mandatory checklist item for prepayment penalty disclosure.",
          "Use a fee summary table in the script for easy reference.",
        ],
        trainingFocusAreas: ["Understanding and explaining loan T&Cs.", "Handling objections related to fees."],
      },
    },
    {
      id: "savings-accounts-adherence",
      product: "Savings Accounts",
      adherenceScore: 95,
      trend: { direction: "up", change: "+1% MoM", color: "text-green-500" },
      topMissedArea: "None significant; high overall adherence",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Proactively mentioning online banking features",
            frequency: "5% of calls",
            impact: "Minor missed opportunity to reinforce convenience.",
          },
        ],
        keyStrengths: [
          { point: "Clear explanation of account types and minimum balances." },
          { point: "Accurate information on current interest rates." },
        ],
        commonAgentFeedback: ["Script is straightforward and easy to follow."],
        impactOfNonAdherence: [
          {
            area: "Customer Engagement",
            description: "Slightly lower engagement with digital tools if not highlighted.",
            severity: "Low",
          },
        ],
        recommendedScriptUpdates: ["Consider adding a soft prompt for online banking feature awareness."],
        trainingFocusAreas: ["Maintaining high standards, sharing best practices from top performers."],
      },
    },
    {
      id: "mortgages-adherence",
      product: "Mortgages",
      adherenceScore: 79,
      trend: { direction: "down", change: "-3% MoM", color: "text-red-500" },
      topMissedArea: "Rate comparison details and closing cost estimation",
      drillDownDetails: {
        keyMissedPoints: [
          {
            point: "Providing accurate range for closing costs",
            frequency: "25% of calls",
            impact: "Customer surprise at actual costs, potential for deal to fall through.",
            examples: ["Agent D: 'Closing costs are usually a few thousand.' (Too vague)"],
          },
          {
            point: "Explaining difference between APR and interest rate",
            frequency: "20% of calls",
            impact: "Customer confusion, difficulty comparing offers.",
          },
          {
            point: "Required RESPA disclosures",
            frequency: "8% of calls",
            impact: "Significant compliance risk.",
          },
        ],
        keyStrengths: [
          { point: "Building rapport with potential borrowers." },
          { point: "Gathering initial application information effectively." },
        ],
        impactOfNonAdherence: [
          { area: "Compliance", description: "High risk of RESPA violations.", severity: "High" },
          {
            area: "Customer Experience",
            description: "Negative experience due to unexpected costs or confusion.",
            severity: "High",
          },
          { area: "Conversion Rate", description: "Lower conversion from application to closing.", severity: "Medium" },
        ],
        recommendedScriptUpdates: [
          "Integrate a closing cost estimation tool/range directly into the script.",
          "Provide clear, simple language for explaining APR vs. interest rate.",
          "Add mandatory verbal confirmation for RESPA disclosures.",
        ],
        trainingFocusAreas: [
          "Mortgage compliance (RESPA).",
          "Explaining complex financial terms simply.",
          "Managing customer expectations on costs.",
        ],
      },
    },
  ]