// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Public Navbar will be included separately in layout – we can also embed it here, but we'll use a layout in App.tsx */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Handpicked luxury travel deals, exclusive offers, and unforgettable experiences.
        </p>
        <Link
          to="/login"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started → Sign-In
        </Link>
      </div>
      {/* Add more sections like features, testimonials if needed */}
    </div>
  );
};

export default LandingPage;