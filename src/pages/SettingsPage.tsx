import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Bell, Shield, Palette, User } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { requestNotificationPermission, registerServiceWorker, showLocalNotification } from "@/services/notificationService"
import { toast } from "sonner"

export function SettingsPage() {
  const { user } = useAuthStore()
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState(true)
  const [appointmentReminders, setAppointmentReminders] = useState(true)
  const [emailNotifs, setEmailNotifs] = useState(false)

  const handleTestNotification = async () => {
    await registerServiceWorker()
    const granted = await requestNotificationPermission()
    if (granted) {
      showLocalNotification(
        "Test Notification",
        "Your push notifications are working correctly!"
      )
      toast.success("Test notification sent!")
    } else {
      toast.error("Notification permission denied. Please enable it in browser settings.")
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {user?.email?.[0].toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-medium">
                {user?.displayName ?? user?.email?.split("@")[0] ?? "Demo User"}
              </p>
              <p className="text-sm text-muted-foreground">{user?.email ?? "demo@healthcare.com"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
          <CardDescription>Manage how you receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notif">Push Notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Browser push notifications</p>
            </div>
            <Switch
              id="push-notif"
              checked={notifEnabled}
              onCheckedChange={setNotifEnabled}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="critical-alerts">Critical Patient Alerts</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Get notified for critical cases</p>
            </div>
            <Switch
              id="critical-alerts"
              checked={criticalAlerts}
              onCheckedChange={setCriticalAlerts}
              disabled={!notifEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="appt-reminders">Appointment Reminders</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Reminders 30 min before</p>
            </div>
            <Switch
              id="appt-reminders"
              checked={appointmentReminders}
              onCheckedChange={setAppointmentReminders}
              disabled={!notifEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notif">Email Notifications</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Daily summary via email</p>
            </div>
            <Switch
              id="email-notif"
              checked={emailNotifs}
              onCheckedChange={setEmailNotifs}
            />
          </div>

          <Button variant="outline" size="sm" onClick={handleTestNotification}>
            Send Test Notification
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
          <CardDescription>Session and access settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Extra security for your account</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Session Timeout</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Auto logout after 30 min inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Appearance</CardTitle>
          </div>
          <CardDescription>Customize the interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label>Compact View</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Reduce spacing in lists and tables</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
