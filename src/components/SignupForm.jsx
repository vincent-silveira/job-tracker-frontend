import { useState } from "react";
import { Link } from "react-router-dom";



function SignupForm() {
  // Success / Failure Toast
  const [toast, setToast] = useState(null);

  // Display Toast Message
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    // simple required-field validation
     if (!data.username || !data.password) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    // TODO: send form to your API here
    console.log("Form submitted:");

    showToast("success", "Signup successful!");
    
    e.target.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
            <span>{toast.message}</span>
            <button
              type="button"
              className="ml-2 text-white/80 hover:text-white"
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <form 
       onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          Signup
        </h2>

        {/* Username */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
          />
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
          />
        </div>

        {/* Login link */}
        <p className="text-sm text-end text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-600 hover:underline font-medium">
            Login
          </Link>
        </p>

        {/* Signup Button */}
        <button
          type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold
                     hover:bg-emerald-700 transition"
        >
          SignUp
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
