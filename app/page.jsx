import Image from "next/image";
import Expertise from "./components/home/expertise";
import Testimonials from "./components/home/testimonials-apple";
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
  FaUsers,
  FaBookOpen,
  FaMapPin,
} from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-appleGray-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-sky-400/10 rounded-full animate-float"></div>
      <div
        className="absolute top-64 right-16 w-16 h-16 bg-sky-500/15 rounded-2xl animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-96 left-20 w-12 h-12 bg-sky-600/20 rounded-full animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-80 right-32 w-8 h-8 bg-sky-400/25 rounded-full animate-float"
        style={{ animationDelay: "3s" }}
      ></div>
      {/* Hero Section - Apple-style with German colors */}
      <section className="relative overflow-hidden bg-gradient-to-br from-appleGray-50 via-white to-appleGray-100 pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-sky-600/5"></div>

        {/* Additional floating elements for hero section */}
        <div
          className="absolute top-20 left-1/4 w-32 h-32 bg-sky-500/5 rounded-full animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-24 h-24 bg-sky-400/8 rounded-2xl animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 animate-fade-in-up">
            {/* Badge */}{" "}
            <div className="inline-flex items-center space-x-2 bg-sky-500/10 text-sky-700 px-6 py-3 rounded-full text-sm font-medium border border-sky-500/20">
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
                Empowering Sri Lankan students with seamless pathways to
                world-class German education. Experience excellence, precision,
                and success.
              </p>
            </div>{" "}
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link
                href="/apply-now"
                className="group bg-sky-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover flex items-center space-x-2 shadow-soft hover:bg-sky-600"
              >
                <span>Start Your Journey</span>
                <FaArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <button className="group bg-appleGray-100 text-appleGray-700 px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover flex items-center space-x-2 border border-appleGray-200 hover:border-sky-300 hover:text-sky-600">
                <FaPlay className="w-4 h-4" />
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div className="mt-20 relative">
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-gradient-to-br from-slate-900 via-sky-500 to-sky-600 rounded-3xl shadow-large overflow-hidden">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center text-white space-y-4 animate-fade-in-up">
                    <FaGraduationCap className="w-16 h-16 mx-auto animate-float" />
                    <h3 className="text-2xl font-bold">
                      Discover German Education
                    </h3>
                    <p className="text-lg opacity-90">
                      Where precision meets opportunity
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating Elements */}{" "}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-sky-400 rounded-full shadow-medium flex items-center justify-center animate-float">
                <FaUniversity className="w-8 h-8 text-white" />
              </div>
              <div
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-sky-500 rounded-2xl shadow-medium flex items-center justify-center animate-float"
                style={{ animationDelay: "1s" }}
              >
                <FaGlobe className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Trust Indicators - Apple-style with German colors */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Floating elements for this section */}
        <div
          className="absolute top-16 right-10 w-28 h-28 bg-sky-400/8 rounded-full animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>
        <div
          className="absolute bottom-20 left-8 w-20 h-20 bg-sky-500/10 rounded-2xl animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-32 left-1/3 w-16 h-16 bg-sky-600/12 rounded-full animate-float"
          style={{ animationDelay: "3.5s" }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}{" "}
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-appleGray-800 mb-6 leading-tight">
              Why Choose Our <span className="text-gradient">Excellence</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-sky-600 mx-auto mb-6"></div>
            <p className="text-xl text-appleGray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unmatched quality, transparency, and success with
              German precision
            </p>
          </div>
          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                icon: FaUserShield,
                title: "Expert Legal Team",
                description:
                  "Immigration lawyers in Germany handle your applications with precision and care.",
                color: "bg-sky-500",
              },
              {
                icon: FaShieldAlt,
                title: "Money-Back Guarantee",
                description:
                  "Complete refund within 14 days if we can't secure your admission.",
                color: "bg-sky-400",
              },
              {
                icon: FaHandshake,
                title: "Transparent Process",
                description:
                  "Clear agreements, no hidden fees, and complete transparency throughout.",
                color: "bg-appleGray-700",
              },
              {
                icon: FaCheckCircle,
                title: "Proven Success",
                description:
                  "Proven track record with over 1000 successful university placements.",
                color: "bg-sky-500",
              },
              {
                icon: FaGlobe,
                title: "Global Network",
                description:
                  "Partnerships with 50+ top German universities and institutions.",
                color: "bg-sky-400",
              },
              {
                icon: FaHeart,
                title: "Personalized Care",
                description:
                  "Dedicated support tailored to your unique goals and circumstances.",
                color: "bg-appleGray-700",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group text-center card-apple-hover bg-appleGray-50 p-8 rounded-3xl border border-appleGray-200"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 mx-auto mb-6 ${feature.color} rounded-2xl flex items-center justify-center shadow-soft`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-appleGray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-appleGray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          {/* Stats */}
          {/* <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "1000+", label: "Students Placed" },
              { number: "99%", label: "Success Rate" },
              { number: "50+", label: "Partner Universities" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-appleGray-50 rounded-3xl border border-appleGray-200"
              >
                <div className="text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="text-appleGray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div> */}
        </div>
      </section>{" "}
      {/* Services Section - Apple-style cards */}
      <section className="py-24 bg-appleGray-50 relative overflow-hidden">
        {/* Floating elements for services section */}
        <div
          className="absolute top-12 left-12 w-24 h-24 bg-sky-500/8 rounded-2xl animate-float"
          style={{ animationDelay: "1.8s" }}
        ></div>
        <div
          className="absolute bottom-16 right-14 w-32 h-32 bg-sky-400/6 rounded-full animate-float"
          style={{ animationDelay: "3.2s" }}
        ></div>
        <div
          className="absolute top-40 right-1/4 w-14 h-14 bg-sky-600/15 rounded-full animate-float"
          style={{ animationDelay: "2.8s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-18 h-18 bg-sky-500/12 rounded-2xl animate-float"
          style={{ animationDelay: "4.5s" }}
        ></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-appleGray-800 mb-6 leading-tight">
              Complete Education
              <span className="block text-gradient">Solutions</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-sky-600 mx-auto mb-6"></div>
            <p className="text-xl text-appleGray-600 max-w-3xl mx-auto leading-relaxed">
              From application to settlement, we provide comprehensive support
              for your entire educational journey to Germany
            </p>
          </div>
          {/* Service Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaUniversity,
                title: "University Applications",
                description:
                  "Expert guidance for applications to Germany's top universities with high acceptance rates.",
                features: [
                  "Document preparation",
                  "Application strategy",
                  "Interview coaching",
                  "Deadline management",
                ],
                color: "bg-sky-500",
              },
              {
                icon: FaPassport,
                title: "Visa & Immigration",
                description:
                  "Complete visa processing with legal experts ensuring smooth immigration procedures.",
                features: [
                  "Student visa processing",
                  "Document verification",
                  "Embassy appointments",
                  "Legal compliance",
                ],
                color: "bg-sky-400",
              },
              {
                icon: FaHome,
                title: "Settlement Support",
                description:
                  "Comprehensive assistance for your transition and successful integration in Germany.",
                features: [
                  "Accommodation assistance",
                  "Bank account setup",
                  "Cultural orientation",
                  "Ongoing support",
                ],
                color: "bg-appleGray-700",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-soft card-apple-hover border border-appleGray-200"
              >
                <div
                  className={`w-16 h-16 mb-6 ${service.color} rounded-2xl flex items-center justify-center shadow-soft`}
                >
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-appleGray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-appleGray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center space-x-3"
                    >
                      <FaCheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span className="text-appleGray-700 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>{" "}
          {/* CTA */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl p-12 text-white shadow-large">
              <h3 className="text-3xl font-bold mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                Join over 1000 successful students who have achieved their
                German education dreams with our comprehensive support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-sky-500 px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover shadow-soft hover:bg-sky-50">
                  Start Application
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover hover:bg-white/10">
                  Free Consultation
                </button>
              </div>
            </div>
          </div>
        </div>{" "}
      </section>
      {/* Expertise Section */}
      <Expertise /> {/* Additional Services */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Floating elements for additional services */}
        <div
          className="absolute top-20 left-16 w-22 h-22 bg-sky-400/10 rounded-full animate-float"
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div
          className="absolute bottom-24 right-12 w-26 h-26 bg-sky-500/8 rounded-2xl animate-float"
          style={{ animationDelay: "3.8s" }}
        ></div>
        <div
          className="absolute top-56 right-20 w-12 h-12 bg-sky-600/18 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-appleGray-800">
              Beyond the Basics
            </h2>
            <p className="text-xl text-appleGray-600 max-w-3xl mx-auto">
              Premium services that set us apart and ensure your complete
              success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FaLanguage,
                title: "Language Support",
                description:
                  "TestDaF and IELTS preparation with certified instructors.",
                color: "bg-sky-500",
              },
              {
                icon: FaMoneyBillWave,
                title: "Scholarship Guidance",
                description:
                  "Access to exclusive funding opportunities and financial aid.",
                color: "bg-sky-400",
              },
              {
                icon: FaUserTie,
                title: "Career Counseling",
                description:
                  "Professional guidance for your career path in Germany.",
                color: "bg-appleGray-700",
              },
              {
                icon: FaAward,
                title: "Premium Mentorship",
                description:
                  "One-on-one guidance from industry experts and alumni.",
                color: "bg-sky-500",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="text-center p-6 bg-appleGray-50 rounded-2xl border border-appleGray-200 card-apple-hover"
              >
                <div
                  className={`w-12 h-12 mx-auto mb-4 ${service.color} rounded-xl flex items-center justify-center shadow-soft`}
                >
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-appleGray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-appleGray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>{" "}
      {/* Testimonials Section */}
      <Testimonials /> {/* Contact Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Floating elements for contact section */}
        <div
          className="absolute top-8 right-8 w-30 h-30 bg-sky-400/7 rounded-full animate-float"
          style={{ animationDelay: "1.2s" }}
        ></div>
        <div
          className="absolute bottom-12 left-10 w-20 h-20 bg-sky-500/12 rounded-2xl animate-float"
          style={{ animationDelay: "3.5s" }}
        ></div>
        <div
          className="absolute top-32 left-1/3 w-16 h-16 bg-sky-600/10 rounded-full animate-float"
          style={{ animationDelay: "2.7s" }}
        ></div>
        <div
          className="absolute bottom-28 right-1/4 w-14 h-14 bg-sky-400/15 rounded-2xl animate-float"
          style={{ animationDelay: "4.2s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-appleGray-800 mb-6">
              Ready to Begin Your{" "}
              <span className="text-gradient">German Journey?</span>
            </h2>
            <p className="text-xl text-appleGray-600 max-w-3xl mx-auto">
              Get started with a free consultation and take the first step
              towards your German education dream.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-12 items-center">
            {/* Contact Info */}{" "}
            {/* <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaPhone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-appleGray-800">
                    Call Us
                  </h3>
                  <p className="text-appleGray-600">+94 11 234 5678</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-sky-400 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaWhatsapp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-appleGray-800">
                    WhatsApp
                  </h3>
                  <p className="text-appleGray-600">+94 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-appleGray-700 rounded-2xl flex items-center justify-center shadow-soft">
                  <FaMapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-appleGray-800">
                    Visit Us
                  </h3>
                  <p className="text-appleGray-600">Colombo 07, Sri Lanka</p>
                </div>
              </div>
            </div> */}
            {/* CTA Card */}
            <div className="bg-appleGray-50 col-span-2 col-start-2 p-8 rounded-3xl border border-appleGray-200">
              <h3 className="text-2xl font-bold text-appleGray-800 mb-4">
                Free Consultation
              </h3>
              <p className="text-appleGray-600 mb-6">
                Schedule a complimentary consultation to discuss your German
                education goals and get personalized guidance.
              </p>{" "}
              <button className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg btn-apple-hover shadow-soft hover:from-sky-600 hover:to-sky-700">
                Book Your Consultation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
