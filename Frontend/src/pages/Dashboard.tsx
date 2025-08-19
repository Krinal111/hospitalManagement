import { useEffect, useState } from "react";
import { getMyAppointments, cancelAppointment } from "../services/bookingServices";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const [when, setWhen] = useState("upcoming");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments({ when, status: status || undefined });
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when, status]);

  const onCancel = async (id: string) => {
    await cancelAppointment(id);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex gap-2">
        <select value={when} onChange={(e) => setWhen(e.target.value)} className="border rounded px-2 py-1">
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Any status</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{a?.doctorId?.user ? `${a.doctorId.user.firstName} ${a.doctorId.user.lastName}` : "Doctor"}</div>
                <div className="text-sm">{new Date(a.startTime).toLocaleString()} - {new Date(a.endTime).toLocaleTimeString()}</div>
                <div className="text-sm capitalize">{a.mode}</div>
                <div className="text-sm">Status: {a.status}</div>
              </div>
              {a.status === "booked" && (
                <div className="flex gap-2">
                  <Button onClick={() => onCancel(a._id)}>Cancel</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


