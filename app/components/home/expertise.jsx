import {
  FaGraduationCap,
  FaPassport,
  FaUserTie,
  FaLanguage,
  FaPlane,
  FaHome,
} from "react-icons/fa";

export default function ExpertiseWithIcons() {
  const expertiseAreas = [
    {
      title: "University Applications",
      description:
        "Expert guidance through applications to Germany's top universities with precision and care.",
      icon: FaGraduationCap,
      color: "bg-german-red-500",
      gradient: "from-german-red-500 to-german-red-600",
    },
    {
      title: "Visa Assistance",
      description:
        "Streamlined student visa process with our German legal expertise and proven success.",
      icon: FaPassport,
      color: "bg-german-gold-500",
      gradient: "from-german-gold-500 to-german-gold-600",
    },
    {
      title: "Career Counseling",
      description:
        "Strategic academic and professional pathway planning for your German success story.",
      icon: FaUserTie,
      color: "bg-appleGray-700",
      gradient: "from-appleGray-700 to-appleGray-800",
    },
    {
      title: "Language Training",
      description:
        "TestDaF and IELTS preparation with certified instructors for academic excellence.",
      icon: FaLanguage,
      color: "bg-german-red-500",
      gradient: "from-german-red-500 to-german-red-600",
    },
    {
      title: "Pre-Departure Support",
      description:
        "Complete preparation with cultural orientation and practical guidance for Germany.",
      icon: FaPlane,
      color: "bg-german-gold-500",
      gradient: "from-german-gold-500 to-german-gold-600",
    },
    {
      title: "Post-Arrival Assistance",
      description:
        "Ongoing support for accommodation, banking, and cultural integration in Germany.",
      icon: FaHome,
      color: "bg-appleGray-700",
      gradient: "from-appleGray-700 to-appleGray-800",
    },
  ];

  return (
    <section className="py-24 bg-appleGray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-4 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="bg-german-red rounded-full w-1 h-1 animate-pulse-slow"
            ></div>
          ))}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-appleGray-800 mb-6 leading-tight">
            Our Areas of <span className="text-gradient">Expertise</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-german-red to-german-gold mx-auto mb-6"></div>
          <p className="text-xl text-appleGray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive services designed with German precision and Apple-like
            attention to detail
          </p>
        </div>

        {/* Expertise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-3xl shadow-soft card-apple-hover border border-appleGray-200 relative overflow-hidden"
            >
              {/* Background Gradient Accent */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${area.gradient}`}
              ></div>

              {/* Icon */}
              <div
                className={`w-16 h-16 mb-6 ${area.color} rounded-2xl flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300`}
              >
                <area.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-appleGray-800 mb-4 group-hover:text-german-red transition-colors duration-300">
                {area.title}
              </h3>
              <p className="text-appleGray-600 leading-relaxed">
                {area.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-german-red to-german-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
