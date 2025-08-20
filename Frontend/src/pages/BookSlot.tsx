import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { lockSlot, confirmBooking } from "../services/bookingServices";

export default function BookSlot() {
  const { slotId } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"lock" | "confirm" | "done">("lock");
  const [error, setError] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    const doLock = async () => {
      try {
        const res = await lockSlot(slotId as string);
        const until = new Date(res.lockedUntil);
        setStep("confirm");

        const diff = Math.max(0, Math.floor((until.getTime() - Date.now()) / 1000));
        setRemainingTime(diff);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to lock slot");
      }
    };
    if (slotId) doLock();
  }, [slotId]);

  useEffect(() => {
    if (step !== "confirm" || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setError("Slot lock expired, please rebook.");
          navigate("/"); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, remainingTime, navigate]);

  const onConfirm = async () => {
    try {
      await confirmBooking(slotId!, otp || "");
      setStep("done");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to confirm booking");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-xl space-y-4 text-center">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {step === "lock" && <div className="text-gray-600">🔒 Locking your slot...</div>}

      {step === "confirm" && (
        <div className="space-y-4">
          <div className="text-lg">
            ⏳ Time left: {" "}
            <span className="font-semibold text-blue-600">
              {Math.floor(remainingTime / 60)}m {remainingTime % 60}s
            </span>
          </div>

          <Input
            placeholder="Enter OTP (123456)"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="text-center"
          />
          <Button onClick={onConfirm} disabled={remainingTime <= 0} className="w-full">
            Confirm Booking
          </Button>
        </div>
      )}

      {step === "done" && <div className="text-green-600 text-lg">✅ Booking confirmed!</div>}
    </div>
  );
}
