import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { onboardingDoctor } from "../services/doctorServices";
import { toast } from "react-hot-toast";

export default function DoctorOnboarding() {
  const [specializations, setSpecializations] = useState<string>("");
  const [modes, setModes] = useState<string[]>([]);
  const [fee, setFee] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const toggleMode = (val: string) => {
    setModes((prev) => (prev.includes(val) ? prev.filter((m) => m !== val) : [...prev, val]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onboardingDoctor({
        specializations: specializations.split(",").map((s) => s.trim()).filter(Boolean),
        modes: modes as any,
        consultationFee: fee ? Number(fee) : undefined,
      });
      toast.success("Profile submitted!");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Doctor Onboarding</h2>
      <form onSubmit={submit} className="space-y-4">
        <Input label="specializations (comma separated)" value={specializations} onChange={(e) => setSpecializations(e.target.value)} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Modes</label>
          <div className="flex gap-2">
            <Button type="button" variant={modes.includes("online") ? "default" : "outline"} onClick={() => toggleMode("online")}>Online</Button>
            <Button type="button" variant={modes.includes("in_person") ? "default" : "outline"} onClick={() => toggleMode("in_person")}>In-person</Button>
          </div>
        </div>
        <Input label="consultation fee" type="number" value={fee} onChange={(e) => setFee(e.target.value)} />
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
      </form>
    </div>
  );
}


