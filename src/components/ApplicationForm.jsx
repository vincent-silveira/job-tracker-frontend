import { useState } from "react";

function ApplicationForm() {
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
      company: formData.get("company"),
      role: formData.get("role"),
      appliedDate: formData.get("appliedDate"),
      source: formData.get("source"),
      status: formData.get("status"),
    };

    // simple required-field validation
     if (!data.company || !data.role || !data.source || !data.status) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    // TODO: send form to your API here
    console.log("Form submitted:");

    showToast("success", "Application saved successfully!");
    
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
          Add Job Application
        </h2>

        {/* Company */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            placeholder="Enter company name"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0"
          />
        </div>

        {/* Role */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Role
          </label>
          <select
            name="role"
            defaultValue=""
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white
                       focus:border-emerald-500 focus:outline-none
                       focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 appearance-none"
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
            <option value="data-analyst">Data Analyst</option>
            <option value="product-manager">Product Manager</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Applied Date */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Applied Date
          </label>
          <input
            type="date"
            name="applied-date"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 "
          />
        </div>

        {/* Source */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Source
          </label>
          <select
            name="source"
            defaultValue=""
            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white
                       focus:border-emerald-500 focus:outline-none
                       focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 appearance-none"
          >
            <option value="" disabled>
              Select source
            </option>
            <option value="linkedin">LinkedIn</option>
            <option value="company-site">Company Website</option>
            <option value="referral">Referral</option>
            <option value="job-board">Job Board (Indeed, etc.)</option>
            <option value="recruiter">Recruiter</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            name="status"
            defaultValue=""
            className="w-full px-4 py-2  rounded-lg border border-slate-300 bg-white
                       focus:border-emerald-500 focus:outline-none
                       focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 appearance-none"
          >
            <option value="" disabled>
              Select status
            </option>
            <option value="applied">Applied</option>
            <option value="phone-screen">Phone Screen</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
        >
          Save Application
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;
