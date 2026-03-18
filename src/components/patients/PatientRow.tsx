import type { Patient } from "@/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/dateUtils"

const statusColors: Record<Patient["status"], string> = {
  Active: "bg-blue-100 text-blue-700",
  Stable: "bg-green-100 text-green-700",
  Critical: "bg-red-100 text-red-700",
  Discharged: "bg-gray-100 text-gray-600",
}

interface PatientRowProps {
  patient: Patient
  onClick: () => void
}

export function PatientRow({ patient, onClick }: PatientRowProps) {
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <tr
      className="hover:bg-muted/40 cursor-pointer transition-colors border-b last:border-0"
      onClick={onClick}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{patient.name}</p>
            <p className="text-xs text-muted-foreground">{patient.id}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-sm hidden sm:table-cell">
        {patient.age} · {patient.gender}
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
        {patient.condition}
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
        {patient.doctor}
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground hidden xl:table-cell">
        {formatDate(patient.lastVisit)}
      </td>
      <td className="py-3 px-4 text-sm hidden md:table-cell text-muted-foreground">
        {patient.ward}
      </td>
      <td className="py-3 px-4">
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[patient.status])}>
          {patient.status}
        </span>
      </td>
    </tr>
  )
}
