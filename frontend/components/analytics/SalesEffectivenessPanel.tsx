'use client'

import React from 'react'

type SalesData = {
  successfulSalesPercent: number
  successfulSalesCount: number
  totalCalls: number
  crossSellSuccessPercent: number
  topCrossSell: {
    from: string
    to: string
    successPercent: number
  }
  lowestCrossSell: {
    from: string
    to: string
    successPercent: number
  }
  missedOpportunitiesCount: number
  topMissedKeywords: { phrase: string; count: number }[]
}

interface SalesEffectivenessPanelProps {
  salesData?: SalesData  // make it optional
}

const SalesEffectivenessPanel: React.FC<SalesEffectivenessPanelProps> = ({ salesData }) => {
  if (!salesData) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading sales effectiveness data...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Successful Sales / Upgrades */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Successful Sales/Upgrades</h4>
          <div className="text-2xl font-bold text-primary">
            {salesData.successfulSalesPercent}%
          </div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${salesData.successfulSalesPercent}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {salesData.successfulSalesCount} calls out of {salesData.totalCalls} resulted in a sale
        </p>
      </div>

      {/* Cross-Sell Success Rate */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Cross-Sell Success Rate</h4>
          <div className="text-2xl font-bold text-green-600">
            {salesData.crossSellSuccessPercent}%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-muted/30 p-2 rounded-md">
            <div className="text-sm font-medium">Top Cross-Sell</div>
            <div className="text-xs text-muted-foreground">
              {salesData.topCrossSell.from} → {salesData.topCrossSell.to}
            </div>
            <div className="text-xs font-medium text-green-600 mt-1">
              {salesData.topCrossSell.successPercent}% success
            </div>
          </div>
          <div className="bg-muted/30 p-2 rounded-md">
            <div className="text-sm font-medium">Lowest Cross-Sell</div>
            <div className="text-xs text-muted-foreground">
              {salesData.lowestCrossSell.from} → {salesData.lowestCrossSell.to}
            </div>
            <div className="text-xs font-medium text-red-600 mt-1">
              {salesData.lowestCrossSell.successPercent}% success
            </div>
          </div>
        </div>
      </div>

      {/* Missed Sales Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Missed Sales Opportunities</h4>
          <div className="text-2xl font-bold text-amber-600">
            {salesData.missedOpportunitiesCount}
          </div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium">Top Missed Keywords</span>
            <span className="text-muted-foreground">Occurrence</span>
          </div>
          <div className="space-y-2">
            {salesData.topMissedKeywords.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span>"{item.phrase}"</span>
                <span className="font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesEffectivenessPanel
