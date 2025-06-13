export default function AppointmentModal({ onClose }) {
  return (
    <div className="text-center relative">
      {/* Close Button */}

      {/* Appointment Image */}
      <img
        src="/app.webp"
        alt="Appointment"
        className="w-32 h-32 mx-auto object-cover rounded-lg shadow-md"
      />

      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900 mt-4">
        Book an Appointment
      </h1>

      {/* Description */}
      <p className="text-gray-600 mt-2">
        Schedule a convenient time for a quick 30-minute discussion.
      </p>

      {/* CTA Button */}
      <a
        href="https://calendly.com/gidzunipath/30min"
        target="_blank"
        className="mt-4 inline-block px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition"
      >
        Click here to book now
      </a>
    </div>
  );
}
