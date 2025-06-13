"use client";
import React from "react";
import { FaUserGraduate, FaBriefcase, FaArrowRight } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function VisaOptionsPage() {
  const router = useRouter();
  return (
    <div className="  flex flex-col items-center justify-center p-4 container mx-auto">
      <div className="max-w-5xl w-full p-8 ">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 ">
          Choose Your Visa Type
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Student Visa Option */}
          <div className="flex flex-col items-center  p-6 rounded-lg   transition-shadow duration-300 broder-gray-100 border ">
            <div className="mb-4">
              <Image
                src="/student-visa.jpeg" // Replace with your image path
                alt="Student Visa"
                width={150}
                height={150}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-4">
              <FaUserGraduate className="mr-2 text-blue-500" />
              Apply for Student Visa
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Start your academic journey abroad. Apply now and access top-tier
              educational opportunities.
            </p>
            <button
              onClick={() => router.push("apply-now/student")}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring focus:ring-blue-300 transition"
            >
              Apply Now <FaArrowRight className="ml-2" />
            </button>
          </div>

          {/* Work Visa Option */}
          <div className="flex flex-col items-center  p-6 rounded-lg   transition-shadow duration-300 broder-gray-100 border">
            <div className="mb-4">
              <Image
                src="/work-visa.jpeg" // Replace with your image path
                alt="Work Visa"
                width={150}
                height={150}
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 flex items-center mb-4">
              <FaBriefcase className="mr-2 text-green-500" />
              Apply for Work Visa
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Advance your career abroad. Apply for a work visa and unlock new
              opportunities.
            </p>
            <button
              onClick={() => router.push("apply-now/work")}
              className="flex items-center justify-center w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring focus:ring-green-300 transition"
            >
              Apply Now <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 ">
          Start Your Application Now – Fast & Easy!
        </h1>
        <div className="grid w-10/12 m-auto grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div>

        <Image
            src="/Step_1.png"
            alt="step1"
            width={200}
            height={600}
            className=" h-auto rounded-lg mt-11"
          />
          <p className=" text-xl font-bold ">Submit the required documents online</p>
          
        </div>
        <div>
        <Image
            src="/Step_2.png"
            alt="step2"
            width={200}
            height={400}
            className=" h-40 rounded-lg mt-8 "
          
          />
          <p className=" text-xl font-bold ">Your documents will be checked for completeness</p>
        </div>
         <div>
         <Image
            src="/Step_3.png"
            alt="step3"
            width={200}
            height={400}
            className=" h-48 rounded-lg "
          />
          <p className="  text-xl font-bold ">You will be notified soon as the review has been completed.</p>
         </div>
          
        </div>
      </div>
    </div>
  );
}
