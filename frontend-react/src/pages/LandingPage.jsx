import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import SidePanel from "../components/SidePanel";
import { Sun, Moon } from "lucide-react";

const LandingPage = () => {
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  // Dark mode state (no extra hook required)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return JSON.parse(saved);
    return (
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
    );
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen w-full transition-colors duration-300">

      {/* Hero Section - Mindoro State University Guidance Office */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28 gap-12">
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
            Mindoro State University
            <br />
            <span className="text-indigo-700">Bongabong Campus</span>
          </h2>
          <h3 className="text-xl text-gray-700 mb-6">Guidance and Counseling Office</h3>

          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            The Guidance Office provides counseling, academic advising, career
            planning, and personal support services to help MSU Bongabong
            students succeed academically and personally. We offer confidential
            one-on-one counseling, group workshops, and referral services.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="#services"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
            >
              Explore Services
            </a>
            <button
              onClick={() => setPanelOpen(true)}
              className="bg-white text-indigo-700 border border-indigo-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              More Info
            </button>
            <button
              onClick={() => setOpen(true)}
              className="ml-2 bg-white text-indigo-700 border border-indigo-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Quick Help
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src="https://images.pexels.com/photos/256381/pexels-photo-256381.jpeg?auto=compress&cs=tinysrgb&h=627&w=1200"
            alt="MSU Bongabong Campus"
            className="rounded-3xl shadow-2xl w-full hover:scale-102 transition-transform duration-500 object-cover h-80 md:h-96"
          />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full py-20 bg-white">
        <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h3>
            <p className="text-gray-600 text-lg">
              A range of student support services to promote well-being and
              academic success.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Counseling</h4>
              <p className="text-sm text-gray-600">Confidential personal and
                psychological counseling for students.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Academic Advising</h4>
              <p className="text-sm text-gray-600">Help with course planning
                and academic progression.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Career Guidance</h4>
              <p className="text-sm text-gray-600">Workshops, CV help and
                job placement resources.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-xl shadow-sm">
              <h4 className="text-lg font-semibold mb-2">Referral</h4>
              <p className="text-sm text-gray-600">Referrals to specialists
                and external support services when needed.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-700">Office Hours: Mon–Fri, 8:00 AM – 5:00 PM</p>
            <p className="text-gray-700">Email: guidance@msu-bongabong.edu.ph</p>
            <p className="text-gray-700">Phone: (042) 123-4567</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-center py-16 px-6 md:px-12">
        <div className="w-full">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Need guidance or support?
          </h3>
          <p className="mb-6 text-lg text-indigo-100">
            Visit the Guidance Office or access our online resources for
            appointments and information.
          </p>
          <a href="/login" className="inline-block bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition">
            Access Student Portal
          </a>
        </div>
      </section>
      {/* Modal and SidePanel instances */}
      <Modal open={open} onClose={() => setOpen(false)} title="Quick Help">
        <p className="text-gray-700 dark:text-gray-200 mb-4">Need immediate assistance? Contact the Guidance Office or call during office hours.</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Email: guidance@msu-bongabong.edu.ph</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">Phone: (042) 123-4567</p>
      </Modal>

      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title="More About Our Services">
        <p className="text-gray-700 dark:text-gray-300 mb-3">We provide confidential counseling, academic advising, career services, and referrals. To book an appointment, please contact the office or use the student portal.</p>
        <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc pl-5">
          <li>Individual Counseling</li>
          <li>Group Workshops</li>
          <li>Academic Advising Sessions</li>
          <li>Career Planning Resources</li>
        </ul>
      </SidePanel>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 text-center py-8">
        <p className="text-sm">
          © 2025 Mindoro State University Bongabong Campus — Guidance Office
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
