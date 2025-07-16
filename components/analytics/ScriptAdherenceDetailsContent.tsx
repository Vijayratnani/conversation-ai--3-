'use client'

import { ArrowUpRight, ArrowDownRight, AlertTriangle, Lightbulb, TrendingUp, Headphones, ListChecks, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ScriptAdherenceDetailsContentProps {
  selectedScriptAdherenceItem: any
}

const ScriptAdherenceDetailsContent: React.FC<ScriptAdherenceDetailsContentProps> = ({
  selectedScriptAdherenceItem,
}) => {
  return (
    <div className="mt-4 space-y-6 pr-2 max-h-[70vh] overflow-y-auto">
      {/* Adherence Overview */}
      <div className="p-4 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Adherence Overview</h3>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-muted-foreground">Current Adherence Score</span>
          <span
            className={`text-2xl font-bold ${
              selectedScriptAdherenceItem.adherenceScore > 90
                ? 'text-green-600'
                : selectedScriptAdherenceItem.adherenceScore > 80
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          >
            {selectedScriptAdherenceItem.adherenceScore}%
          </span>
        </div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Trend</span>
          <div className={`flex items-center ${selectedScriptAdherenceItem.trend.color}`}>
            {selectedScriptAdherenceItem.trend.direction === 'up' ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : selectedScriptAdherenceItem.trend.direction === 'down' ? (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            ) : null}
            {selectedScriptAdherenceItem.trend.change}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Top Missed Area:</span> {selectedScriptAdherenceItem.topMissedArea}
        </div>
      </div>

      {/* Key Missed Points */}
      {selectedScriptAdherenceItem.drillDownDetails.keyMissedPoints.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
            Key Missed Script Points
          </h4>
          <div className="space-y-3">
            {selectedScriptAdherenceItem.drillDownDetails.keyMissedPoints.map((miss: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{miss.point}</span>
                  <Badge variant="outline" className="text-xs">
                    Frequency: {miss.frequency}
                  </Badge>
                </div>
                {miss.impact && <p className="text-xs text-muted-foreground mt-1">Impact: {miss.impact}</p>}
                {miss.examples?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-muted-foreground">Examples:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 pl-2">
                      {miss.examples.map((ex: string, i: number) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Strengths */}
      {selectedScriptAdherenceItem.drillDownDetails.keyStrengths.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 mr-2 text-green-500" />
            Key Strengths in Adherence
          </h4>
          <div className="space-y-2">
            {selectedScriptAdherenceItem.drillDownDetails.keyStrengths.map((strength: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <p className="text-sm font-medium">{strength.point}</p>
                {strength.examples?.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs font-semibold text-muted-foreground">Examples:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 pl-2">
                      {strength.examples.map((ex: string, i: number) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Impact of Non-Adherence */}
      {selectedScriptAdherenceItem.drillDownDetails.impactOfNonAdherence?.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-orange-500" />
            Impact of Non-Adherence
          </h4>
          <div className="space-y-3">
            {selectedScriptAdherenceItem.drillDownDetails.impactOfNonAdherence.map((impact: any, idx: number) => (
              <div
                key={idx}
                className="p-3 bg-white dark:bg-muted/20 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{impact.area}</span>
                  {impact.severity && (
                    <Badge
                      variant={
                        impact.severity === 'High'
                          ? 'destructive'
                          : impact.severity === 'Medium'
                          ? 'warning'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {impact.severity} Impact
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{impact.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Agent Feedback */}
      {selectedScriptAdherenceItem.drillDownDetails.commonAgentFeedback?.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2 flex items-center">
            <Headphones className="h-4 w-4 mr-2 text-blue-500" />
            Common Agent Feedback on Script
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700">
            {selectedScriptAdherenceItem.drillDownDetails.commonAgentFeedback.map((feedback: string, idx: number) => (
              <li key={idx}>{feedback}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Script Updates & Training Focus */}
      {(selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates?.length > 0 ||
        selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recommended Script Updates */}
          {selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates?.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <ListChecks className="h-4 w-4 mr-2 text-purple-500" />
                Recommended Script Updates
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700 h-full">
                {selectedScriptAdherenceItem.drillDownDetails.recommendedScriptUpdates.map((update: string, idx: number) => (
                  <li key={idx}>{update}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Training Focus Areas */}
          {selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas?.length > 0 && (
            <div>
              <h4 className="text-md font-semibold mb-2 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-teal-500" />
                Training Focus Areas
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 bg-white dark:bg-muted/20 p-3 rounded-md border border-gray-200 dark:border-gray-700 h-full">
                {selectedScriptAdherenceItem.drillDownDetails.trainingFocusAreas.map((focus: string, idx: number) => (
                  <li key={idx}>{focus}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ScriptAdherenceDetailsContent
