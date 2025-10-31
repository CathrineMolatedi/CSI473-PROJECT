import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">NeighborGuard</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Keeping Your Neighborhood
            <br />
            <span className="text-blue-600">Safe and Secure</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Our advanced patrol system helps communities stay connected, protected, and informed.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Get Started
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50">
              Learn More
            </button>
          </div>
          <div className="mt-12 text-gray-500">
            <p>Trusted by 500+ communities</p>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Built for Every Member of Your Community
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Administrator Card */}
            <div className="feature-card">
              <div className="feature-icon admin">
                <span className="text-2xl">👑</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Administrator</h3>
              <p className="text-gray-600 mb-4">
                Manage patrol schedules, member access, and view comprehensive reports on community safety activities.
              </p>
              <Link to="/dashboard/admin" className="text-blue-600 font-semibold">Learn more →</Link>
            </div>

            {/* Security Officer Card */}
            <div className="feature-card">
              <div className="feature-icon officer">
                <span className="text-2xl">👮</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Officer</h3>
              <p className="text-gray-600 mb-4">
                Access patrol routes, record incidents, and communicate with team members in real-time during patrols.
              </p>
              <Link to="/dashboard/officer" className="text-blue-600 font-semibold">Learn more →</Link>
            </div>

            {/* Resident Card */}
            <div className="feature-card">
              <div className="feature-icon resident">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Resident</h3>
              <p className="text-gray-600 mb-4">
                Receive alerts, report suspicious activity, and stay connected with neighborhood watch efforts.
              </p>
              <Link to="/dashboard/resident" className="text-blue-600 font-semibold">Learn more →</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
