'use client'

import { ArrowDownRight, ArrowUpRight, AlertTriangle, History, TrendingUp, ListChecks } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProductStatDetailsContentProps {
  selectedProductStat: any
}

const ProductStatDetailsContent: React.FC<ProductStatDetailsContentProps> = ({ selectedProductStat }) => {
  return (
    <div className="mt-4 space-y-6 pr-2 max-h-[70vh] overflow-y-auto">
      {/* Overview */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Overview</h3>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">Current Value (Top Issue Focus)</span>
          <span className={`text-2xl font-bold ${selectedProductStat.trend.color}`}>
            {selectedProductStat.value}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Trend</span>
          <div className={`flex items-center ${selectedProductStat.trend.color}`}>
            {selectedProductStat.trend.direction === 'up' ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {selectedProductStat.trend.change}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Top Issue Identified:</span> {selectedProductStat.topIssue}
        </div>
      </div>

      {/* Root Causes */}
      {selectedProductStat.drillDownDetails.rootCauses.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
            Potential Root Causes
          </h4>
          <div className="space-y-3">
            {selectedProductStat.drillDownDetails.rootCauses.map((cause: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{cause.cause}</span>
                  {cause.severity && (
                    <Badge
                      variant={
                        cause.severity === 'High'
                          ? 'destructive'
                          : cause.severity === 'Medium'
                            ? 'warning'
                            : 'outline'
                      }
                      className="text-xs"
                    >
                      {cause.severity} Severity
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{cause.impact}</p>
                {cause.dataPoint && <p className="text-xs text-primary mt-1">Data: {cause.dataPoint}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical Performance */}
      {selectedProductStat.drillDownDetails.historicalPerformance.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <History className="h-4 w-4 mr-2 text-blue-500" />
            Historical Performance
          </h4>
          <div className="space-y-2">
            {selectedProductStat.drillDownDetails.historicalPerformance.map((perf: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm p-2 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700"
              >
                <span>
                  {perf.period}: <span className="font-semibold">{perf.value}</span>
                </span>
                {perf.change && (
                  <span className={`text-xs ${perf.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {perf.change}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics */}
      {selectedProductStat.drillDownDetails.keyMetrics.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-indigo-500" />
            Key Related Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedProductStat.drillDownDetails.keyMetrics.map((metric: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700"
              >
                <div className="text-xs text-muted-foreground">{metric.metric}</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-lg font-semibold">{metric.value}</span>
                  {metric.benchmark && (
                    <span
                      className={`text-xs ${
                        metric.status === 'good'
                          ? 'text-green-500'
                          : metric.status === 'warning'
                            ? 'text-amber-500'
                            : 'text-red-500'
                      }`}
                    >
                      vs {metric.benchmark}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      {selectedProductStat.drillDownDetails.recommendedActions.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <ListChecks className="h-4 w-4 mr-2 text-green-500" />
            Recommended Actions
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700">
            {selectedProductStat.drillDownDetails.recommendedActions.map((action: string, idx: number) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ProductStatDetailsContent
