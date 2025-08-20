import { useNavigate } from "react-router-dom";
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

  const validate = (values: ILoginRequest) => {
    const errors: Partial<Record<keyof ILoginRequest, string>> = {};
    if (!values.email) errors.email = "Email is required";
    if (!values.password) errors.password = "Password is required";
    return errors;
  };

  const { values, errors, loading, handleChange, handleSubmit } = useForm<ILoginRequest>({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values) => {
      await login(values); // API error will be caught & toast shown
      navigate("/"); 
    },
  });

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      {loginSchema.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChange={handleChange}
          error={errors[field.name]}
        />
      ))}
      <Button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

export default Login;
