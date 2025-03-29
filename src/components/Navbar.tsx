
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AuthButtons } from './AuthButtons';
import { useAuth } from '@/context/AuthContext';
import { Menu, X } from 'lucide-react'; // Import icons for mobile menu

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  
  // Log the user object to check if it's properly loaded
  console.log("Current user in Navbar:", user);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Always include base navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'API Docs', path: '/api-docs' },
    { name: 'Analytics', path: '/analytics' },
  ];
  
  // Add Admin link if user is authenticated
  const allLinks = user 
    ? [...navLinks, { name: 'Admin', path: '/admin' }] 
    : navLinks;

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-nav',
      scrolled ? 'py-3' : 'py-5'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary font-semibold text-xl"
            aria-label="CannaHaus Directory"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="w-6 h-6"
            >
              <path d="M12 2a9 9 0 0 1 9 9c0 3.6-3.4 6.2-5 8.1V22a2.95 2.95 0 0 1-4.5 2.4 2.95 2.95 0 0 1-4.5-2.4v-2.9c-1.6-1.9-5-4.5-5-8.1a9 9 0 0 1 9-9Z" />
            </svg>
            <span className="hidden sm:inline-block">CannaHaus</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {allLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <AuthButtons />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3">
            <nav className="flex flex-col space-y-4">
              {allLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary py-2",
                    location.pathname === link.path 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
