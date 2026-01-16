import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { addRecurringAvailability } from "../services/doctorServices";
import { toast } from "react-hot-toast";

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function DoctorRecurringAvailability() {
  // weekly recurrence form
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [startTimeOfDay, setStartTimeOfDay] = useState("");
  const [endTimeOfDay, setEndTimeOfDay] = useState("");
  const [mode, setMode] = useState("");
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addRecurringAvailability({
        fromDate,
        toDate,
        daysOfWeek,
        startTime: startTimeOfDay,
        endTime: endTimeOfDay,
        consultationMode: mode as any,
        slotDuration: duration,
      });
      toast.success("Weekly recurring slots created");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Weekly Recurring Availability</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="from date" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <Input label="to date" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">days of week</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {days.map((d) => (
              <Button key={d} type="button" variant={daysOfWeek.includes(d) ? "default" : "outline"} onClick={() => setDaysOfWeek((prev) => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])}>{d}</Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input label="start time of day" type="time" value={startTimeOfDay} onChange={(e) => setStartTimeOfDay(e.target.value)} />
          <Input label="end time of day" type="time" value={endTimeOfDay} onChange={(e) => setEndTimeOfDay(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">mode</label>
          <div className="mt-1">
            <Select value={mode} onValueChange={(val) => setMode(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in_person">In-person</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Input label="slot duration (minutes)" type="number" value={duration.toString()} onChange={(e) => setDuration(Number(e.target.value || 0))} />
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </form>
    </div>
  );
}



