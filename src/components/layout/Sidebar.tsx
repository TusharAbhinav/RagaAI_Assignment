import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Activity,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { signOut } from "firebase/auth"
import { auth } from "@/config/firebase"
import { toast } from "sonner"

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/patients", icon: Users, label: "Patients" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      logout()
      toast.success("Logged out successfully")
    } catch {
      logout()
    }
  }

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "User"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-56 flex flex-col",
          "bg-sidebar text-sidebar-foreground",
          "transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold tracking-tight">HealthCare</span>
          </div>
          <button
            className="lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user section */}
        <div className="px-3 pb-5 pt-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 mb-1">
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{displayName}</p>
              <p className="text-xs text-sidebar-foreground/40 truncate">
                {user?.email ?? "demo@healthcare.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-white/5 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
