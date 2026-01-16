import { type FC } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger } from  '../components/ui/tabs';

const Home: FC = () => {


  return (
    <div className="flex min-h-screen min-w-[80vh] flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome to HealthConnect
          </CardTitle>
          <CardDescription>
            Your health, managed. Select an option to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
      
          <Tabs className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            
              <TabsTrigger value="discover" asChild>
                <Link to="/discover">Discover Doctors</Link>
              </TabsTrigger>
              <TabsTrigger value="dashboard" asChild>
                <Link to="/dashboard">My Appointments</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;