import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, BarChart3, PieChart, LineChart, Calendar } from "lucide-react"

export default function Reports() {
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground mt-1">Generate and view detailed analytics reports</p>
        </div>
        <Button>Generate New Report</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="all" className="rounded-md">
            All Reports
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-md">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-md">
            Monthly
          </TabsTrigger>
          <TabsTrigger value="custom" className="rounded-md">
            Custom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="stat-card card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">Last generated today</p>
              </CardContent>
            </Card>

            <Card className="stat-card card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Reports</CardTitle>
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">Updated every Monday</p>
              </CardContent>
            </Card>

            <Card className="stat-card card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Reports</CardTitle>
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">Last month: June 2023</p>
              </CardContent>
            </Card>

            <Card className="stat-card card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Custom Reports</CardTitle>
                <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">Based on your criteria</p>
              </CardContent>
            </Card>
          </div>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>View and download your recent reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Weekly Call Summary",
                    date: "July 10, 2023",
                    type: "Weekly",
                    icon: LineChart,
                  },
                  {
                    title: "Monthly Language Analysis",
                    date: "July 1, 2023",
                    type: "Monthly",
                    icon: BarChart3,
                  },
                  {
                    title: "Quarterly Sentiment Report",
                    date: "June 30, 2023",
                    type: "Quarterly",
                    icon: PieChart,
                  },
                  {
                    title: "Agent Performance Review",
                    date: "June 15, 2023",
                    type: "Custom",
                    icon: FileText,
                  },
                ].map((report, i) => (
                  <div
                    key={report.title}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <report.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">Generated on {report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-primary/5">
                        {report.type}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Weekly Reports</CardTitle>
              <CardDescription>View and download your weekly reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <LineChart className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Weekly Call Summary</p>
                        <p className="text-sm text-muted-foreground">Week {28 - i}, 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Monthly Reports</CardTitle>
              <CardDescription>View and download your monthly reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["July", "June", "May", "April"].map((month, i) => (
                  <div
                    key={month}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Monthly Language Analysis</p>
                        <p className="text-sm text-muted-foreground">{month} 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>View and download your custom reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Agent Performance Review",
                    date: "June 15, 2023",
                    icon: FileText,
                  },
                  {
                    title: "Language Distribution Analysis",
                    date: "May 22, 2023",
                    icon: PieChart,
                  },
                  {
                    title: "Customer Satisfaction Trends",
                    date: "April 10, 2023",
                    icon: LineChart,
                  },
                ].map((report) => (
                  <div
                    key={report.title}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <report.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-muted-foreground">Generated on {report.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
