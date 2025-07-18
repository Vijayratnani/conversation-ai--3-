from models.product_stats import ProductStatItem, Trend, DrillDownDetails, RootCause, PerformanceItem, KeyMetric

product_stats_data: list[ProductStatItem] = [
    ProductStatItem(
        id="credit-cards",
        title="Credit Cards",
        value="42%",
        trend=Trend(  # ✅ Use model constructor
            direction="up",
            change="+8% from last month",
            color="text-red-500"
        ),
        topIssue="Transaction disputes",
        iconName="FileText",
        iconContainerClass="bg-red-100",
        iconClass="text-red-500",
        headerClass="bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10",
        drillDownDetails=DrillDownDetails(  # ✅ Also use model constructor
            rootCauses=[
                RootCause(
                    cause="Increased Sophisticated Phishing Scams",
                    impact="Higher volume of unauthorized transaction reports...",
                    dataPoint="15% increase in reported CNP fraud MoM...",
                    severity="High"
                ),
                RootCause(
            cause= "System Integration Glitch with Payment Gateway X (Resolved)",
            impact=
              "Led to a spike in duplicate charge reports for transactions processed between 10th-12th last month. Primarily affected online retail transactions.",
            dataPoint= "3 major incidents, 1500+ customers affected. System patched on 13th.",
            severity= "Medium",
                ),
          RootCause(
            cause= "Confusing Merchant Return/Refund Policies",
            impact=
              "Customers disputing charges after unsuccessful or lengthy return processes with specific online retailers (e.g., 'FashionFast', 'GadgetHub').",
            dataPoint= "Disputes related to merchant policies up 5% QoQ.",
            severity= "Low",
          ),
          RootCause(
            cause= "First-Time User Errors with Contactless Payments",
            impact=
              "Minor disputes arising from misunderstanding contactless limits or accidental taps, especially among newly issued cards.",
            dataPoint= "Observed in 5% of new cardholder disputes.",
            severity= "Low",
          ),],
                # ...add more RootCause instances
            historicalPerformance=[
                PerformanceItem(period="Current Month (to date)", value="42%"),
                PerformanceItem(period="Last Month", value="34%", change="+8pp"),
                PerformanceItem( period= "Two Months Ago", value= "30%", change= "+4pp" ),
                PerformanceItem( period= "Three Months Ago", value= "28%", change= "+2pp" ),
                PerformanceItem( period= "Year Ago (Same Month)", value= "25%", change= "+17pp YoY" ),
                # ...add more PerformanceItem instances
            ],
            keyMetrics=[
                KeyMetric(
                    metric="Dispute Resolution Time (Avg)",
                    value="5.2 days",
                    benchmark="Industry Avg: 4.5 days",
                    status="warning"
                ),
                KeyMetric(
            metric= "Successful Dispute Rate (for customer)",
            value= "78%",
            benchmark= "Target: 85%",
            status= "critical",
                ),
            KeyMetric( metric= "Chargeback Rate", value= "0.85%", benchmark= "Industry Target: <0.5%", status= "critical" ),
            KeyMetric( metric= "Fraud Loss per Active Account", value= "$2.15", benchmark= "Target: <$1.50", status= "warning" ),
            KeyMetric(
            metric= "Customer Satisfaction (Post-Dispute)",
            value= "3.5/5",
            benchmark= "Target: 4.2/5",
            status= "warning",
          ),
                # ...add more KeyMetric instances
            ],
            recommendedActions=[
                "Implement real-time transaction monitoring...",
                "Conduct a full post-mortem on Payment Gateway X...",
                "Develop a standardized merchant dispute resolution guide for agents and FAQs for customers regarding policies of high-volume merchants.",
                "Enhance onboarding materials for new cardholders with clearer instructions on contactless payment usage and limits.",
                "Launch a targeted agent training program on handling complex dispute scenarios and de-escalation techniques."
                # ...
            ]
        )
    ),
        ProductStatItem(
        id= "personal-loans",
      title= "Personal Loans",
      value= "35%",
      trend=Trend(  # ✅ Use model constructor
            direction= "up", change= "+5% from last month", color= "text-red-500" ),
      topIssue= "Application delays",
      iconName= "Package",
      iconContainerClass= "bg-amber-100",
      iconClass= "text-amber-500",
      headerClass= "bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10",
      drillDownDetails=DrillDownDetails(  # ✅ Also use model constructor
            rootCauses=[
                RootCause(
            cause= "Manual Document Verification Bottleneck for Self-Employed Applicants",
            impact=
              "Significant delays in processing applications requiring non-standard income proof (e.g., bank statements, tax returns for gig workers).",
            dataPoint= "Avg. 3 additional days for verification for self-employed vs. salaried.",
            severity= "High"
    ),
          RootCause(
            cause= "Understaffing in Underwriting Team During Peak Season",
            impact=
              "Queue of applications awaiting review exceeding 48-hour SLA. Increased agent overtime and potential for errors.",
            dataPoint= "Current backlog: 75 applications > 48hrs.",
            severity= "Medium"
    ),
          RootCause(
            cause= "Incomplete Applicant Submissions (Address Proof & Income Details)",
            impact=
              "High rate of back-and-forth communication causing delays and customer frustration. Common issues: outdated address proof, unclear income statements.",
            dataPoint= "22% of applications require follow-up for missing/unclear documents.",
            severity= "Medium"
    ),
          RootCause(
            cause= "System Latency in Credit Bureau Report Retrieval",
            impact= "Intermittent delays (up to 30 mins) in fetching credit reports, pausing application processing.",
            dataPoint= "Reported 5 times in the last week.",
            severity= "Low"
    )],
        historicalPerformance= [
          PerformanceItem( period= "Current Month (to date)", value= "35%"),
          PerformanceItem( period= "Last Month", value= "30%", change= "+5pp"),
          PerformanceItem( period= "Two Months Ago", value= "28%", change= "+2pp"),
          PerformanceItem( period= "Three Months Ago", value= "29%", change= "-1pp"),
          PerformanceItem( period= "Application Volume", value= "Increased 15% MoM"),
        ],
        keyMetrics=[
                KeyMetric(
                    metric= "Avg. Application Processing Time (End-to-End)",
            value= "7.1 days",
            benchmark= "Target: 4 days",
            status= "critical"
    ),
                KeyMetric(
            metric= "Time from Submission to Initial Review",
            value= "2.5 days",
            benchmark= "Target: 1 day",
            status= "warning"
    ),
          KeyMetric(
            metric= "Approval Rate (Overall)", value= "65%", benchmark= "Target: 70%", status= "warning" ),
          KeyMetric(
            metric= "Pull-through Rate (Approved to Funded)",
            value= "85%",
            benchmark= "Target: 90%",
            status= "warning"
    ),
          KeyMetric(
            metric= "Application Abandonment Rate", value= "12%", benchmark= "Target: <8%", status= "warning" ),
        ],
        recommendedActions=[
          "Pilot OCR technology and AI-powered validation for automated data extraction from income documents of self-employed applicants.",
          "Develop a flexible staffing model for underwriting, utilizing temporary staff or cross-training from other departments during peak loan seasons.",
          "Redesign online application form with dynamic fields, real-time validation, and clear checklists for required documents (with examples).",
          "Investigate and resolve system latency issues with credit bureau report retrieval; explore alternative/backup providers.",
          "Implement proactive communication to applicants regarding expected timelines and application status updates.",
        ],
    ),),
    ProductStatItem(
        id= "savings-accounts",
      title= "Savings Accounts",
      value= "28%",
      trend=Trend(  # ✅ Use model constructor
            direction= "down", change= "-3% from last month", color= "text-green-500"),
      topIssue= "Interest rate concerns",
      iconName= "BarChart3",
      iconContainerClass= "bg-blue-100",
      iconClass= "text-blue-500",
      headerClass= "bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
      drillDownDetails=DrillDownDetails(  # ✅ Also use model constructor
            rootCauses=[
                RootCause(
            cause= "Aggressive Interest Rate Offers from Online-Only Competitors",
            impact=
              "Customers frequently inquiring about matching competitor rates (e.g., 'NeoBank Savings', 'FinTech Earn') or threatening to move funds.",
            dataPoint= "Competitor mentions up 20% in related calls.",
            severity= "High"
    ),
          RootCause(
            cause= "Lack of Clarity on Tiered Interest Structure & APY Calculation",
            impact=
              "Confusion leading to dissatisfaction when expected interest isn't credited. Customers find thresholds and calculation methods opaque.",
            dataPoint= "15% of rate-related calls involve APY calculation queries.",
            severity= "Medium"
    ),
          RootCause(
            cause= "Low Perceived Value of Associated Benefits/Perks",
            impact=
              "Customers not seeing enough differentiation beyond interest rates (e.g., ATM fee rebates, linked account benefits not well understood or valued).",
            severity= "Medium"
    ),
          RootCause(
            cause= "Recent Decrease in Promotional Campaign Effectiveness",
            impact= "Fewer new account openings from recent marketing pushes compared to previous campaigns.",
            dataPoint= "Conversion rate from 'Summer Savings Drive' 10% lower than 'Spring Growth Offer'.",
            severity= "Low"
    ),
        ],
        historicalPerformance= [
          PerformanceItem( period= "Current Month (to date)", value= "28%"),
          PerformanceItem( period= "Last Month", value= "31%", change= "-3pp"),
          PerformanceItem( period= "Two Months Ago", value= "30%", change= "+1pp"),
          PerformanceItem( period= "Account Opening Rate", value= "-5% MoM"),
          PerformanceItem( period= "Account Closing Rate", value= "+2% MoM"),
        ],
        keyMetrics= [
          KeyMetric(
            metric= "Customer Retention Rate (Savings)", value= "92%", benchmark= "Target: 95%", status= "warning" ),
          KeyMetric(
            metric= "Avg. Account Balance Trend",
            value= "$5,200 (declining -1.5% MoM)",
            benchmark= "Target: Stable or Growing",
            status= "warning"
    ),
                KeyMetric(
            metric= "Net New Money (Savings)",
            value= "-$1.2M last month",
            benchmark= "Target: Positive inflow",
            status= "critical"
    ),
                KeyMetric(
            metric= "Customer Lifetime Value (Savings Segment)",
            value= "$450",
            benchmark= "Target: $550",
            status= "warning"
    ),
          KeyMetric(
            metric= "Calls per Account (Rate-related)", value= "0.15", benchmark= "Target: <0.10", status= "warning" ),
        ],
            recommendedActions=[
          "Conduct bi-weekly competitor rate analysis and develop a tiered response strategy, including targeted retention offers for high-value customers.",
          "Create interactive online calculators and explainer videos for tiered interest structures and APY calculations; train agents on clear explanations.",
          "Survey customers to identify desired perks for savings accounts; explore partnerships for value-added services (e.g., financial planning tools).",
          "Analyze and A/B test new promotional campaign messaging and channels to improve acquisition rates.",
          "Empower frontline agents with pre-approved retention offers for customers citing competitor rates.",
        ],
    ),),
    ProductStatItem(
        id= "mortgages",
      title= "Mortgages",
      value= "22%",
      trend=Trend(  # ✅ Use model constructor
            direction= "up", change= "+2% from last month", color= "text-red-500" ),
      topIssue= "Refinancing questions",
      iconName= "Headphones",
      iconContainerClass= "bg-green-100",
      iconClass= "text-green-500",
      headerClass= "bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
      drillDownDetails=DrillDownDetails(  # ✅ Also use model constructor
            rootCauses=[
                RootCause(
            cause= "Fluctuating Market Interest Rates & Media Speculation",
            impact=
              "Increased customer inquiries about potential benefits and timing of refinancing, driven by economic news.",
            dataPoint= "Refinancing inquiry calls up 30% following central bank announcements.",
            severity= "High"
    ),
          RootCause(
            cause= "Complex Refinancing Process & Documentation Requirements",
            impact=
              "Customers seeking clarification on eligibility, required paperwork (e.g., appraisals, income verification), and timelines. High effort perceived.",
            dataPoint= "Avg. call length for refinancing queries: 12 mins (vs. 7 mins for other mortgage calls).",
            severity= "Medium"
    ),
          RootCause(
            cause= "Lack of Proactive Communication During Underwriting for Refinance",
            impact= "Customers feeling uninformed about status, leading to repeat calls and anxiety.",
            severity= "Medium"
    ),
          RootCause(
            cause= "Agent Unfamiliarity with Niche Refinancing Products (e.g., Cash-out Refi)",
            impact=
              "Incorrect or incomplete information provided, leading to follow-up calls or specialist escalations.",
            dataPoint= "10% of refinancing calls escalated for specialist advice.",
            severity= "Low"
    ),
        ],
        historicalPerformance= [
          PerformanceItem( period= "Current Month (to date)", value= "22%"),
          PerformanceItem( period= "Last Month", value= "20%", change= "+2pp"),
          PerformanceItem( period= "Refinance Application Volume", value= "+18% MoM"),
          PerformanceItem( period= "Refinance Inquiry Call Volume", value= "+25% MoM"),
        ],
        keyMetrics=[
                KeyMetric(
                    metric= "Refinance Application Conversion Rate (Inquiry to App)",
            value= "40%",
            benchmark= "Target: 55%",
            status= "warning"
    ),
          KeyMetric(
            metric= "Time to Close (Refinance)", value= "48 days", benchmark= "Target: 35 days", status= "critical" ),
          KeyMetric(
            metric= "Customer Effort Score (Refinancing Process)",
            value= "3.2/5 (High Effort)",
            benchmark= "Target: >4/5 (Low Effort)",
            status= "warning"
    ),
        KeyMetric(
            metric= "Pull-Through Rate (Refi Approved to Closed)",
            value= "75%",
            benchmark= "Target: 85%",
            status= "warning"
    ),
        ],
            recommendedActions=[
          "Provide proactive communication (e.g., email, website banners) on market rate changes and their potential impact on refinancing decisions.",
          "Develop a simplified online refinancing eligibility checker and a clear, step-by-step guide with document checklists.",
          "Implement automated status updates for refinance applicants at key milestones (application received, underwriting, appraisal, approval).",
          "Conduct targeted training for agents on various refinancing products, including scenario-based role-playing.",
          "Offer personalized refinancing consultations with mortgage specialists, potentially via video call.",
        ],
    ),),
    ProductStatItem(
        id= "investment-products",
      title= "Investment Products",
      value= "18%",
      trend=Trend(  # ✅ Use model constructor
            direction= "up", change= "+4% from last month", color= "text-red-500" ),
      topIssue= "Performance concerns",
      iconName= "Package",
      iconContainerClass= "bg-purple-100",
      iconClass= "text-purple-500",
      headerClass= "bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
      drillDownDetails=DrillDownDetails(  # ✅ Also use model constructor
            rootCauses=[
                RootCause(
            cause= "Recent Market Volatility Impacting Short-Term Returns (esp. Tech & Growth Stocks)",
            impact=
              "Customers concerned about portfolio performance, particularly those with higher-risk allocations or shorter investment horizons.",
            dataPoint= "Performance-related calls up 35% for portfolios with >60% equity.",
            severity= "High"
    ),
          RootCause(
            cause= "Misalignment of Client Risk Profile and Product Suitability",
            impact=
              "Some clients in products too aggressive for their stated risk tolerance, leading to anxiety during downturns. Initial risk assessment may be outdated.",
            dataPoint= "Review found 8% of clients in 'Aggressive Growth' funds have 'Conservative' risk profiles.",
            severity= "Medium"
    ),
          RootCause(
            cause= "Insufficient Agent Training on Explaining Complex Investment Products & Market Fluctuations",
            impact=
              "Agents struggling to reassure clients or clearly articulate long-term strategies versus short-term volatility.",
            severity= "Medium"
    ),
          RootCause(
            cause= "Unclear Fee Structures for Certain Managed Funds",
            impact= "Clients questioning management fees, especially when performance is lagging.",
            dataPoint= "Fee-related queries constitute 10% of investment calls.",
            severity= "Low"
    ),
        ],
        historicalPerformance= [
          PerformanceItem( period= "Current Month (to date)", value= "18%"),
          PerformanceItem( period= "Last Month", value= "14%", change= "+4pp"),
          PerformanceItem( period= "Client Portfolio Growth (Avg. QTD)", value= "1.2%", benchmark= "S&P 500 QTD: 2.1%"),   
          PerformanceItem( period= "Net Fund Inflow/Outflow", value= "-$0.8M last month"),
        ],
        keyMetrics=[
                KeyMetric(
                    metric= "Client Satisfaction with Investment Advisor/Support",
            value= "3.9/5",
            benchmark= "Target: 4.5/5",
            status= "warning"
    ),
                KeyMetric(
            metric= "Number of Complaints (Performance-related)",
            value= "25 last month",
            benchmark= "Target: <10",
            status= "critical"
    ),
                KeyMetric(
            metric= "Client Retention Rate (Investment Segment)",
            value= "90%",
            benchmark= "Target: 94%",
            status= "warning"
    ),
                KeyMetric(
            metric= "Percentage of Clients with Annual Portfolio Review",
            value= "60%",
            benchmark= "Target: 90%",
            status= "warning"
    ),
                KeyMetric(
            metric= "Understanding of Risk (Client Survey)",
            value= "65% report full understanding",
            benchmark= "Target: 80%",
            status= "warning"
    ),
        ],
            recommendedActions=[
          "Schedule proactive portfolio reviews for clients in high-volatility products or those whose portfolios have underperformed benchmarks significantly.",
          "Mandate annual risk profile reassessment for all investment clients and ensure product holdings align with current tolerance.",
          "Develop advanced training modules for agents on communicating risk, managing client expectations during market downturns, and explaining long-term investment principles.",
          "Create transparent, easy-to-understand documentation on fee structures for all investment products and make it readily available.",
          "Launch educational webinars/content on navigating market volatility and the importance of diversified, long-term investment strategies.",
        ],
    ),),
    # ...add more ProductStatItem instances
]
