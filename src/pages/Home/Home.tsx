import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-gradient-to-br from-primary-50 to-green-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Voyagez <span className="text-primary-600">Responsable</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez le monde tout en préservant notre planète. 
              VoyagezVert vous accompagne dans vos aventures éco-responsables.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
                >
                  Mon Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
                  >
                    Commencer maintenant
                  </Link>
                  <Link
                    to="/login"
                    className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition-colors duration-200"
                  >
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-20 h-20 bg-primary-200 rounded-full opacity-20"></div>
          <div className="absolute top-40 left-10 w-16 h-16 bg-green-200 rounded-full opacity-20"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-primary-300 rounded-full opacity-20"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir VoyagezVert ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Notre plateforme vous aide à organiser des voyages qui respectent l'environnement
              sans compromettre votre plaisir de découvrir le monde.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hébergements Éco-responsables
              </h3>
              <p className="text-gray-600 mb-4">
                Découvrez des hébergements certifiés écologiques avec des labels durables.
              </p>
              <Link
                to="/hotels"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Explorer les hébergements →
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Transport Durable
              </h3>
              <p className="text-gray-600 mb-4">
                Comparez les moyens de transport selon leur impact environnemental.
              </p>
              <Link
                to="/transport"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Comparer les transports →
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Activités Durables
              </h3>
              <p className="text-gray-600 mb-4">
                Planifiez des activités qui respectent l'environnement et les communautés locales.
              </p>
              <Link
                to="/activities"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Découvrir les activités →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à voyager autrement ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez notre communauté de voyageurs éco-responsables et commencez votre aventure verte dès aujourd'hui.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors duration-200 inline-block"
            >
              Créer mon compte gratuitement
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;