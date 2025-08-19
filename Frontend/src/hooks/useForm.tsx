import { useState } from "react";
import { toast } from "react-hot-toast";

interface UseFormProps<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Live validation on change
    if (validate) {
      const validationErrors = validate({ ...values, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name as keyof T] }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      const validationErrors = validate(values);
      setErrors((prev) => ({ ...prev, [name]: validationErrors[name as keyof T] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitted(true);
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }

    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      // Show API errors using toast
      if (err?.response?.data?.message) toast.error(err.response.data.message);
      else if (err?.message) toast.error(err.message);
      else toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, touched, submitted, loading, handleChange, handleBlur, handleSubmit, setValues, setErrors };
};
