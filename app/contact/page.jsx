"use client";
import React, { useState } from "react";
import {
  FaTiktok,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import axios from "axios";

// Success Dialog Component
const SuccessDialog = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold text-gray-800">Success!</h3>
        <p className="mt-2 text-gray-600">Message sent successfully.</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

const handleSent = async (senderEmail, recipientEmail, subject, template) => {
  try {
    await axios.post("/api/send_email", {
      senderEmail,
      recipientEmail,
      subject,
      template,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    const { name, email, message } = formData;

    const emailTemplate = `
      <h1>New Message from ${name}</h1>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    const isEmailSent = await handleSent(
      "gidzunipath@gmail.com",
      "gidzunipath@gmail.com",
      "New Message from Contact Form",
      emailTemplate
    );

    setIsLoading(false);

    if (isEmailSent) {
      setShowSuccessDialog(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      alert("Failed to send email. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-100">
      <div className="container lg:w-10/12 mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900">Get Advice Now</h2>
        <p className="mt-4 text-lg text-gray-700">
          Get in touch for more information.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4 md:px-0">
          {/* Card 1 - Call Us */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FaPhoneAlt className="text-green-500 text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Call us</h3>
            <p className="mt-2 text-gray-600">
              Monday to Friday, 9:30 am to 5:00 pm
            </p>
            <div className="mt-4">
              <span className="text-gray-800">
                <strong>Phone:</strong> +4915566389194
              </span>
            </div>
          </div>

          {/* Card 2 - Visit Us */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <FaMapMarkerAlt className="text-yellow-500 text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Visit us</h3>
            <p className="mt-2 text-gray-600">
              Monday to Friday, 9:30 am to 5:00 pm
            </p>
            <div className="mt-4">
              <span className="text-gray-800">
                <strong>Address:</strong> Arasady Road, Kaddudai, Manipay,
                Jaffna
              </span>
            </div>
          </div>

          {/* Card 3 - Email Us */}
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="flex justify-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <FaEnvelope className="text-blue-600 text-2xl" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Email us</h3>
            <p className="mt-2 text-gray-600">
              For general or business inquiries email us
            </p>
            <div className="mt-4">
              <span className="text-gray-800">
                <strong>Email:</strong> gidzunipath@gmail.com
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1   md:grid-cols-2 gap-12 items-stretch">
          {/* Child 1 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              We appreciate your inquiry. Leave us a message, and we will reach
              out shortly.
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <span className="mr-2">Sending...</span>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>

          {/* Child 2 */}
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow h-full flex">
            <div className="w-full max-w-lg mx-auto">
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                {" "}
                {/* 16:9 Aspect Ratio */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d695.1390159393035!2d79.98636189318711!3d9.740627382669304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe5347809f2c81%3A0xc026f77fc091b132!2sThe%20gifery%20shop!5e0!3m2!1sen!2slk!4v1738508392870!5m2!1sen!2slk"
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800">Follow Us</h3>
          <div className="mt-6 flex space-x-6 justify-center">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@gideon_ingermany?_t=8qm4y7odswq&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FaTiktok className="w-8 h-8" />
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/gidz_unipath"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <FaInstagram className="w-8 h-8" />
            </a>
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/7R7Xzr4QYjarYTNJ/?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              <FaFacebook className="w-8 h-8" />
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com/@gidzunipath?si=WoGKw0TkY3Aj0Ar-"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-500 transition-colors"
            >
              <FaYoutube className="w-8 h-8" />
            </a>
          </div>
        </div>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <SuccessDialog onClose={() => setShowSuccessDialog(false)} />
      )}
    </section>
  );
}
