import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { lockSlot, confirmBooking } from "../services/bookingServices";

export default function BookSlot() {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const [lockedUntil, setLockedUntil] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"lock" | "confirm" | "done">("lock");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const doLock = async () => {
      try {
        const res = await lockSlot(slotId!);
        setLockedUntil(res.lockedUntil);
        setStep("confirm");
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to lock slot");
      }
    };
    if (slotId) doLock();
  }, [slotId]);

  const onConfirm = async () => {
    try {
      await confirmBooking(slotId!, otp || "");
      setStep("done");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to confirm booking");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {step === "lock" && <div>Locking your slot...</div>}
      {step === "confirm" && (
        <div className="space-y-3">
          <div>Slot locked until: {lockedUntil && new Date(lockedUntil).toLocaleTimeString()}</div>
          <Input placeholder="Enter OTP (123456)" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <Button onClick={onConfirm}>Confirm Booking</Button>
        </div>
      )}
      {step === "done" && <div>Booking confirmed!</div>}
    </div>
  );
}


