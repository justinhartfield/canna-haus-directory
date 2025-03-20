
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: 'API Docs', path: '/api-docs' },
    { name: 'Analytics', path: '/analytics' },
  ];

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
          
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
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
          
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
              border border-input bg-background hover:bg-accent hover:text-accent-foreground 
              h-9 px-4 py-2 relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In</span>
              <span className="absolute inset-0 bg-cannabis-100 dark:bg-cannabis-800 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
