import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, AlertTriangle, Calendar, BedDouble, ArrowRight, MoreHorizontal } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { dashboardStats, analyticsData, mockPatients } from "@/data/mockData"
import { useNotificationStore } from "@/store/notificationStore"
import { requestNotificationPermission, registerServiceWorker, showLocalNotification } from "@/services/notificationService"
import { formatDate } from "@/lib/dateUtils"
import { cn } from "@/lib/utils"

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Stable: "bg-blue-50 text-blue-700",
  Critical: "bg-red-50 text-red-600",
  Discharged: "bg-gray-100 text-gray-500",
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    registerServiceWorker()
    const timer = setTimeout(async () => {
      const granted = await requestNotificationPermission()
      if (granted) {
        showLocalNotification("Daily Summary", `${dashboardStats.criticalCases} critical cases need attention today.`)
      }
      addNotification({
        title: "Daily Summary Ready",
        message: `Today you have ${dashboardStats.appointmentsToday} appointments scheduled.`,
        type: "info",
      })
    }, 2000)
    return () => clearTimeout(timer)
  }, [addNotification])

  const recentPatients = mockPatients.slice(0, 5)

  const stats = [
    {
      title: "Total Patients",
      value: "540",
      change: "+15.9%",
      icon: Users,
      desc: "Keep track of patient information at a glance, with easy access to key details.",
      highlight: false,
    },
    {
      title: "Doctors",
      value: "260",
      change: "+15.9%",
      icon: AlertTriangle,
      desc: "Stay updated with essential details to streamline medical support.",
      highlight: true,
    },
    {
      title: "Appointments",
      value: String(dashboardStats.appointmentsToday),
      change: "+15.9%",
      icon: Calendar,
      desc: "Stay informed with real-time data to enhance patient care.",
      highlight: false,
    },
    {
      title: "Total Beds",
      value: "1205",
      change: "Available",
      icon: BedDouble,
      desc: null,
      highlight: false,
      bedStats: true,
    },
  ]

  return (
    <div className="space-y-5">

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={cn(
              "rounded-2xl p-5 shadow-sm border border-border/60",
              stat.highlight ? "bg-teal-50 border-teal-100" : "bg-white"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.highlight ? "bg-teal-100" : "bg-gray-100")}>
                  <stat.icon className={cn("h-4 w-4", stat.highlight ? "text-teal-600" : "text-gray-500")} />
                </div>
                <span className="text-sm font-medium text-gray-600">{stat.title}</span>
              </div>
              <button className="text-gray-300 hover:text-gray-500">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
              {stat.change !== "Available" && (
                <span className="text-xs font-medium text-emerald-500">↑ {stat.change}</span>
              )}
              {stat.change === "Available" && (
                <span className="text-xs text-gray-400">Available</span>
              )}
            </div>

            {stat.bedStats ? (
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                <div>
                  <p className="text-lg font-semibold text-gray-800">110 Bed</p>
                  <p className="text-xs text-gray-400">Private Bed</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">215 Bed</p>
                  <p className="text-xs text-gray-400">General Bed</p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 leading-relaxed">{stat.desc}</p>
            )}
          </div>
        ))}
      </div>

      {/* Chart + Department */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-border/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800">Patient Overview</h2>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-teal-500" />
                Admissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400" />
                Discharges
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analyticsData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradTeal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", fontSize: "12px" }}
              />
              <Area type="monotone" dataKey="admissions" stroke="#14b8a6" strokeWidth={2} fill="url(#gradTeal)" name="Admissions" dot={false} />
              <Area type="monotone" dataKey="discharges" stroke="#a78bfa" strokeWidth={2} fill="url(#gradViolet)" name="Discharges" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Department Overview</h2>
          <div className="space-y-4">
            {[
              { dept: "Cardiology", patients: 42, pct: 82, color: "bg-teal-400" },
              { dept: "ICU", patients: 18, pct: 90, color: "bg-violet-400" },
              { dept: "Orthopedics", patients: 35, pct: 65, color: "bg-blue-400" },
              { dept: "Neurology", patients: 27, pct: 55, color: "bg-amber-400" },
              { dept: "Pediatrics", patients: 31, pct: 70, color: "bg-rose-400" },
            ].map((d) => (
              <div key={d.dept}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-gray-700">{d.dept}</span>
                  <span className="text-gray-400">{d.patients} patients</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full">
                  <div className={cn("h-full rounded-full", d.color)} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Patients table */}
      <div className="bg-white rounded-2xl shadow-sm border border-border/60">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Patient Overview</h2>
            <p className="text-xs text-gray-400 mt-0.5">Recent patient activity and status</p>
          </div>
          <button
            onClick={() => navigate("/patients")}
            className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
          >
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="py-3 px-5 text-left text-xs font-medium text-gray-400">No</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Name</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden sm:table-cell">Condition</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden md:table-cell">Doctor</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden lg:table-cell">Last Visit</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 cursor-pointer transition-colors"
                  onClick={() => navigate(`/patients?id=${p.id}`)}
                >
                  <td className="py-3.5 px-5 text-xs text-gray-400">{String(i + 1).padStart(2, "0")}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-teal-100 flex items-center justify-center text-xs font-semibold text-teal-700 shrink-0">
                        {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-xs">{p.name}</p>
                        <p className="text-[11px] text-gray-400">{p.ward}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-gray-500">{p.condition}</td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-xs text-gray-500">{p.doctor}</td>
                  <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-gray-500">{formatDate(p.lastVisit)}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[p.status])}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
