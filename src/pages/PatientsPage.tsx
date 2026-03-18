import { useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { LayoutGrid, List, Search, Pencil, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PatientCard } from "@/components/patients/PatientCard"
import { PatientDetailDialog } from "@/components/patients/PatientDetailDialog"
import { usePatientStore } from "@/store/patientStore"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/dateUtils"

const statusColors: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-700",
  Stable: "bg-blue-50 text-blue-700",
  Critical: "bg-red-50 text-red-600",
  Discharged: "bg-gray-100 text-gray-500",
}

const statusFilters = ["All", "Active", "Stable", "Critical", "Discharged"] as const

export function PatientsPage() {
  const [searchParams] = useSearchParams()
  const {
    viewMode,
    searchQuery,
    statusFilter,
    selectedPatient,
    setViewMode,
    setSearchQuery,
    setStatusFilter,
    setSelectedPatient,
    getFilteredPatients,
  } = usePatientStore()

  const patients = getFilteredPatients()

  useEffect(() => {
    const id = searchParams.get("id")
    if (id) {
      const found = usePatientStore.getState().patients.find((p) => p.id === id)
      if (found) setSelectedPatient(found)
    }
  }, [searchParams, setSelectedPatient])

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, condition, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 rounded-lg border border-border bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-gray-50">
            <List className="h-3.5 w-3.5 text-gray-400" />
            <Switch
              id="view-toggle"
              checked={viewMode === "grid"}
              onCheckedChange={(checked) => setViewMode(checked ? "grid" : "list")}
            />
            <LayoutGrid className="h-3.5 w-3.5 text-gray-400" />
            <Label htmlFor="view-toggle" className="text-xs text-gray-400 cursor-pointer select-none">
              {viewMode === "grid" ? "Grid" : "List"}
            </Label>
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 mt-3 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                statusFilter === f
                  ? "bg-violet-100 text-violet-700"
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-gray-400 px-1">
        {patients.length} patient{patients.length !== 1 ? "s" : ""}
        {statusFilter !== "All" && ` · ${statusFilter}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Empty state */}
      {patients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm flex flex-col items-center justify-center py-16 text-center">
          <Search className="h-10 w-10 text-gray-200 mb-3" />
          <p className="font-medium text-gray-600">No patients found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 rounded-full"
            onClick={() => { setSearchQuery(""); setStatusFilter("All") }}
          >
            Clear filters
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {patients.map((p) => (
            <PatientCard key={p.id} patient={p} onClick={() => setSelectedPatient(p)} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="py-3 px-5 text-left">
                    <input type="checkbox" className="rounded border-gray-300 accent-primary" />
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">No</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden sm:table-cell">Age</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden md:table-cell">Date of Birth</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden lg:table-cell">Doctor</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 hidden xl:table-cell">Phone</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p, i) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <input type="checkbox" className="rounded border-gray-300 accent-primary" />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-400">{String(i + 1).padStart(2, "0")}</td>
                    <td className="py-3.5 px-4">
                      <div
                        className="flex items-center gap-2.5 cursor-pointer"
                        onClick={() => setSelectedPatient(p)}
                      >
                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-xs font-semibold text-teal-700 shrink-0">
                          {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.ward}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-gray-600">{p.age}</td>
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-gray-600">{formatDate(p.admissionDate)}</td>
                    <td className="py-3.5 px-4">
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[p.status])}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden lg:table-cell text-xs text-gray-500">{p.doctor}</td>
                    <td className="py-3.5 px-4 hidden xl:table-cell text-xs text-gray-500">{p.contact}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <PatientDetailDialog
        patient={selectedPatient}
        open={!!selectedPatient}
        onOpenChange={(open) => !open && setSelectedPatient(null)}
      />
    </div>
  )
}
