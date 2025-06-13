"use client";
import { useEffect, useState } from "react";
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaUser } from "react-icons/fa";
import Image from "next/image";

const testimonialsData = [
  {
    id: 5,
    text: "I applied for my visa through Gidz Uni Path, and their consultants made my journey to Germany seamless. The entire process was quick and efficient, allowing me to focus on my goals without unnecessary stress. They guided me through every step with exceptional support and expertise. I highly recommend Gidz Uni Path to anyone looking to start their journey abroad with confidence.",
    name: "Sri Skandarajah Dilrukshan",
    avatar: "/stu1.jpg",
    program: "Computer Science",
    university: "TU Munich",
    rating: 5
  },
  {
    id: 6,
    text: "I had an excellent experience with Gidz Uni Path during my student visa process to Germany. They guided me step by step, starting from scratch, and made the entire process much smoother. Gidz Uni Path provided reliable support in preparing me for the requirements. Their expertise helped me navigate everything with confidence. If you're looking to study in Germany, I highly recommend Gidz Uni Path for their clear guidance and trustworthy assistance!",
    name: "Gracian Christ",
    avatar: "/stu2.jpg",
    program: "Business Administration",
    university: "University of Cologne",
    rating: 5
  },
  {
    id: 1,
    text: "Thank you very much, Gidzuni Education Pathways, for handling my student visa for a tuition-free public university in Germany. I received my visa in a week.",
    name: "JK Jey Kison",
    avatar: null,
    program: "Engineering",
    university: "RWTH Aachen",
    rating: 5
  },
  {
    id: 2,
    text: "I appreciate their commitment and quick responses. They were always reachable and responded to us very calmly.",
    name: "TP Tharani Paramasivam",
    avatar: null,
    program: "Medicine",
    university: "Charité Berlin",
    rating: 5
  },
];

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

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
            Real stories from our students who achieved their German education dreams with our premium guidance.
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
                    <div className="flex items-center space-x-4">                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-full object-cover shadow-lg border-4 border-white"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center text-white ${testimonial.avatar ? 'hidden' : 'flex'}`}>
                        <FaUser className="w-7 h-7" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-midnight text-lg">
                          {testimonial.name}
                        </h4>
                        <div className="text-sm text-slate-500 space-y-1">
                          <div>{testimonial.program}</div>
                          <div className="font-medium text-primary-600">{testimonial.university}</div>
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
}
