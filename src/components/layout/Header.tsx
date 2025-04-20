
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HeartPulse, 
  Menu, 
  X 
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <HeartPulse className="h-8 w-8 text-sehat-primary" />
          <span className="font-bold text-xl text-foreground transition-colors">Sehat<span className="text-sehat-primary">AI</span></span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-sehat-primary transition">
            Home
          </Link>
          <Link to="/diabetes" className="text-foreground hover:text-sehat-primary transition">
            Diabetes
          </Link>
          <Link to="/heart-disease" className="text-foreground hover:text-sehat-primary transition">
            Heart Disease
          </Link>
          <Link to="/parkinsons" className="text-foreground hover:text-sehat-primary transition">
            Parkinson's
          </Link>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
           
          </div>
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-2 transition-colors">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-foreground hover:text-sehat-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/diabetes" 
              className="text-foreground hover:text-sehat-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Diabetes
            </Link>
            <Link 
              to="/heart-disease" 
              className="text-foreground hover:text-sehat-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Heart Disease
            </Link>
            <Link 
              to="/parkinsons" 
              className="text-foreground hover:text-sehat-primary transition py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Parkinson's
            </Link>
            
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
