'use client'

import React from 'react'

const SalesEffectivenessPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Successful Sales / Upgrades */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Successful Sales/Upgrades</h4>
          <div className="text-2xl font-bold text-primary">24%</div>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '24%' }}></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">124 calls out of 517 resulted in a sale</p>
      </div>

      {/* Cross-Sell Success Rate */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Cross-Sell Success Rate</h4>
          <div className="text-2xl font-bold text-green-600">18%</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-muted/30 p-2 rounded-md">
            <div className="text-sm font-medium">Top Cross-Sell</div>
            <div className="text-xs text-muted-foreground">Credit Card → Investment Products</div>
            <div className="text-xs font-medium text-green-600 mt-1">32% success</div>
          </div>
          <div className="bg-muted/30 p-2 rounded-md">
            <div className="text-sm font-medium">Lowest Cross-Sell</div>
            <div className="text-xs text-muted-foreground">Mortgage → Personal Loans</div>
            <div className="text-xs font-medium text-red-600 mt-1">8% success</div>
          </div>
        </div>
      </div>

      {/* Missed Sales Opportunities */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Missed Sales Opportunities</h4>
          <div className="text-2xl font-bold text-amber-600">43</div>
        </div>
        <div className="bg-muted/30 p-3 rounded-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium">Top Missed Keywords</span>
            <span className="text-muted-foreground">Occurrence</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span>"better interest rate"</span>
              <span className="font-medium">17</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>"comparing options"</span>
              <span className="font-medium">14</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>"looking for alternatives"</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesEffectivenessPanel
