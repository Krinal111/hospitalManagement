import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { getDoctorSlots } from "../services/doctorServices";
import { lockSlot } from "../services/bookingServices";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Calendar from "../components/Calender"; 
type CalendarCell = { date: Date; inCurrentMonth: boolean; count: number };

export default function SlotPicker() {
  const { doctorId } = useParams();
  const [monthStart, setMonthStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0,0,0,0);
    return d;
  });
  const [mode, setMode] = useState<string>("");
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!doctorId) return;
      setLoading(true);
      try {
        const data = await getDoctorSlots(doctorId);
        setSlots(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [doctorId]);

  const cells: CalendarCell[] = useMemo(() => {
    const first = new Date(monthStart);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay()); // Sunday

    const result: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const inCurrentMonth = d.getMonth() === monthStart.getMonth();
      const count = slots.filter((s) => {
        if (mode && mode !== "anymode" && s.consultationMode !== mode) return false;
        const sd = new Date(s.startTime);
        return sd.getFullYear() === d.getFullYear() &&
               sd.getMonth() === d.getMonth() &&
               sd.getDate() === d.getDate();
      }).length;
      result.push({ date: d, inCurrentMonth, count });
    }
    return result;
  }, [monthStart, slots, mode]);

  const daySlots = useMemo(() => {
    return slots.filter((s) => {
      if (mode && mode !== "anymode" && s.consultationMode !== mode) return false;
      const sd = new Date(s.startTime);
      return sd.toDateString() === selectedDate.toDateString();
    }).sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [slots, selectedDate, mode]);

  const changeMonth = (delta: number) => {
    const m = new Date(monthStart);
    m.setMonth(m.getMonth() + delta);
    setMonthStart(m);
  };

  const onPickSlot = async (slotId: string) => {
    try {
      await lockSlot(slotId);
      toast.success("Slot locked for 5 minutes");
      navigate(`/book/${slotId}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to lock slot");
    }
  };

  const monthLabel = monthStart.toLocaleString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => changeMonth(-1)}>&larr;</Button>
          <div className="text-lg font-semibold">{monthLabel}</div>
          <Button variant="outline" onClick={() => changeMonth(1)}>&rarr;</Button>
        </div>
        <div>
          <Select value={mode} onValueChange={(v) => setMode(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Any mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anymode">Any mode</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="in_person">In-person</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Calendar extracted */}
          <Calendar
            cells={cells}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Slots list */}
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="font-medium">
                {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-xs text-gray-500">{daySlots.length} slots</div>
            </div>
            <div className="space-y-2 max-h-[480px] overflow-auto pr-1">
              {daySlots.length === 0 ? (
                <div className="text-sm text-gray-500">No slots available for this day.</div>
              ) : (
                daySlots.map((s) => (
                  <div key={s._id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                    <div>
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
                      {new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <span className="ml-2 text-xs capitalize text-gray-500">
                        {s.consultationMode.replace('_', ' ')}
                      </span>
                    </div>
                    {s.status === 'available' ? (
                      <Button size="sm" onClick={() => onPickSlot(s._id)}>Pick</Button>
                    ) : (
                      <span className="text-xs uppercase text-gray-400">{s.status}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
