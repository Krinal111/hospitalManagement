import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User2, Lock } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useForm } from "../hooks/useForm";
import { useAuthActions } from "../hooks/useAuth";
import type { ILoginRequest } from "../types/userTypes";

const loginSchema = [
  { name: "email", placeholder: "Email", type: "email" },
  { name: "password", placeholder: "Password", type: "password" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const [showPass, setShowPass] = useState(false);

  const validate = (values: ILoginRequest) => {
    const errors: Partial<Record<keyof ILoginRequest, string>> = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const { values, errors, touched, loading, handleChange, handleBlur, handleSubmit } = useForm<ILoginRequest>({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values) => {
      await login(values); // API error will be caught & toast shown
      navigate("/"); 
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-md">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-bold">Log In To Your Account</h1>
          <p className="text-sm text-gray-600">Welcome back!! Please Enter Your Details</p>
        </div>

        <div className="mt-8 space-y-4">
          <Input
            label="username"
            name="email"
            type="email"
            placeholder="username"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ""}
            rightIcon={<User2 className="text-gray-500" />}
          />

          <Input
            label="password"
            name="password"
            type={showPass ? "text" : "password"}
            placeholder="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ""}
            rightIcon={
              <button type="button" onClick={() => setShowPass((s) => !s)} className="ml-2">
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2"><input type="checkbox" /> Remember Me</label>
            <Link to="#" className="underline">Forgot Password?</Link>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="mt-6 w-full">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
