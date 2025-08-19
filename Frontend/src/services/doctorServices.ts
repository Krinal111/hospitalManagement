import { axiosInstance } from "./axiosInstance";

export interface DoctorDiscoveryQuery {
  specialization?: string;
  mode?: "online" | "in_person";
  date?: string; // ISO date
}

export interface DoctorDiscoveryResult {
  doctorId: string;
  name: string;
  specializations: string[];
  modes: ("online" | "in_person")[];
  consultationFee?: number;
  nextAvailableSlot: {
    slotId: string;
    startTime: string;
    endTime: string;
    mode: "online" | "in_person";
  };
}

export async function discoverDoctors(params: DoctorDiscoveryQuery) {
  const res = await axiosInstance.get<DoctorDiscoveryResult[]>(
    "/doctor/discover",
    { params }
  );
  return res.data;
}

export async function getDoctorSlots(doctorId: string) {
  const res = await axiosInstance.get(`/availability/${doctorId}`);
  return res.data as Array<{
    _id: string;
    startTime: string;
    endTime: string;
    consultationMode: "online" | "in_person";
    status: string;
  }>;
}

// Doctor-protected endpoints
export async function onboardingDoctor(payload: {
  specializations: string[];
  modes: ("online" | "in_person")[];
  consultationFee?: number;
}) {
  const res = await axiosInstance.post("/doctor/onboarding", payload);
  return res.data;
}

export async function addAvailability(payload: {
  startTime: string;
  endTime: string;
  consultationMode: "online" | "in_person";
  slotDuration?: number;
}) {
  const res = await axiosInstance.post("/availability/add", payload);
  return res.data;
}

export async function addRecurringAvailability(payload: {
  // legacy single-day
  dayOfWeek?: string;
  startTime: string; // time or datetime
  endTime: string;   // time or datetime
  consultationMode: "online" | "in_person";
  slotDuration: number;
  // new weekly recurrence
  fromDate?: string; // yyyy-mm-dd
  toDate?: string;   // yyyy-mm-dd
  daysOfWeek?: string[]; // ["Monday",...]
}) {
  const res = await axiosInstance.post("/availability/add-recurring", payload);
  return res.data;
}

// Admin endpoints
export async function getPendingDoctors() {
  const res = await axiosInstance.get("/admin/get-pending-doctors");
  return res.data as Array<any>;
}

export async function approveDoctor(doctorId: string) {
  const res = await axiosInstance.patch(`/admin/${doctorId}/approve`);
  return res.data;
}

export async function getMyDoctorProfile() {
  const res = await axiosInstance.get(`/doctor/me`);
  return res.data as { doctorId: string; doctor: any };
}

