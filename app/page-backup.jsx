import Image from "next/image";
import Expertise from "./components/home/expertise";
import Testimonials from "./components/home/testimonials";
import {
  FaGraduationCap,
  FaUserShield,
  FaHandshake,
  FaCheckCircle,
  FaGlobe,
  FaHeart,
  FaRocket,
  FaShieldAlt,
  FaCrown,
  FaEnvelope,
  FaUniversity,
  FaPassport,
  FaHome,
  FaLanguage,
  FaMoneyBillWave,
  FaUserTie,
  FaAward,
  FaChartLine,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaCode,
} from "react-icons/fa";

import Image from "next/image";
import Expertise from "./components/home/expertise";
import Testimonials from "./components/home/testimonials";
import {
  FaGraduationCap,
  FaUserShield,
  FaHandshake,
  FaCheckCircle,
  FaGlobe,
  FaHeart,
  FaRocket,
  FaShieldAlt,
  FaCrown,
  FaEnvelope,
  FaUniversity,
  FaPassport,
  FaHome,
  FaLanguage,
  FaMoneyBillWave,
  FaUserTie,
  FaAward,
  FaChartLine,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaCode,
  FaArrowRight,
  FaStar,
  FaPlay,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-appleGray-50">
      {/* Hero Section - Apple-style with German colors */}
      <section className="relative overflow-hidden bg-gradient-to-br from-appleGray-50 via-white to-appleGray-100 pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-german-red/5 via-transparent to-german-gold/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-german-red/10 text-german-red-700 px-6 py-3 rounded-full text-sm font-medium border border-german-red/20">
              <FaCrown className="w-4 h-4" />
              <span>Premium Education Consultancy</span>
            </div>
            
            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-appleGray-800 leading-none tracking-tight">
                Your Gateway to
                <span className="block text-gradient">German Excellence</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-appleGray-600 max-w-4xl mx-auto leading-relaxed">
                Empowering Sri Lankan students with seamless pathways to world-class German education. 
                Experience excellence, precision, and success.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button className="group bg-german-red text-white px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover flex items-center space-x-2 shadow-soft">
                <span>Start Your Journey</span>
                <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="group bg-appleGray-100 text-appleGray-700 px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover flex items-center space-x-2 border border-appleGray-200">
                <FaPlay className="w-4 h-4" />
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>
          
          {/* Hero Image/Visual */}
          <div className="mt-20 relative">
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-german-black via-german-red to-german-gold rounded-3xl shadow-large overflow-hidden">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white space-y-4 animate-fade-in-up">
                    <FaGraduationCap className="w-16 h-16 mx-auto animate-float" />
                    <h3 className="text-2xl font-bold">Discover German Education</h3>
                    <p className="text-lg opacity-90">Where precision meets opportunity</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-german-gold rounded-full shadow-medium flex items-center justify-center animate-float">
                <FaUniversity className="w-8 h-8 text-german-black" />
              </div>
              
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-german-red rounded-2xl shadow-medium flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
                <FaGlobe className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
                  Transform your academic dreams into reality with our premium consultancy. We&apos;ve helped{" "}
                  <span className="font-semibold text-blue-600">1000+</span> Sri Lankan students secure their future in
                  Germany&apos;s top universities.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <img src="/german-flag.jpg" className="w-12 h-8 object-cover rounded shadow-lg" alt="Germany" />
                <div className="w-px h-8 bg-gray-200"></div>
                <div className="text-sm text-gray-600">
                  <div className="font-semibold">99% Success Rate</div>
                  <div>Since 2014</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/apply-now" className="btn-premium group">
                  Start Your Journey
                  <FaRocket className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </a>

                <a href="/contact" className="btn-secondary">
                  Free Consultation
                </a>
              </div>
            </div>
          </div>{" "}
          {/* Hero Image - Responsive positioning */}
          <div className="absolute bottom-0 right-0 z-0 hidden lg:block">
            <img
              src="/gidz.jpg"
              alt="German Landmark - Your Gateway to Excellence"
              className="w-auto h-96 lg:h-[400px] object-contain"
            />
          </div>
          {/* Mobile Hero Image - Below content on mobile */}
          <div className="lg:hidden mt-12 flex justify-center">
            <img
              src="/gidz.jpg"
              alt="German Landmark - Your Gateway to Excellence"
              className="w-full max-w-md h-auto object-contain"
            />
          </div>
        </div>
      </section>{" "}
      {/* Trust Indicators - Clean Minimal Design */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5">
            <div className="grid grid-cols-12 gap-4 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="bg-blue-500 rounded-full w-1 h-1"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Clean Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Choose Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Excellence</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unmatched quality, transparency, and success
            </p>
          </div>

          {/* Clean Feature List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
            {[
              {
                icon: FaUserShield,
                title: "Expert Legal Team",
                description: "Immigration lawyers in Germany handle your applications with precision and care.",
                color: "text-blue-600",
                number: "01",
              },
              {
                icon: FaShieldAlt,
                title: "Money-Back Guarantee",
                description: "Complete refund within 14 days if we can't secure your admission.",
                color: "text-emerald-600",
                number: "02",
              },
              {
                icon: FaHandshake,
                title: "Transparent Process",
                description: "Clear agreements, no hidden fees, and complete transparency throughout.",
                color: "text-purple-600",
                number: "03",
              },
              {
                icon: FaCheckCircle,
                title: "Proven Success",
                description: "Proven track record with over 1000 successful university placements.",
                color: "text-orange-600",
                number: "04",
              },
              {
                icon: FaGlobe,
                title: "Global Network",
                description: "Partnerships with 50+ top German universities and institutions.",
                color: "text-teal-600",
                number: "05",
              },
              {
                icon: FaHeart,
                title: "Personalized Care",
                description: "Dedicated support tailored to your unique goals and circumstances.",
                color: "text-pink-600",
                number: "06",
              },
            ].map((feature, index) => (
              <div key={index} className="group text-center hover:transform hover:scale-105 transition-all duration-300">
                {/* Number indicator */}
                <div className="text-gray-300 text-sm font-bold mb-4 tracking-wider">{feature.number}</div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 mx-auto mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-full h-full" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>

                {/* Subtle underline on hover */}
                <div className="w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 group-hover:w-16 transition-all duration-300"></div>
              </div>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="mt-20 text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">1000+</div>
                <div className="text-gray-600">Students Placed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">99%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-gray-600">Partner Universities</div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Complete Education Solutions - Flowing Layout */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Complete Education
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">Solutions</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From application to settlement, we provide comprehensive support for your entire educational journey to Germany
            </p>
          </div>

          {/* Service Flow */}
          <div className="space-y-16">
            {[
              {
                icon: FaUniversity,
                title: "University Applications",
                description: "Expert guidance for applications to Germany's top universities with high acceptance rates.",
                features: ["Document preparation", "Application strategy", "Interview coaching", "Deadline management"],
                position: "left",
              },
              {
                icon: FaPassport,
                title: "Visa & Immigration",
                description: "Complete visa processing with legal experts ensuring smooth immigration procedures.",
                features: ["Student visa processing", "Document verification", "Embassy appointments", "Legal compliance"],
                position: "right",
              },
              {
                icon: FaHome,
                title: "Settlement Support",
                description: "Comprehensive assistance for your transition and successful integration in Germany.",
                features: ["Accommodation assistance", "Bank account setup", "Cultural orientation", "Ongoing support"],
                position: "left",
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`flex flex-col lg:flex-row items-center gap-12 ${service.position === "right" ? "" : ""}`}
              >
                {/* Icon & Title */}
                <div className="flex-shrink-0 text-center lg:text-left">
                  <div className="w-24 h-24 mx-auto lg:mx-0 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-sm text-gray-400 font-semibold tracking-wider mb-2">
                    STEP {String(index + 1).padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">{service.description}</p>

                  {/* Features List */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    {service.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100"
                      >
                        <FaCheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700 text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Connection Line (hidden on mobile) */}
                {index < 2 && (
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 mt-20">
                    <div className="w-px h-16 bg-gradient-to-b from-blue-300 to-transparent"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto -mt-1"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join over 1000 successful students who have achieved their German education dreams with our comprehensive support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/apply-now"
                  className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-300"
                >
                  Start Application
                </a>
                <a
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
                >
                  Free Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-headline-lg font-sf-pro text-midnight">Beyond the Basics</h2>
            <p className="text-body-lg text-slate-600 max-w-3xl mx-auto">
              Premium services that set us apart and ensure your complete success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FaLanguage,
                title: "Language Support",
                description: "TestDaF and IELTS preparation with certified instructors.",
              },
              {
                icon: FaMoneyBillWave,
                title: "Scholarship Guidance",
                description: "Access to exclusive funding opportunities and financial aid.",
              },
              {
                icon: FaUserTie,
                title: "Career Counseling",
                description: "Professional guidance for your career path in Germany.",
              },
              {
                icon: FaAward,
                title: "Premium Mentorship",
                description: "One-on-one mentoring with successful alumni in Germany.",
              },
            ].map((service, index) => (
              <div key={index} className="group">
                <div className="card-premium p-6 text-center h-full">
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-primary-100 to-primary-200 rounded-xl flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-midnight mb-3">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-headline-lg font-sf-pro">Our Track Record Speaks</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">Numbers that demonstrate our commitment to your success.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Students Successfully Placed", icon: FaGraduationCap },
              { number: "99%", label: "Application Success Rate", icon: FaChartLine },
              { number: "50+", label: "Partner Universities", icon: FaUniversity },
              { number: "10+", label: "Years of Excellence", icon: FaAward },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-midnight text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-headline-lg font-sf-pro">Ready to Transform Your Future?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of successful students who chose our premium service to achieve their German education dreams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply-now"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-midnight bg-white rounded-lg shadow-2xl transition-all duration-300 hover:bg-slate-50 hover:scale-105 group"
              >
                Begin Your Journey Today
                <FaRocket className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg transition-all duration-300 hover:bg-white hover:text-midnight hover:scale-105"
              >
                Free Consultation
              </a>
            </div>

            <div className="pt-8 text-sm text-slate-400">No obligation • Free consultation • Expert guidance</div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}
