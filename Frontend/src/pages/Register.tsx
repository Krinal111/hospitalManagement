import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User2, Mail } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuthActions } from "../hooks/useAuth";
import { useForm } from "../hooks/useForm";

const formSchema = [
  { name: "firstName", placeholder: "First Name" },
  { name: "lastName", placeholder: "Last Name" },
  { name: "email", placeholder: "Email", type: "email" },
  { name: "password", placeholder: "Password", type: "password" },
  { name: "role", placeholder: "Role" },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuthActions();
  const [showPass, setShowPass] = useState(false);

  const validate = (values: Record<string, string>) => {
    const errors: Record<string, string> = {};
    if (!values.firstName) errors.firstName = "First name is required";
    if (!values.lastName) errors.lastName = "Last name is required";
    if (!values.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = "Invalid email";
    if (!values.password) errors.password = "Password is required";
    else if (values.password.length < 6) errors.password = "Password must be at least 6 characters";
    return errors;
  };

  const { values, errors, touched, loading, handleChange, handleBlur, handleSubmit } = useForm({
    initialValues: { firstName: "", lastName: "", email: "", password: "", role: "patient" },
    validate,
    onSubmit: async (values) => {
      await register(values);
      toast.success("Registered successfully! Please login.");
      navigate("/login");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-sm text-gray-600">Please enter your details to register</p>
        </div>

        <div className="mt-8 space-y-4">
          <Input
            label="first name"
            name="firstName"
            placeholder="First Name"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName ? errors.firstName : ""}
            rightIcon={<User2 className="text-gray-500" />}
          />
          <Input
            label="last name"
            name="lastName"
            placeholder="Last Name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName ? errors.lastName : ""}
            rightIcon={<User2 className="text-gray-500" />}
          />
          <Input
            label="email"
            name="email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ""}
            rightIcon={<Mail className="text-gray-500" />}
          />
          <Input
            label="password"
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? (errors as any).password : ""}
            rightIcon={
              <button type="button" onClick={() => setShowPass((s) => !s)} className="ml-2">
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            }
          />

          {/* Role selector */}
          <div>
            <label className="text-sm font-medium capitalize">role</label>
            <div className="mt-1">
              <select
                name="role"
                value={(values as any).role}
                onChange={handleChange as any}
                onBlur={handleBlur as any}
                className="w-full rounded border border-gray-300 p-2 text-sm"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Registering..." : "Register"}
        </Button>

        <p className="mt-3 text-center text-sm">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
