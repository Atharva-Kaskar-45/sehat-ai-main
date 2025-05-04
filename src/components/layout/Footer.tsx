import { Link } from 'react-router-dom';
import { HeartPulse, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-sehat-dark text-white mt-auto">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-sehat-primary" />
              <span className="font-bold text-xl text-white">Sehat<span className="text-sehat-primary">AI</span></span>
            </Link>
            <p className="mt-4 text-gray-300">
              AI-powered health risk assessment for diabetes, heart disease, and Parkinson's disease.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-sehat-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/diabetes" className="text-gray-300 hover:text-sehat-primary transition">
                  Diabetes
                </Link>
              </li>
              <li>
                <Link to="/heart-disease" className="text-gray-300 hover:text-sehat-primary transition">
                  Heart Disease
                </Link>
              </li>
              <li>
                <Link to="/parkinsons" className="text-gray-300 hover:text-sehat-primary transition">
                  Parkinson's
                </Link>
              </li>
              
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Made with ❤️ by Atharva Kaskar</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <a href="https://www.linkedin.com/in/atharva-kaskar-00114324a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </li>
              <li className="flex items-start">
                <a href="https://github.com/Atharva-Kaskar-45" target="_blank" rel="noopener noreferrer">GitHub</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SehatAI. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            <span className="text-xs">
              This tool is for informational purposes only and not intended as medical advice.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
