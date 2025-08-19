import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { addAvailability } from "../services/doctorServices";
import { toast } from "react-hot-toast";

export default function DoctorAvailability() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState("");
  const [duration, setDuration] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAvailability({ startTime: start, endTime: end, consultationMode: mode as any, slotDuration: duration ? Number(duration) : undefined });
      toast.success("Slot created");
      setStart(""); setEnd(""); setMode(""); setDuration("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Add Availability</h2>
      <form onSubmit={submit} className="space-y-4">
        <Input label="start time" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        <Input label="end time" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
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
        <Input label="slot duration (minutes) - optional" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </form>
    </div>
  );
}


