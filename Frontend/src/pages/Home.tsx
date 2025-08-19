import { type FC } from "react";
import { Link } from "react-router-dom";

const Home: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome</h1>
        <div className="space-x-3">
          <Link className="underline" to="/discover">Discover Doctors</Link>
          <Link className="underline" to="/dashboard">My Appointments</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
