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
  FaClock,
  FaGlobe,
  FaWhatsapp,
  FaCheckCircle,
  FaPaperPlane,
  FaUsers,
  FaHandshake,
  FaComments,
} from "react-icons/fa";
import axios from "axios";

// Success Dialog Component
const SuccessDialog = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-3xl shadow-large text-center max-w-md mx-4">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="w-8 h-8 text-sky-500" />
        </div>
        <h3 className="text-2xl font-bold text-appleGray-900 mb-2">Success!</h3>{" "}
        <p className="text-appleGray-600 mb-6">
          Your message has been sent successfully. We&apos;ll get back to you
          soon!
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 btn-apple-hover shadow-soft"
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const template = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Subject:</strong> ${formData.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message}</p>
    `;

    const success = await handleSent(
      // formData.email,
      "gidzunipath@gmail.com",
      "gidzunipath@gmail.com",
      `Contact Form: ${formData.subject}`,
      template
    );

    if (success) {
      setShowSuccessDialog(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }

    setIsLoading(false);
  };

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
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-appleGray-50 via-white to-appleGray-100 pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-transparent to-sky-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="space-y-8 animate-fade-in-up">
            <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl flex items-center justify-center mx-auto shadow-soft">
              <FaComments className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-appleGray-900">
              Get In
              <span className="block text-gradient bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                Touch
              </span>
            </h1>{" "}
            <p className="text-xl text-appleGray-600 max-w-2xl mx-auto">
              Ready to start your journey abroad? We&apos;re here to help you
              every step of the way.
            </p>
            {/* Quick Contact Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8">
              {" "}
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-2xl font-bold text-appleGray-900">500+</h3>
                <p className="text-appleGray-600">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaHandshake className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-2xl font-bold text-appleGray-900">24/7</h3>
                <p className="text-appleGray-600">Support Available</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaGlobe className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-2xl font-bold text-appleGray-900">15+</h3>
                <p className="text-appleGray-600">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Contact Cards Section */}
      <section className="py-16 relative">
        {/* Additional floating elements */}
        <div
          className="absolute top-20 left-16 w-24 h-24 bg-sky-400/8 rounded-2xl animate-float"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-20 right-12 w-20 h-20 bg-sky-500/10 rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-40 right-1/4 w-16 h-16 bg-sky-600/12 rounded-full animate-float"
          style={{ animationDelay: "2.5s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-appleGray-900 mb-4">
              Ways to Reach Us
            </h2>
            <p className="text-xl text-appleGray-600 max-w-2xl mx-auto">
              Choose the most convenient way to connect with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Call Us Card */}
            <div className="bg-white rounded-3xl p-8 shadow-large hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaPhoneAlt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
                Call Us
              </h3>
              <p className="text-appleGray-600 mb-4">
                Monday to Friday, 9:30 AM to 5:00 PM
              </p>
              <div className="space-y-2">
                <a
                  href="tel:+4915566389194"
                  className="block text-lg font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  +49 155 6638 9194
                </a>
                <div className="flex items-center justify-center space-x-2 text-appleGray-500">
                  <FaClock className="w-4 h-4" />
                  <span className="text-sm">Response within 1 hour</span>
                </div>
              </div>
            </div>

            {/* Visit Us Card */}
            <div className="bg-white rounded-3xl p-8 shadow-large hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaMapMarkerAlt className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
                Visit Us
              </h3>
              <p className="text-appleGray-600 mb-4">
                Monday to Friday, 9:30 AM to 5:00 PM
              </p>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-appleGray-800">
                  Arasady Road, Kaddudai
                </p>
                <p className="text-appleGray-600">Manipay, Jaffna, Sri Lanka</p>
                <div className="flex items-center justify-center space-x-2 text-appleGray-500">
                  <FaMapMarkerAlt className="w-4 h-4" />
                  <span className="text-sm">By appointment</span>
                </div>
              </div>
            </div>

            {/* Email Us Card */}
            <div className="bg-white rounded-3xl p-8 shadow-large hover:shadow-xl transition-all duration-300 text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaEnvelope className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
                Email Us
              </h3>
              <p className="text-appleGray-600 mb-4">
                For general or business inquiries
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:gidzunipath@gmail.com"
                  className="block text-lg font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  gidzunipath@gmail.com
                </a>
                <div className="flex items-center justify-center space-x-2 text-appleGray-500">
                  <FaPaperPlane className="w-4 h-4" />
                  <span className="text-sm">Response within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Contact Form & Map Section */}
      <section className="py-16 bg-gradient-to-br from-sky-500/5 to-sky-600/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {" "}
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-large relative overflow-hidden animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-400/10 to-sky-600/10 rounded-full -translate-y-16 translate-x-16"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaPaperPlane className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-appleGray-900 mb-2">
                    Send us a Message
                  </h3>{" "}
                  <p className="text-appleGray-600">
                    We appreciate your inquiry. Leave us a message, and
                    we&apos;ll reach out shortly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="Student Visa Inquiry">
                        Student Visa Inquiry
                      </option>
                      <option value="Work Visa Inquiry">
                        Work Visa Inquiry
                      </option>
                      <option value="General Information">
                        General Information
                      </option>
                      <option value="Technical Support">
                        Technical Support
                      </option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-appleGray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      rows="6"
                      placeholder="Tell us how we can help you..."
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-appleGray-200 rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-4 rounded-2xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 btn-apple-hover shadow-soft flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        <span>Sending Message...</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FaPaperPlane className="w-5 h-5 mr-3" />
                        <span>Send Message</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>{" "}
            {/* Map */}
            <div className="bg-white rounded-3xl p-8 shadow-large animate-fade-in-up">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-appleGray-900 mb-2">
                  Find Us Here
                </h3>
                <p className="text-appleGray-600">
                  Visit our office for in-person consultation
                </p>
              </div>

              <div className="relative w-full h-80 rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d695.1390159393035!2d79.98636189318711!3d9.740627382669304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afe5347809f2c81%3A0xc026f77fc091b132!2sThe%20gifery%20shop!5e0!3m2!1sen!2slk!4v1738508392870!5m2!1sen!2slk"
                  className="w-full h-full"
                  style={{ border: "0" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Social Media Section */}
      <section className="py-16 relative">
        {/* Additional floating elements */}
        <div
          className="absolute top-16 left-12 w-28 h-28 bg-sky-400/6 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-24 right-16 w-22 h-22 bg-sky-500/8 rounded-2xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-32 right-1/3 w-18 h-18 bg-sky-600/10 rounded-full animate-float"
          style={{ animationDelay: "3s" }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-appleGray-900 mb-4">
              Follow Our Journey
            </h2>
            <p className="text-xl text-appleGray-600 max-w-2xl mx-auto mb-12">
              Stay updated with the latest news, success stories, and visa
              updates
            </p>
          </div>

          <div className="flex justify-center space-x-6 mb-8">
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@gideon_ingermany?_t=8qm4y7odswq&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-soft"
            >
              <FaTiktok className="w-8 h-8" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/gideon_ingermany?igsh=MWVmaXk0M2J2YzBzNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-soft"
            >
              <FaInstagram className="w-8 h-8" />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/gideonxofficial?mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-soft"
            >
              <FaFacebook className="w-8 h-8" />
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@gideonxofficial?si=7hO1rIXzrDMpJ0Wk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-soft"
            >
              <FaYoutube className="w-8 h-8" />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/4915566389194"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-soft"
            >
              <FaWhatsapp className="w-8 h-8" />
            </a>
          </div>

          <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your Journey?
            </h3>{" "}
            <p className="text-sky-100 mb-6 max-w-2xl mx-auto">
              Don&apos;t wait! Your dream of studying or working abroad is just
              one step away. Contact us today and let&apos;s make it happen
              together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/apply-now"
                className="inline-flex items-center justify-center space-x-2 bg-white text-sky-600 px-8 py-3 rounded-2xl font-semibold hover:bg-appleGray-50 transition-all duration-300 btn-apple-hover shadow-soft"
              >
                <span>Apply Now</span>
                <FaPaperPlane className="w-4 h-4" />
              </a>
              <a
                href="tel:+4915566389194"
                className="inline-flex items-center justify-center space-x-2 bg-sky-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-sky-700 transition-all duration-300 btn-apple-hover shadow-soft"
              >
                <FaPhoneAlt className="w-4 h-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Success Dialog */}
      {showSuccessDialog && (
        <SuccessDialog onClose={() => setShowSuccessDialog(false)} />
      )}
    </div>
  );
}
