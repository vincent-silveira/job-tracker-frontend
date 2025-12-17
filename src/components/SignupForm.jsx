import { useState } from "react";
import { authAPI } from "../services/api";
import { Link } from "react-router-dom";

function SignupForm() {
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    terms: false, // frontend only
  });

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast("error", "Please fill all required fields.");
      return;
    }

    if (!formData.terms) {
      showToast("error", "You must accept the terms and conditions.");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ send only backend-expected fields
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const data = await authAPI.register(payload);

      if (data.success) {
        showToast("success", "Account created! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        showToast("error", data.message || "Signup failed");
      }
    } catch (err) {
  console.log("Signup error:", err);

  if (err?.errors) {
    // backend validation errors
    const messages = Object.values(err.errors).join(", ");
    showToast("error", messages);
  } else if (err?.message) {
    showToast("error", err.message);
  } else {
    showToast("error", "Signup failed. Please try again.");
  }
}finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-4"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Create Account
          </h1>
          <p className="text-slate-600">
            Start tracking your job applications today
          </p>
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-slate-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            className="mt-1"
          />
          <span className="ml-2 text-sm text-slate-600">
            I agree to the Terms & Privacy Policy
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-emerald-700 transition"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>

        {/* Login link */}
        <p className="text-center text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 font-medium">
            Login
          </Link>
        </p>

        {/* Toast */}
        {toast && (
          <p
            className={`text-center text-sm ${
              toast.type === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {toast.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default SignupForm;
