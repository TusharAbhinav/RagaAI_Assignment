import type { Patient } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, Calendar, Stethoscope } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/dateUtils"

const statusVariant: Record<Patient["status"], string> = {
  Active: "bg-blue-100 text-blue-700 border-blue-200",
  Stable: "bg-green-100 text-green-700 border-green-200",
  Critical: "bg-red-100 text-red-700 border-red-200",
  Discharged: "bg-gray-100 text-gray-600 border-gray-200",
}

interface PatientCardProps {
  patient: Patient
  onClick: () => void
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{patient.name}</p>
            <p className="text-xs text-muted-foreground">
              {patient.id} · {patient.age}y · {patient.gender}
            </p>
          </div>
          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0", statusVariant[patient.status])}>
            {patient.status}
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Stethoscope className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{patient.condition}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>Last visit: {formatDate(patient.lastVisit)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{patient.contact}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{patient.doctor}</span>
          <Badge variant="outline" className="text-xs py-0">
            {patient.ward}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
