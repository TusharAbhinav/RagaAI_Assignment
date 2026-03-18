import { create } from "zustand"
import type { Notification } from "@/types"

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  notifications: [
    {
      id: "1",
      title: "Critical Patient Alert",
      message: "Patient Robert Thompson (ICU) requires immediate attention.",
      type: "error",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      title: "Appointment Reminder",
      message: "Dr. Sarah Chen has 3 appointments starting in 30 minutes.",
      type: "info",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      title: "Lab Results Ready",
      message: "Lab results for patient Nina Patel are now available.",
      type: "success",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
    },
  ],
  unreadCount: 2,

  addNotification: (n) => {
    const newNotif: Notification = {
      ...n,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },

  markAsRead: (id) => {
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      }
    })
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },

  removeNotification: (id) => {
    set((state) => {
      const updated = state.notifications.filter((n) => n.id !== id)
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      }
    })
  },
}))
