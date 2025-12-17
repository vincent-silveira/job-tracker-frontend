import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-slate-50 text-slate-800">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-600">
            Smart Job Tracker
          </h1>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-slate-600 hover:text-emerald-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Track Every Job Application <br /> Without the Chaos
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-emerald-100 mb-8">
            Smart Job Tracker helps you organize job applications, track
            interview stages, and stay focused during your job hunt.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border border-white px-6 py-3 rounded-xl font-semibold hover:bg-white hover:text-emerald-600 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Stay Organized
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Application Tracking",
              desc: "Keep track of all your job applications with status updates like Applied, Interviewing, and Offer.",
              icon: "📋",
            },
            {
              title: "Interview Management",
              desc: "Never miss an interview. Store dates, notes, and feedback in one place.",
              icon: "📅",
            },
            {
              title: "Centralized Dashboard",
              desc: "Get a clear overview of your job search progress with a clean dashboard.",
              icon: "📊",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div>
              <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h4 className="font-semibold text-lg mb-2">Create Account</h4>
              <p className="text-slate-600">
                Sign up in seconds and start organizing your job search.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h4 className="font-semibold text-lg mb-2">Add Applications</h4>
              <p className="text-slate-600">
                Add job details, companies, roles, and application status.
              </p>
            </div>

            <div>
              <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h4 className="font-semibold text-lg mb-2">Track Progress</h4>
              <p className="text-slate-600">
                Monitor interviews, follow-ups, and offers with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Job Search?
          </h3>
          <p className="text-emerald-100 mb-8">
            Join Smart Job Tracker today and never lose track of an application again.
          </p>

          <Link
            to="/signup"
            className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          © {new Date().getFullYear()} Smart Job Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;