"use client";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaQuoteLeft,
  FaChevronLeft,
  FaChevronRight,
  FaUser,
  FaGraduationCap,
} from "react-icons/fa";
import Image from "next/image";

const testimonialsData = [
  {
    id: 5,
    text: "I applied for my visa through GIDZ UniPath, and their consultants made my journey to Germany seamless. The entire process was quick and efficient, allowing me to focus on my goals without unnecessary stress. They guided me through every step with exceptional support and expertise. I highly recommend GIDZ UniPath to anyone looking to start their journey abroad with confidence.",
    name: "Sri Skandarajah Dilrukshan",
    avatar: "/stu1.jpg",
    program: "Computer Science",
    university: "Technical University of Munich",
    rating: 5,
    location: "Munich, Germany",
  },
  {
    id: 6,
    text: "I had an excellent experience with GIDZ UniPath during my student visa process to Germany. They guided me step by step, starting from scratch, and made the entire process much smoother. GIDZ UniPath provided reliable support in preparing me for the requirements. Their expertise helped me navigate everything with confidence. If you're looking to study in Germany, I highly recommend GIDZ UniPath for their clear guidance and trustworthy assistance!",
    name: "Gracian Christ",
    avatar: "/stu2.jpg",
    program: "Business Administration",
    university: "University of Cologne",
    rating: 5,
    location: "Cologne, Germany",
  },
  {
    id: 1,
    text: "Thank you very much, GIDZ UniPath, for handling my student visa for a tuition-free public university in Germany. I received my visa in a week with their exceptional guidance and support.",
    name: "JK Jey Kison",
    avatar: null,
    program: "Engineering",
    university: "RWTH Aachen University",
    rating: 5,
    location: "Aachen, Germany",
  },
  {
    id: 2,
    text: "I appreciate their commitment and quick responses. They were always reachable and responded to us very calmly with German precision and professionalism.",
    name: "TP Tharani Paramasivam",
    avatar: null,
    program: "Medicine",
    university: "Charité - Universitätsmedizin Berlin",
    rating: 5,
    location: "Berlin, Germany",
  },
];

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isAutoPlaying]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-sky-400/5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-appleGray-800 mb-6 leading-tight">
            Success Stories from <span className="text-gradient">Germany</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-sky-400 mx-auto mb-6"></div>
          <p className="text-xl text-appleGray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from our students who achieved their German education dreams
            with our premium guidance
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="relative bg-appleGray-50 rounded-3xl p-8 lg:p-12 shadow-large border border-appleGray-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-german-red to-german-gold"></div>

            <div className="relative z-10">
              {/* Quote Icon */}{" "}
              <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mb-8 shadow-soft">
                <FaQuoteLeft className="w-8 h-8 text-white" />
              </div>
              {/* Testimonial Content */}
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Text Content */}
                <div className="lg:col-span-2">
                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(testimonialsData[activeIndex].rating)].map(
                      (_, i) => (
                        <FaStar key={i} className="w-5 h-5 text-sky-400" />
                      )
                    )}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg lg:text-xl text-appleGray-700 leading-relaxed mb-8 italic">
                    "{testimonialsData[activeIndex].text}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-german-red to-german-gold rounded-full flex items-center justify-center shadow-soft">
                      {testimonialsData[activeIndex].avatar ? (
                        <Image
                          src={testimonialsData[activeIndex].avatar}
                          alt={testimonialsData[activeIndex].name}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <FaUser className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-appleGray-800 text-lg">
                        {testimonialsData[activeIndex].name}
                      </div>
                      <div className="text-appleGray-600 text-sm">
                        {testimonialsData[activeIndex].program}
                      </div>
                      <div className="text-german-red font-semibold text-sm">
                        {testimonialsData[activeIndex].university}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Element */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-64 h-64 bg-gradient-to-br from-german-black via-german-red to-german-gold rounded-3xl shadow-large flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/40"></div>
                    <div className="relative z-10 text-center text-white">
                      <FaGraduationCap className="w-16 h-16 mx-auto mb-4 animate-float" />
                      <div className="font-bold text-lg">
                        {testimonialsData[activeIndex].location}
                      </div>
                      <div className="text-sm opacity-90">Living the Dream</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-12">
            {/* Previous Button */}{" "}
            <button
              onClick={handlePrev}
              className="group w-12 h-12 bg-appleGray-100 hover:bg-sky-500 rounded-2xl flex items-center justify-center transition-all duration-300 btn-apple-hover"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <FaChevronLeft className="w-5 h-5 text-appleGray-600 group-hover:text-white transition-colors duration-300" />
            </button>
            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-sky-500 shadow-soft"
                      : "bg-appleGray-300 hover:bg-appleGray-400"
                  }`}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                />
              ))}
            </div>
            {/* Next Button */}{" "}
            <button
              onClick={handleNext}
              className="group w-12 h-12 bg-appleGray-100 hover:bg-sky-500 rounded-2xl flex items-center justify-center transition-all duration-300 btn-apple-hover"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              <FaChevronRight className="w-5 h-5 text-appleGray-600 group-hover:text-white transition-colors duration-300" />
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "1000+", label: "Students Placed" },
            { value: "50+", label: "Partner Universities" },
            { value: "98%", label: "Visa Success Rate" },
            { value: "5★", label: "Average Rating" },
          ].map((stat, index) => (
            <div key={index} className="group">
              <div className="text-3xl lg:text-4xl font-bold text-german-red mb-2 group-hover:text-german-gold transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-appleGray-600 text-sm lg:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const handleNext = () => {
  setActiveIndex((prevIndex) =>
    prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
  );
};

useEffect(() => {
  const interval = setInterval(() => {
    setActiveIndex((prevIndex) =>
      prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
    );
  }, 12000); // 12-second interval for better readability

  return () => clearInterval(interval);
}, []);

return (
  <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
          <FaStar className="w-4 h-4" />
          <span>99% Success Rate</span>
        </div>
        <h2 className="text-headline-lg font-sf-pro text-midnight">
          Student Success Stories
        </h2>
        <p className="text-body-lg text-slate-600 max-w-2xl mx-auto">
          Real stories from our students who achieved their German education
          dreams with our premium guidance.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Main Testimonial Display */}
        <div className="relative overflow-hidden rounded-3xl">
          <div
            className="flex transition-all duration-700 ease-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {testimonialsData.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-none w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12"
              >
                {/* Quote Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <FaQuoteLeft className="w-8 h-8 text-primary-600" />
                  </div>
                </div>
                {/* Testimonial Text */}
                <blockquote className="text-body-lg text-slate-700 text-center leading-relaxed mb-8 max-w-3xl mx-auto">
                  &ldquo;{testimonial.text}&rdquo;
                </blockquote>

                {/* Rating */}
                <div className="flex justify-center space-x-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>

                {/* Student Info */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-4">
                    {" "}
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-white"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white ${
                        testimonial.avatar ? "hidden" : "flex"
                      }`}
                    >
                      <FaUser className="w-7 h-7" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-midnight text-lg">
                        {testimonial.name}
                      </h4>
                      <div className="text-sm text-slate-500 space-y-1">
                        <div>{testimonial.program}</div>
                        <div className="font-medium text-primary-600">
                          {testimonial.university}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-white text-midnight rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          aria-label="Previous testimonial"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm hover:bg-white text-midnight rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
          aria-label="Next testimonial"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-8 space-x-3">
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-primary-600 w-8"
                : "bg-slate-300 hover:bg-primary-400"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Success Stats */}
      <div className="mt-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-8 text-white">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-sf-pro font-semibold">
            Join Our Success Community
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12">
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-primary-100">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-primary-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
