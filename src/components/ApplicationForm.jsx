import { useEffect, useState } from "react";
import api from "../api/axios"
import { roles } from "../api/temp-option-values/role-data";
import { jobSources } from "../api/temp-option-values/source-data";
import { applicationStatuses } from "../api/temp-option-values/status-data";
import { useNavigate } from "react-router-dom";


const initialValues = {
  company: "",
  role: "",
  appliedDate: "",
  deadline: "",
  source: "",
  status: "",
};

function ApplicationForm({ initialData }) {

  const navigate = useNavigate();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Edit mode
  useEffect(() => {
    if (initialData) {
      setValues(initialData);
    }
  }, [initialData]);

  // Validation
  const validate = (name, value) => {
    switch (name) {
      case "company":
        if (!value.trim()) return "Company name is required";
        return "";

      case "role":
        if (!value) return "Role is required";
        return "";

      case "appliedDate":
        if (!value) return "Applied date is required";
        return "";

      case "deadline":
        if (!value) return "Deadline is required";
        return "";

      case "source":
        if (!value) return "Source is required";
        return "";

      case "status":
        if (!value) return "Status is required";
        return "";

      default:
        return "";
    }
  };

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

      var response;
      if (initialData?.id) {
        // EDIT
        await api.put(`/applications/${initialData.id}`, values);
      } else {
        // ADD
        console.log("Add req sent");
        console.log({...values, userId: 1});
        response = await api.post("/api/jobs", {...values, userId: 1});
        if(response.data.success){
          navigate("/login");
        }
      }

      // Optional: reset form in add mode
      if (!initialData) {
        setValues(initialValues);
      }

      // Optional callback
      // onSubmit?.();
    } catch (err) {
      if (err.response) {
        const { message, errors } = err.response.data;

        if (errors) {
          setErrors((prev) => ({
            ...prev,
            ...errors,
          }));
        }
        setApiError(err.response.data.message || "Submission failed");
      } else {
        setApiError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const placeholderStyle = (value) =>
    value ? "text-slate-700" : "text-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      {/* Main Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        {/* Title */}
        <div className="text-center mb-8 mt-8">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {initialData ? "Edit" : "Add"} Job Application
          </h1>
          <p className="text-slate-600">Track your job search journey</p>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
            {apiError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Company Name
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  placeholder="Enter company name"
                  className="w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 placeholder:text-slate-400"
                />
              </div>
            </div>
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Job Role
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 appearance-none cursor-pointer  ${placeholderStyle(
                    values.role
                  )}`}
                >
                  <option value="" disabled hidden>
                    Select role
                  </option>

                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role}</p>
            )}
          </div>

          {/* Applied Date */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Applied Date
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="date"
                  name="appliedDate"
                  value={values.appliedDate}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200
                ${placeholderStyle(values.appliedDate)}`}
                />
              </div>
            </div>
            {errors.appliedDate && (
              <p className="text-sm text-red-500">{errors.appliedDate}</p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Deadline
              {/* <span className="text-slate-400 font-normal">(Optional)</span> */}
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <input
                  type="date"
                  name="deadline"
                  value={values.deadline}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200   
                  ${placeholderStyle(values.deadline)}`}
                />
              </div>
            </div>
            {errors.deadline && (
              <p className="text-sm text-red-500">{errors.deadline}</p>
            )}
          </div>

          {/* Source */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Source
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <select
                  name="source"
                  value={values.source}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 appearance-none cursor-pointer   
                  ${placeholderStyle(values.source)}`}
                >
                  <option value="" disabled hidden>
                    Select source
                  </option>

                  {jobSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.source && (
              <p className="text-sm text-red-500">{errors.source}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Application Status
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <select
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl border-2 border-slate-200 bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200 appearance-none cursor-pointer ${placeholderStyle(
                    values.status
                  )}`}
                >
                  <option value="" disabled hidden>
                    Select status
                  </option>
                  {applicationStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || Object.values(errors).some(Boolean)}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold
             disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Update Application"
            : "Save Application"}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;
