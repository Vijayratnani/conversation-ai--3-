'use client'

import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface KnowledgeItem {
  product: string
  score: number
  color: string
  issues: string
}

interface AdherenceItem {
  id: string
  product: string
  adherenceScore: number
  topMissedArea: string
  trend: {
    direction: 'up' | 'down' | 'flat'
    color: string
  }
}

interface AgentKnowledgeInsightsGridProps {
  productKnowledgeLevels: KnowledgeItem[]
  scriptAdherenceData: AdherenceItem[]
  handleKnowledgeItemClick: (item: KnowledgeItem) => void
  handleScriptAdherenceClick: (item: AdherenceItem) => void
}

const AgentKnowledgeInsightsGrid: React.FC<AgentKnowledgeInsightsGridProps> = ({
  productKnowledgeLevels,
  scriptAdherenceData,
  handleKnowledgeItemClick,
  handleScriptAdherenceClick,
}) => {
  return (
    <div className="space-y-6">
      {/* Product Knowledge & Script Adherence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Knowledge */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
            Product Knowledge Level
          </h3>
          <div className="space-y-3">
            {productKnowledgeLevels.map((item) => (
              <div
                key={item.product}
                className="bg-white dark:bg-muted/20 p-3 rounded-md shadow-sm border border-muted/50 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleKnowledgeItemClick(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleKnowledgeItemClick(item)
                }}
                aria-haspopup="dialog"
                aria-labelledby={`knowledge-item-${item.product}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span id={`knowledge-item-${item.product}`} className="font-medium text-sm">
                    {item.product}
                  </span>
                  <span
                    className={`text-sm px-1.5 py-0.5 rounded-full ${
                      item.score > 80
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : item.score > 70
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {item.score}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground">{item.issues}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Script Adherence */}
        <div>
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
            Script Adherence by Product
          </h3>
          <div className="bg-white dark:bg-muted/20 p-4 rounded-md shadow-sm border border-muted/50">
            <div className="space-y-4">
              {scriptAdherenceData.map((item) => (
                <div
                  key={item.id}
                  className="space-y-1 cursor-pointer hover:bg-muted/30 p-2 rounded-md transition-colors"
                  onClick={() => handleScriptAdherenceClick(item)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleScriptAdherenceClick(item)
                  }}
                  aria-haspopup="dialog"
                  aria-labelledby={`adherence-item-${item.id}`}
                >
                  <div className="flex items-center justify-between">
                    <span id={`adherence-item-${item.id}`} className="text-sm">
                      {item.product}
                    </span>
                    <div className="flex items-center">
                      <span
                        className={`text-xs font-medium mr-2 ${
                          item.adherenceScore > 90
                            ? 'text-green-600'
                            : item.adherenceScore > 80
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.adherenceScore}%
                      </span>
                      {item.trend.direction === 'up' && (
                        <ArrowUpRight className={`h-3 w-3 ${item.trend.color}`} />
                      )}
                      {item.trend.direction === 'down' && (
                        <ArrowDownRight className={`h-3 w-3 ${item.trend.color}`} />
                      )}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        item.adherenceScore > 90
                          ? 'bg-green-500'
                          : item.adherenceScore > 80
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${item.adherenceScore}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.adherenceScore < 90
                      ? `Top Miss: ${item.topMissedArea}`
                      : 'Excellent adherence'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AHT Section */}
      <div>
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
          Average Handling Time by Product Type
        </h3>
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { product: 'Credit Cards', time: '4:32', trend: 'down', percent: '8%' },
            { product: 'Personal Loans', time: '7:15', trend: 'up', percent: '5%' },
            { product: 'Savings Accounts', time: '3:45', trend: 'down', percent: '12%' },
            { product: 'Mortgages', time: '9:20', trend: 'up', percent: '3%' },
          ].map((item) => (
            <div
              key={item.product}
              className="bg-white dark:bg-muted/20 p-4 rounded-md shadow-sm border border-muted/50 text-center"
            >
              <div className="text-sm font-medium">{item.product}</div>
              <div className="text-2xl font-bold my-2">{item.time}</div>
              <div
                className={`text-xs flex items-center justify-center ${
                  item.trend === 'down' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.trend === 'down' ? (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                )}
                <span>{item.percent} from last month</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AgentKnowledgeInsightsGrid
