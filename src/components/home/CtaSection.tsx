
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const CtaSection: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <section className="py-20 bg-cannabis-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to integrate with our cannabis data?</h2>
        <p className="max-w-2xl mx-auto mb-8 text-cannabis-50">
          Join researchers, AI developers, and cannabis businesses leveraging our structured data for innovation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/api-docs"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
            bg-white text-cannabis-800 hover:bg-cannabis-50 h-10 px-8 py-2"
          >
            Explore API
          </Link>
          <Link
            to="/directory"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
            border border-white bg-transparent hover:bg-white/10 text-white h-10 px-8 py-2"
          >
            Browse Directory
          </Link>
          {user && (
            <Link
              to="/admin"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
              bg-cannabis-800 text-white hover:bg-cannabis-900 h-10 px-8 py-2"
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
