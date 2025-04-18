
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileSearch, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4 max-w-md">
        <div className="bg-sehat-light inline-flex rounded-full p-4 mb-6">
          <FileSearch className="h-12 w-12 text-sehat-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-sehat-dark">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved to another URL.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="default" className="bg-sehat-primary hover:bg-sehat-secondary">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous Page
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
