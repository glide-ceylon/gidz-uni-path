export default function ExpertiseWithIcons() {
  const expertiseAreas = [
    {
      title: "University Applications",
      description:
        "Guiding students through applications to top universities worldwide with ease.",
      icon: "🎓",
    },
    {
      title: "Visa Assistance",
      description:
        "Expert guidance to simplify the complex student visa application process.",
      icon: "✈️",
    },
    {
      title: "Career Counseling",
      description:
        "Helping you choose the right academic and professional path for a bright future.",
      icon: "💼",
    },
    {
      title: "Language Training",
      description:
        "Preparing you for academic success with tailored language training programs.",
      icon: "🌐",
    },
    {
      title: "Pre-Departure Support",
      description:
        "Equipping students with all they need to transition smoothly to their new academic journey.",
      icon: "🛫",
    },
    {
      title: "Post-Arrival Assistance",
      description:
        "Providing ongoing support to students after their arrival, ensuring a comfortable adjustment.",
      icon: "🏡",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12 lg:w-10/12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Our Areas of Expertise
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertiseAreas.map((area, index) => (
            <div
              key={index}
              className="flex items-center bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              {/* Icon Section */}
              <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-4 mr-4">
                <span className="text-2xl">{area.icon}</span>
              </div>

              {/* Content Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {area.title}
                </h3>
                <p className="mt-2 text-gray-600">{area.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
