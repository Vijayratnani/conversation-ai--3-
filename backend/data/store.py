from models.drill_down import DrillDownDetails, RootCause, HistoricalPerformance, KeyMetric

DRILL_DOWN_DATA = {
    "refinancing": DrillDownDetails(
        rootCauses=[
            RootCause(
                cause="Fluctuating Market Interest Rates & Media Speculation",
                impact="Increased customer inquiries about potential benefits and timing of refinancing, driven by economic news.",
                dataPoint="Refinancing inquiry calls up 30% following central bank announcements.",
                severity="High"
            ),
            RootCause(
                cause="Complex Refinancing Process & Documentation Requirements",
                impact="Customers seeking clarification on eligibility, required paperwork (e.g., appraisals, income verification), and timelines. High effort perceived.",
                dataPoint="Avg. call length for refinancing queries: 12 mins (vs. 7 mins for other mortgage calls).",
                severity="Medium"
            ),
            RootCause(
                cause="Lack of Proactive Communication During Underwriting for Refinance",
                impact="Customers feeling uninformed about status, leading to repeat calls and anxiety.",
                severity="Medium"
            ),
            RootCause(
                cause="Agent Unfamiliarity with Niche Refinancing Products (e.g., Cash-out Refi)",
                impact="Incorrect or incomplete information provided, leading to follow-up calls or specialist escalations.",
                dataPoint="10% of refinancing calls escalated for specialist advice.",
                severity="Low"
            )
        ],
        historicalPerformance=[
            HistoricalPerformance(period="Current Month (to date)", value="22%"),
            HistoricalPerformance(period="Last Month", value="20%", change="+2pp"),
            HistoricalPerformance(period="Refinance Application Volume", value="+18% MoM"),
            HistoricalPerformance(period="Refinance Inquiry Call Volume", value="+25% MoM")
        ],
        keyMetrics=[
            KeyMetric(
                metric="Refinance Application Conversion Rate (Inquiry to App)",
                value="40%",
                benchmark="Target: 55%",
                status="warning"
            ),
            KeyMetric(
                metric="Time to Close (Refinance)",
                value="48 days",
                benchmark="Target: 35 days",
                status="critical"
            ),
            KeyMetric(
                metric="Customer Effort Score (Refinancing Process)",
                value="3.2/5 (High Effort)",
                benchmark="Target: >4/5 (Low Effort)",
                status="warning"
            ),
            KeyMetric(
                metric="Pull-Through Rate (Refi Approved to Closed)",
                value="75%",
                benchmark="Target: 85%",
                status="warning"
            )
        ],
        recommendedActions=[
            "Provide proactive communication (e.g., email, website banners) on market rate changes and their potential impact on refinancing decisions.",
            "Develop a simplified online refinancing eligibility checker and a clear, step-by-step guide with document checklists.",
            "Implement automated status updates for refinance applicants at key milestones (application received, underwriting, appraisal, approval).",
            "Conduct targeted training for agents on various refinancing products, including scenario-based role-playing.",
            "Offer personalized refinancing consultations with mortgage specialists, potentially via video call."
        ]
    )
}
