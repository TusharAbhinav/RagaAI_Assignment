import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsData, conditionDistribution } from "@/data/mockData"
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react"

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"]

// some extra data for the analytics page
const weeklyData = [
  { day: "Mon", patients: 24, critical: 3 },
  { day: "Tue", patients: 31, critical: 5 },
  { day: "Wed", patients: 28, critical: 2 },
  { day: "Thu", patients: 35, critical: 6 },
  { day: "Fri", patients: 42, critical: 4 },
  { day: "Sat", patients: 18, critical: 1 },
  { day: "Sun", patients: 12, critical: 2 },
]

const topConditions = [
  { condition: "Hypertension", count: 68, change: +5 },
  { condition: "Diabetes", count: 54, change: +2 },
  { condition: "Heart Disease", count: 41, change: -3 },
  { condition: "COPD", count: 29, change: +1 },
  { condition: "Kidney Disease", count: 24, change: +4 },
]

export function AnalyticsPage() {
  const totalRevenue = analyticsData.reduce((sum, d) => sum + d.revenue, 0)
  const totalAdmissions = analyticsData.reduce((sum, d) => sum + d.admissions, 0)
  const avgOccupancy = 76

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue (6M)</p>
                <p className="text-2xl font-bold mt-1">
                  ${(totalRevenue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +8.2% vs last period
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Admissions (6M)</p>
                <p className="text-2xl font-bold mt-1">{totalAdmissions}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" /> +5.4% vs last period
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Bed Occupancy</p>
                <p className="text-2xl font-bold mt-1">{avgOccupancy}%</p>
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> -2.1% vs last period
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Stay Duration</p>
                <p className="text-2xl font-bold mt-1">4.2 days</p>
                <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                  <TrendingDown className="h-3 w-3" /> -0.3d improved
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-50">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="monthly">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="conditions">Conditions</TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Monthly Admissions vs Discharges</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analyticsData} margin={{ left: -20, right: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="admissions" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Admissions" />
                    <Bar dataKey="discharges" fill="#10b981" radius={[3, 3, 0, 0]} name="Discharges" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={analyticsData} margin={{ left: -10, right: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                    <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={{ fill: "#8b5cf6", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">This Week — Daily Patient Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData} margin={{ left: -20, right: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Total Patients" />
                  <Bar dataKey="critical" fill="#ef4444" radius={[3, 3, 0, 0]} name="Critical Cases" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conditions" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Cases by Department</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={conditionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {conditionDistribution.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold">Top Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topConditions.map((item, i) => (
                    <div key={item.condition} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-4">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{item.condition}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{item.count}</span>
                            <span
                              className={
                                item.change > 0 ? "text-emerald-600 text-xs" : "text-red-500 text-xs"
                              }
                            >
                              {item.change > 0 ? `+${item.change}` : item.change}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(item.count / topConditions[0].count) * 100}%`,
                              backgroundColor: COLORS[i],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
