import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, ShieldCheck, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-32 overflow-hidden border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
              Find Your Dream Job <br />
              <span className="text-blue-600">Faster & Easier</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
              Connect with top employers, explore exciting opportunities, and take the next big step in your career journey.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 text-lg font-medium rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Highlights */}
      <section className="py-20 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">A Platform Built For Everyone</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Whether you're looking for work, hiring top talent, or managing operations, our platform has you covered.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Candidate */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Candidates</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Browse thousands of job listings, apply with a single click, and track your application status in real-time.
              </p>
              <Link to="/register" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700">
                Create a profile <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Employer */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Employers</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Post jobs instantly, manage applications efficiently, and hire the best candidates to grow your team.
              </p>
              <Link to="/register" className="inline-flex items-center text-green-600 font-medium hover:text-green-700">
                Start hiring <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>

            {/* Admin/Support */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Administration</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Manage the platform, resolve user tickets quickly, and ensure a smooth experience for all users.
              </p>
              <Link to="/login" className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700">
                Staff portal <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
