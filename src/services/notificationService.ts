// Service for handling browser notifications via service worker

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications")
    return false
  }

  if (Notification.permission === "granted") {
    return true
  }

  const permission = await Notification.requestPermission()
  return permission === "granted"
}

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service workers not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js")
    console.log("Service worker registered:", registration.scope)
    return registration
  } catch (err) {
    console.error("Service worker registration failed:", err)
    return null
  }
}

export function showLocalNotification(title: string, body: string, icon = "/vite.svg") {
  if (Notification.permission !== "granted") return

  // Try to use service worker for notification if available
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_NOTIFICATION",
      title,
      body,
      icon,
    })
  } else {
    // Fallback to basic Notification API
    new Notification(title, { body, icon })
  }
}

export function schedulePatientReminder(patientName: string, delayMs = 5000) {
  setTimeout(() => {
    showLocalNotification(
      "Patient Reminder",
      `Follow-up required for patient: ${patientName}`,
    )
  }, delayMs)
}
