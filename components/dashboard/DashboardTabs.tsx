import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import OverviewTab from "./OverviewTab"
// import AnalyticsTab from "./AnalyticsTab"
// import ReportsTab from "./ReportsTab"

export default function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="bg-white/80 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>

      {/* <TabsContent value="analytics"><AnalyticsTab /></TabsContent> */}
      {/* <TabsContent value="reports"><ReportsTab /></TabsContent> */}
    </Tabs>
  )
}
