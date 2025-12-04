import { useState, useEffect } from "react";
import Modal from "../components/Modal";
import SidePanel from "../components/SidePanel";
import { Sun, Moon, Leaf, Bird, Menu, X, Home } from "lucide-react";

const LandingPage = () => {
  const [open, setOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Floating decorative elements
  const FloatingLeaf = ({ delay, left }) => (
    <div
      className="absolute animate-float text-green-300 dark:text-green-600 opacity-40"
      style={{
        animationDelay: `${delay}s`,
        left: `${left}%`,
        top: "-10px"
      }}
    >
      <Leaf size={32} />
    </div>
  );

  const FloatingBird = ({ delay, left }) => (
    <div
      className="absolute animate-float-slow text-emerald-400 dark:text-emerald-500 opacity-50"
      style={{
        animationDelay: `${delay}s`,
        left: `${left}%`,
        top: "5%"
      }}
    >
      <Bird size={28} />
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900 dark:to-teal-900 min-h-screen w-full transition-colors duration-300 relative overflow-hidden">
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(20px) translateY(-10px); }
          50% { transform: translateX(0px) translateY(-20px); }
          75% { transform: translateX(-20px) translateY(-10px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
        }
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 shadow-lg z-50 animate-slide-down">
        <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌿</div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">MinSU Bongabong</h1>
                <p className="text-green-100 text-xs">Guidance Office</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-white hover:text-green-100 font-semibold transition-colors">Services</a>
              <a href="#contact" className="text-white hover:text-green-100 font-semibold transition-colors">Contact</a>
              <button
                onClick={() => setOpen(true)}
                className="bg-white text-green-700 px-6 py-2 rounded-lg font-bold hover:bg-green-50 transition-all duration-300"
              >
                Quick Help
              </button>
              <a 
                href="/login"
                className="bg-yellow-400 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300"
              >
                Login
              </a>
              <button
                onClick={() => setIsDark(!isDark)}
                className="text-white hover:text-green-100 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="text-white hover:text-green-100 transition-colors p-2 rounded-lg hover:bg-white/10"
              >
                {isDark ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2 rounded-lg hover:bg-white/10"
              >
                {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 space-y-3">
              <a href="#services" className="block text-white hover:text-green-100 font-semibold transition-colors py-2">Services</a>
              <a href="#contact" className="block text-white hover:text-green-100 font-semibold transition-colors py-2">Contact</a>
              <button
                onClick={() => {
                  setOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-white text-green-700 px-6 py-2 rounded-lg font-bold hover:bg-green-50 transition-all duration-300"
              >
                Quick Help
              </button>
              <a 
                href="/login"
                className="block text-center bg-yellow-400 text-gray-800 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-all duration-300"
              >
                Login
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingLeaf delay={0} left={5} />
        <FloatingLeaf delay={2} left={15} />
        <FloatingLeaf delay={4} left={80} />
        <FloatingLeaf delay={1} left={85} />
        <FloatingBird delay={1} left={20} />
        <FloatingBird delay={3} left={75} />
      </div>

      {/* Hero Section - Mindoro State University Guidance Office */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-20 xl:px-32 py-20 md:py-28 gap-12 relative z-10 mt-20 md:mt-24">
        <div className="w-full md:w-1/2 animate-fade-in">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 leading-tight">
            Mindoro State University
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-green-700 dark:text-green-400 mb-3">
            🌿 Bongabong Campus 🌿
          </h2>
          <h3 className="text-2xl text-emerald-600 dark:text-emerald-300 mb-6 font-semibold">
            Guidance and Counseling Office 💚
          </h3>

          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6 leading-relaxed">
            Welcome to MinSU Bongabong's premier Guidance and Counseling Office. We are dedicated to supporting your academic, personal, and professional growth journey. Our compassionate team of counselors and advisors is here to help you navigate challenges and achieve your full potential.
          </p>

          <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 p-4 rounded-2xl mb-6">
            <p className="text-green-800 dark:text-green-200 font-semibold mb-2">📍 Why Choose Us?</p>
            <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
              <li>✨ Confidential and supportive counseling services</li>
              <li>🎓 Expert academic advising and career planning</li>
              <li>💡 Personalized guidance tailored to your needs</li>
              <li>🤝 Referral network to specialized support services</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-bold text-lg pulse-glow"
            >
              🌱 Explore Services
            </a>
            <button
              onClick={() => setPanelOpen(true)}
              className="bg-white dark:bg-gray-800 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-600 px-8 py-4 rounded-2xl font-bold hover:bg-green-50 dark:hover:bg-green-900/50 transition-all duration-300 text-lg hover:scale-105 transform"
            >
              ℹ️ More Info
            </button>
            <button
              onClick={() => setOpen(true)}
              className="bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-600 px-6 py-4 rounded-2xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-all duration-300 hover:scale-105 transform"
            >
              🆘 Quick Help
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 transform hover:scale-105 transition-transform duration-500">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <img
              src="/minsu.png.webp"
              alt="Mindoro State University"
              className="relative rounded-3xl shadow-2xl w-full object-cover h-80 md:h-96"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full py-20 bg-white dark:bg-gray-800 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              🌟 Our Services
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              A comprehensive range of student support services designed to promote well-being and academic success.
            </p>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-200 dark:border-green-700 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              <p className="text-4xl mb-3">💬</p>
              <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">Counseling</h4>
              <p className="text-gray-700 dark:text-gray-300">Confidential personal and psychological counseling to help you navigate life's challenges.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-200 dark:border-emerald-700 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              <p className="text-4xl mb-3">🎓</p>
              <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-3">Academic Advising</h4>
              <p className="text-gray-700 dark:text-gray-300">Expert guidance with course planning, degree requirements, and academic progression strategies.</p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/30 dark:to-cyan-900/30 border-2 border-teal-200 dark:border-teal-700 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              <p className="text-4xl mb-3">🚀</p>
              <h4 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3">Career Guidance</h4>
              <p className="text-gray-700 dark:text-gray-300">Comprehensive workshops, CV assistance, job search strategies, and placement resources.</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-cyan-50 dark:from-green-900/30 dark:to-cyan-900/30 border-2 border-cyan-200 dark:border-cyan-700 p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
              <p className="text-4xl mb-3">🔗</p>
              <h4 className="text-xl font-bold text-cyan-800 dark:text-cyan-300 mb-3">Referral Services</h4>
              <p className="text-gray-700 dark:text-gray-300">Connections to specialized support services and external resources when additional help is needed.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 p-8 rounded-2xl border-2 border-green-300 dark:border-green-700 text-center">
            <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4">📋 Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-green-700 dark:text-green-400 font-semibold mb-2">⏰ Office Hours</p>
                <p className="text-gray-700 dark:text-gray-300">Monday–Friday</p>
                <p className="text-gray-700 dark:text-gray-300">8:00 AM – 5:00 PM</p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-400 font-semibold mb-2">📧 Email</p>
                <p className="text-gray-700 dark:text-gray-300">guidance@minsu-bongabong.edu.ph</p>
              </div>
              <div>
                <p className="text-green-700 dark:text-green-400 font-semibold mb-2">📱 Phone</p>
                <p className="text-gray-700 dark:text-gray-300">(042) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-20 bg-gradient-to-b from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 relative z-10">
        <div className="w-full px-6 md:px-12 lg:px-20 xl:px-32">
          <div className="text-center mb-12">
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">
              📞 Get in Touch With Us
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              We're here to support you. Reach out anytime during our office hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-green-200 dark:border-green-700">
              <div className="text-5xl mb-4">⏰</div>
              <h4 className="text-xl font-bold text-green-800 dark:text-green-300 mb-3">Office Hours</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2"><span className="font-semibold">Monday - Friday</span></p>
              <p className="text-gray-700 dark:text-gray-300">8:00 AM - 5:00 PM</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">(Closed on Sundays & Holidays)</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-emerald-200 dark:border-emerald-700">
              <div className="text-5xl mb-4">📧</div>
              <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-3">Email</h4>
              <p className="text-gray-700 dark:text-gray-300 break-all font-semibold">guidance@minsu-bongabong.edu.ph</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">We respond within 24 hours</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-teal-200 dark:border-teal-700">
              <div className="text-5xl mb-4">📱</div>
              <h4 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-3">Phone</h4>
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">(042) 123-4567</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-3">Call during office hours</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50 p-8 rounded-2xl border-2 border-green-300 dark:border-green-700">
            <h4 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4 text-center">🌍 Location</h4>
            <p className="text-center text-gray-700 dark:text-gray-300 text-lg mb-2">
              <span className="font-semibold">Mindoro State University - Bongabong Campus</span>
            </p>
            <p className="text-center text-gray-700 dark:text-gray-300">
              Guidance and Counseling Office
            </p>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
              Visit us in person at the Student Services Building
            </p>
          </div>
        </div>
      </section>
      <section className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-800 dark:via-emerald-800 dark:to-teal-800 text-white text-center py-20 px-6 md:px-12 relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Leaf className="absolute top-5 left-10 animate-float" size={40} style={{ animationDelay: "0s" }} />
          <Bird className="absolute top-1/2 right-10 animate-float-slow" size={35} style={{ animationDelay: "1s" }} />
          <Leaf className="absolute bottom-10 left-1/4 animate-float" size={38} style={{ animationDelay: "2s" }} />
        </div>
        <div className="w-full relative z-10">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">
            💚 Ready to Get Started? 💚
          </h3>
          <p className="mb-8 text-lg text-green-50 max-w-2xl mx-auto">
            Whether you're seeking academic guidance, career advice, or personal support, our dedicated team is here to help you succeed. Access our student portal to book an appointment today!
          </p>
          <a href="/login" className="inline-block bg-white text-green-700 font-bold px-10 py-4 rounded-2xl hover:bg-green-50 transition-all duration-300 text-lg shadow-lg hover:shadow-2xl hover:scale-105 transform">
            🎯 Access Student Portal
          </a>
        </div>
      </section>
      {/* Modal and SidePanel instances */}
      <Modal open={open} onClose={() => setOpen(false)} title="🆘 Quick Help">
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-200">Need immediate assistance? Our Guidance Office team is here to help you right away!</p>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg border-l-4 border-green-500">
            <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">📧 Email</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">guidance@minsu-bongabong.edu.ph</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-lg border-l-4 border-emerald-500">
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-2">📱 Phone</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">(042) 123-4567</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg border-l-4 border-teal-500">
            <p className="text-sm font-semibold text-teal-800 dark:text-teal-300 mb-2">⏰ Office Hours</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Monday–Friday, 8:00 AM – 5:00 PM</p>
          </div>
        </div>
      </Modal>

      <SidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title="ℹ️ About Our Services">
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">At MinSU Bongabong Guidance Office, we provide comprehensive support to help students thrive academically and personally.</p>
          
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
              <p className="font-semibold text-green-800 dark:text-green-300 mb-1">💬 Individual Counseling</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">One-on-one sessions tailored to your specific needs and concerns.</p>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 mb-1">👥 Group Workshops</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Interactive sessions on stress management, study skills, and personal development.</p>
            </div>
            
            <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg">
              <p className="font-semibold text-teal-800 dark:text-teal-300 mb-1">🎓 Academic Advising</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Guidance on course selection, degree planning, and academic success strategies.</p>
            </div>
            
            <div className="bg-cyan-50 dark:bg-cyan-900/30 p-3 rounded-lg">
              <p className="font-semibold text-cyan-800 dark:text-cyan-300 mb-1">🚀 Career Planning</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">Resume building, interview prep, and career exploration resources.</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 border-t pt-3">To book an appointment, please visit the student portal or contact us directly. All services are confidential and free for enrolled students.</p>
        </div>
      </SidePanel>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 text-gray-300 relative z-10">
        <div className="px-6 md:px-12 lg:px-20 xl:px-32 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🌿</span> MinSU Bongabong
              </h5>
              <p className="text-gray-400 text-sm leading-relaxed">
                Supporting students' academic, personal, and professional growth through comprehensive guidance and counseling services.
              </p>
            </div>

            <div>
              <h5 className="text-white font-bold text-lg mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="text-gray-400 hover:text-green-400 transition-colors">Services</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-green-400 transition-colors">Contact Us</a></li>
                <li><a href="/login" className="text-gray-400 hover:text-green-400 transition-colors">Student Portal</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold text-lg mb-4">Contact</h5>
              <p className="text-gray-400 text-sm mb-2">
                <span className="text-green-400">📧</span> guidance@minsu-bongabong.edu.ph
              </p>
              <p className="text-gray-400 text-sm">
                <span className="text-green-400">📱</span> (042) 123-4567
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-500 text-sm">
            <p>
              © 2025 Mindoro State University Bongabong Campus — Guidance and Counseling Office
            </p>
            <p className="mt-2">Committed to student success and well-being 💚</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
