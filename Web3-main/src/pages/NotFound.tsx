import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          </div>
          <div className="h-2 w-full bg-gradient-to-r from-primary-500 to-secondary-500 my-6"></div>
        </div>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;