import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobAPI, authAPI } from "../services/api";

function ApplicationForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // id exists only for edit
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    appliedDate: "",
    source: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      if (id) {
        setLoading(true);
        try {
          const user = authAPI.getCurrentUser();
          const jobs = await jobAPI.getUserJobs(user.id);
          const jobToEdit = jobs.find((j) => j.id.toString() === id);
          if (jobToEdit) {
            setFormData({
              company: jobToEdit.company || "",
              role: jobToEdit.role || "",
              appliedDate: jobToEdit.appliedDate?.split("T")[0] || "",
              source: jobToEdit.source || "",
              status: jobToEdit.status || "",
            });
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await jobAPI.updateJob(id, formData);
        alert("Job updated successfully!");
      } else {
        await jobAPI.createJob(formData);
        alert("Job added successfully!");
      }
      navigate("/dashboard", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save application");
    }
  };

  if (loading) return <p>Loading job...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-slate-800 text-center">
          {id ? "Edit Job Application" : "Add Job Application"}
        </h2>

        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          placeholder="Company"
          required
          className="w-full px-4 py-2 rounded-lg border"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border"
        >
          <option value="">Select Role</option>
          <option value="FRONTEND">Frontend Developer</option>
          <option value="BACKEND">Backend Developer</option>
          <option value="FULLSTACK">Full Stack Developer</option>
          <option value="DATA_ANALYST">Data Analyst</option>
          <option value="OTHER">Other</option>
        </select>
        <input
          type="date"
          name="appliedDate"
          value={formData.appliedDate}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border"
        />
        <select
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border"
        >
          <option value="">Select Source</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="COMPANY_SITE">Company Website</option>
          <option value="REFERRAL">Referral</option>
          <option value="JOB_BOARD">Job Board</option>
          <option value="RECRUITER">Recruiter</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg border"
        >
          <option value="">Select Status</option>
          <option value="APPLIED">Applied</option>
          <option value="PHONE_SCREEN">Phone Screen</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="ON_HOLD">On Hold</option>
        </select>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700"
        >
          {id ? "Update Application" : "Save Application"}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;
