import type { ComponentType } from "react";
import { Home, Calendar, ClipboardList } from "lucide-react";

export type MenuItem = {
  href: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
};

export const roleMenus: Record<string, MenuItem[]> = {
  // Admin has only one page right now: approve doctors
  admin: [
    {
      href: "/admin/pending-doctors",
      icon: ClipboardList,
      label: "Approve Doctors",
    },
  ],
  // Doctor-facing items map to the pages we actually ship today
  doctor: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/doctor/onboarding", icon: ClipboardList, label: "Onboarding" },
    { href: "/doctor/availability", icon: Calendar, label: "Add Availability" },
    {
      href: "/doctor/availability/recurring",
      icon: Calendar,
      label: "Recurring Availability",
    },
  ],
  // Patient-facing items aligned to discovery/booking flow we implemented
  patient: [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/discover", icon: Calendar, label: "Book Appointment" },
  ],
};

export function getMenu(role?: string | null): MenuItem[] {
  if (!role) return roleMenus.patient;
  return roleMenus[role] ?? roleMenus.patient;
}
