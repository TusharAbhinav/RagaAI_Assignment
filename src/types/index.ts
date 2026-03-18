export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL?: string | null
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: "Male" | "Female" | "Other"
  condition: string
  status: "Active" | "Critical" | "Stable" | "Discharged"
  doctor: string
  admissionDate: string
  lastVisit: string
  contact: string
  bloodGroup: string
  ward: string
  avatarUrl?: string
}

export interface DashboardStats {
  totalPatients: number
  criticalCases: number
  appointmentsToday: number
  bedOccupancy: number
}

export interface AnalyticsData {
  month: string
  admissions: number
  discharges: number
  revenue: number
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: Date
  read: boolean
}
