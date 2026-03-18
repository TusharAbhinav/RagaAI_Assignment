import { useRef, useEffect, useState } from "react"
import { Menu, Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotificationStore } from "@/store/notificationStore"
import { useAuthStore } from "@/store/authStore"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "@/lib/dateUtils"

interface NavbarProps {
  onMenuClick: () => void
  title: string
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore()
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Demo User"
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
      <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-base font-semibold text-gray-800 hidden sm:block">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        {/* Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-medium">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border bg-white shadow-lg">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <span className="text-sm font-semibold">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-primary hover:underline">
                      Mark all read
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b last:border-0",
                        !n.read && "bg-blue-50/50"
                      )}
                    >
                      <span className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", !n.read ? "bg-primary" : "bg-gray-200")} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(n.timestamp)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-border" />

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold select-none">
              {initials}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs text-green-500 mt-0.5">Online</p>
          </div>
        </div>
      </div>
    </header>
  )
}
