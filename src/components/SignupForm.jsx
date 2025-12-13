import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function SignupForm() {
  // Password
  const [showPassword, setShowPassword] = useState(false);

  // Values
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    terms: false,
  });

  // Errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  const [loading, setLoading] = useState(false);

  // Validation Logic
  const validate = (field, value) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 3) return "Name must be at least 3 characters";
        return "";

      case "email":
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";

      case "terms":
        if (!value) return "You must accept the terms";
        return "";

      default:
        return "";
    }
  };

  // Handle change in inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, fieldValue),
    }));

    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(values).forEach((field) => {
      const error = validate(field, values[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log("Signup success:", res.data);

      // ✅ redirect / toast
      // navigate("/login");
    } catch (err) {
      // Axios error handling
      if (err.response) {
        const { message, errors } = err.response.data;

        // Field-level errors
        if (errors) {
          setErrors((prev) => ({
            ...prev,
            ...errors,
          }));
        }

        // Global error
        setApiError(message || "Signup failed");
      } else {
        setApiError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      {/* Toast */}

      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Create Account
          </h1>
          <p className="text-slate-600">
            Start tracking your job applications today
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
            {apiError}
          </div>
        )}
        {/* Name */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            Full Name
          </label>

          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 
                ${errors.name ? "border-red-500" : "border-slate-300"} 
                focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition-all duration-200 placeholder:text-slate-400`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            Email Address
          </label>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 
                ${
                  errors.email ? "border-red-500" : "border-slate-200"
                } focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 placeholder:text-slate-400`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-2 rounded-xl border-2  
                ${
                  errors.password ? "border-red-500" : "border-slate-200"
                } focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 placeholder:text-slate-400`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  // Eye off
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19
       c-4.478 0-8.268-2.943-9.542-7
       a9.965 9.965 0 012.042-3.368"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6.1 6.1A9.956 9.956 0 0112 5
       c4.478 0 8.268 2.943 9.542 7
       a9.964 9.964 0 01-4.293 5.774"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
                  // Eye
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Accept */}
        <div>
          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              checked={values.terms}
              onChange={handleChange}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
            />
            <label className="ml-2 text-sm text-slate-600">
              I agree to the{" "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-500 mt-1">{errors.terms}</p>
          )}
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading || Object.values(errors).some(Boolean)}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold
             disabled:opacity-50 disabled:cursor-not-allowed
             hover:bg-emerald-700 transition"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="text-center mt-2 text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;
