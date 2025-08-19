import { useEffect, useState } from "react";
import { getPendingDoctors, approveDoctor } from "../services/doctorServices";
import { Button } from "../components/ui/button";
import { toast } from "react-hot-toast";

export default function AdminPendingDoctors() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPendingDoctors();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onApprove = async (id: string) => {
    try {
      await approveDoctor(id);
      toast.success("Approved");
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-3">
      <h2 className="text-xl font-semibold">Pending Doctors</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        items.map((d) => (
          <div key={d._id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{d.user?.firstName} {d.user?.lastName}</div>
              <div className="text-sm">{d.specializations?.join(", ")}</div>
            </div>
            <Button onClick={() => onApprove(d._id)}>Approve</Button>
          </div>
        ))
      )}
    </div>
  );
}


