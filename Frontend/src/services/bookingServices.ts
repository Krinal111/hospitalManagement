import { axiosInstance } from "./axiosInstance";

export async function lockSlot(slotId: string) {
  const res = await axiosInstance.post("/booking/lock", { slotId });
  return res.data as { message: string; slotId: string; lockedUntil: string };
}

export async function confirmBooking(slotId: string, otp: string) {
  const res = await axiosInstance.post("/booking/confirm", { slotId, otp });
  return res.data;
}

export async function getMyAppointments(params: { when?: string; status?: string }) {
  const res = await axiosInstance.get("/booking/me", { params });
  return res.data as any[];
}

export async function cancelAppointment(appointmentId: string) {
  const res = await axiosInstance.post(`/booking/${appointmentId}/cancel`);
  return res.data;
}

export async function rescheduleAppointment(appointmentId: string, newSlotId: string) {
  const res = await axiosInstance.post(`/booking/${appointmentId}/reschedule`, { newSlotId });
  return res.data;
}

