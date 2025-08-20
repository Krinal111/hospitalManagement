import { useEffect, useState } from "react";
import { getMyAppointments, cancelAppointment } from "../services/bookingServices";

// Shadcn UI & Lucide Icons
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"; // Assuming you have the Select component
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, Video } from "lucide-react";

// Define a type for your appointment for better type safety
type Appointment = {
  _id: string;
  doctorId: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  startTime: string;
  endTime: string;
  mode: string;
  status: "booked" | "completed" | "cancelled" | "rescheduled";
};

export default function Dashboard() {
  const [when, setWhen] = useState("upcoming");
  const [status, setStatus] = useState("");
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await getMyAppointments({ when, status: status.trim()});
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [when, status]);

  const handleCancel = async (id: string) => {
    await cancelAppointment(id);
    loadAppointments();
  };

  const getStatusVariant = (status: Appointment['status']) => {
    switch (status) {
      case "booked":
        return "default";
      case "completed":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "rescheduled":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        {/* Filters */}
        <div className="flex items-center gap-2">
          <Select value={when} onValueChange={setWhen}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value=" ">Any Status</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-xl">Loading......</div>
      ) : items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((appt) => (
            <Card key={appt._id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {`Dr. ${appt.doctorId?.user?.firstName || ''} ${appt.doctorId?.user?.lastName || ''}`}
                  </CardTitle>
                  <Badge variant={getStatusVariant(appt.status)} className="capitalize">
                    {appt.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{new Date(appt.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>
                    {`${new Date(appt.startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })} - ${new Date(appt.endTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Video className="mr-2 h-4 w-4" />
                  <span className="capitalize">{appt.mode} Consultation</span>
                </div>
              </CardContent>
              {appt.status === "booked" && (
                <CardFooter>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Cancel Appointment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently cancel your appointment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCancel(appt._id)}>
                          Yes, Cancel
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium">No Appointments Found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or book a new appointment.
          </p>
        </div>
      )}
    </div>
  );
}

