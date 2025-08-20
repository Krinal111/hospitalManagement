import { useEffect, useState } from "react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { discoverDoctors } from "../services/doctorServices";
import type { DoctorDiscoveryResult } from "../services/doctorServices";
import { useNavigate } from "react-router-dom";

export default function DoctorDiscovery() {
  const [specialization, setSpecialization] = useState("");
  const [mode, setMode] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DoctorDiscoveryResult[]>([]);
  const navigate = useNavigate();

  const runSearch = async () => {
    setLoading(true);
    try {
      const data = await discoverDoctors({
        specialization: specialization || undefined,
        mode: (mode as any) || undefined,
        date: date || undefined,
      });
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          placeholder="Specialization"
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />
        <Select value={mode} onValueChange={(val) => setMode(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Any mode" />
          </SelectTrigger>
          <SelectContent>
           
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="in_person">In-person</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Button onClick={runSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((d) => (
          <Card
            key={d.doctorId}
            className="p-4 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold text-lg">{d.name || "Doctor"}</div>
              <div className="text-sm text-gray-600">
                {d.specializations?.join(", ")}
              </div>
              <div className="text-sm">Fee: {d.consultationFee ?? "N/A"}</div>
              <div className="text-sm">
                Next: {new Date(d.nextAvailableSlot.startTime).toLocaleString()}{" "}
                ({d.nextAvailableSlot.mode})
              </div>
            </div>
            <Button
              onClick={() =>
                navigate(`/doctor/calendar/${d.doctorId}`)
              }
            >
              Choose Slot
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
