// import { useState } from "react";
// import { Link } from "react-router-dom";



// function LoginForm() {
//   // Success / Failure Toast
//   const [toast, setToast] = useState(null);

//   // Display Toast Message
//   const showToast = (type, message) => {
//     setToast({ type, message });
//     setTimeout(() => {
//       setToast(null);
//     }, 3000);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData(e.target);

//     const data = {
//       username: formData.get("username"),
//       password: formData.get("password"),
//     };

//     // simple required-field validation
//      if (!data.username || !data.password) {
//       showToast("error", "Please fill in all required fields.");
//       return;
//     }

//     // TODO: send form to your API here
//     console.log("Form submitted:");

//     showToast("success", "Login successful!");
    
//     e.target.reset();
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
//       {/* Toast */}
      

//       {/* Main Form Card */}
//       <form 
//        onSubmit={handleSubmit}
//         className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
//         <h2 className="text-2xl font-bold text-slate-800 text-center">
//           Login
//         </h2>

//         {/* Username */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-slate-700">
//             Username
//           </label>
//           <input
//             type="text"
//             name="username"
//             placeholder="Enter username"
//             className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
//           />
//         </div>

//         {/* Password */}
//         <div className="space-y-1">
//           <label className="block text-sm font-medium text-slate-700">
//             Password
//           </label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Enter password"
//             className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
//           />
//         </div>

//         {/* Signup link */}
//         <p className="text-sm text-end text-slate-600">
//           Don&apos;t have an account?{" "}
//           <Link to="/signup" className="text-emerald-600 hover:underline font-medium">
//             Sign up
//           </Link>
//         </p>

//         {/* Login Button */}
//         <button
//           type="submit"
//             className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold
//                      hover:bg-emerald-700 transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

// export default LoginForm;


import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function LoginForm() {
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form values
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  // Errors
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation logic
  const validate = (field, value) => {
    switch (field) {
      case "email":
        if (!value) return "Email is required";
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Enter a valid email";
        return "";

      case "password":
        if (!value) return "Password is required";
        if (value.length < 8)
          return "Password must be at least 8 characters";
        return "";

      default:
        return "";
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validate(name, value),
    }));

    setApiError("");
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Final validation
    const newErrors = {};
    Object.keys(values).forEach((field) => {
      const error = validate(field, values[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      console.log("Login success:", res.data);

      // TODO:
      // - store token
      // - navigate("/dashboard")

    } catch (err) {
      if (err.response) {
        const { message, errors } = err.response.data;

        if (errors) {
          setErrors((prev) => ({
            ...prev,
            ...errors,
          }));
        }

        setApiError(message || "Login failed");
      } else {
        setApiError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
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
                d="M16 11V7a4 4 0 00-8 0v4M5 11h14v10H5z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600">Login to your account</p>
        </div>

        {/* Global API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
            {apiError}
          </div>
        )}

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
                } focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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
                className={`w-full pl-10 pr-12 py-2 rounded-xl border-2
                ${
                  errors.password ? "border-red-500" : "border-slate-200"
                } focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
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
                      d="M3 3l18 18"
                    />
                  </svg>
                ) : (
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

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading || Object.values(errors).some(Boolean)}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-emerald-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup link */}
        <p className="text-center mt-2 text-slate-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-emerald-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
