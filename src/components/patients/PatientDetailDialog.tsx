import type { Patient } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Phone,
  Calendar,
  Stethoscope,
  User,
  Droplets,
  MapPin,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/dateUtils"
import { useNotificationStore } from "@/store/notificationStore"
import { schedulePatientReminder } from "@/services/notificationService"
import { toast } from "sonner"

const statusColors: Record<Patient["status"], string> = {
  Active: "bg-blue-100 text-blue-700",
  Stable: "bg-green-100 text-green-700",
  Critical: "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

interface PatientDetailDialogProps {
  patient: Patient | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientDetailDialog({ patient, open, onOpenChange }: PatientDetailDialogProps) {
  const { addNotification } = useNotificationStore()

  if (!patient) return null

  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  const handleSetReminder = () => {
    schedulePatientReminder(patient.name, 5000)
    addNotification({
      title: "Reminder Set",
      message: `Follow-up reminder set for ${patient.name}`,
      type: "success",
    })
    toast.success(`Reminder set for ${patient.name}`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{patient.name}</h3>
            <p className="text-sm text-muted-foreground">
              {patient.id} · {patient.age} years · {patient.gender}
            </p>
            <span className={cn("mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-medium", statusColors[patient.status])}>
              {patient.status}
            </span>
          </div>
        </div>

        <Separator />

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Condition</p>
              <p className="font-medium">{patient.condition}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Ward</p>
              <p className="font-medium">{patient.ward}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Attending Doctor</p>
              <p className="font-medium">{patient.doctor}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Blood Group</p>
              <p className="font-medium">{patient.bloodGroup}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Admission Date</p>
              <p className="font-medium">{formatDate(patient.admissionDate)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Last Visit</p>
              <p className="font-medium">{formatDate(patient.lastVisit)}</p>
            </div>
          </div>

          <div className="flex items-start gap-2 col-span-2">
            <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Contact</p>
              <p className="font-medium">{patient.contact}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleSetReminder}
          >
            <Bell className="h-3.5 w-3.5" />
            Set Reminder
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
