import { create } from "zustand"
import type { Patient } from "@/types"
import { mockPatients } from "@/data/mockData"

type ViewMode = "grid" | "list"
type StatusFilter = "All" | Patient["status"]

interface PatientState {
  patients: Patient[]
  viewMode: ViewMode
  searchQuery: string
  statusFilter: StatusFilter
  selectedPatient: Patient | null

  setViewMode: (mode: ViewMode) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (filter: StatusFilter) => void
  setSelectedPatient: (patient: Patient | null) => void
  getFilteredPatients: () => Patient[]
}

export const usePatientStore = create<PatientState>()((set, get) => ({
  patients: mockPatients,
  viewMode: "grid",
  searchQuery: "",
  statusFilter: "All",
  selectedPatient: null,

  setViewMode: (viewMode) => set({ viewMode }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSelectedPatient: (selectedPatient) => set({ selectedPatient }),

  getFilteredPatients: () => {
    const { patients, searchQuery, statusFilter } = get()
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctor.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "All" || p.status === statusFilter

      return matchesSearch && matchesStatus
    })
  },
}))
