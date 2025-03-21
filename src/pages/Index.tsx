
import React from 'react';
import Hero from '@/components/Hero';
import ImageCard from '@/components/ImageCard';
import CategoryGrid from '@/components/CategoryGrid';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Camera, Upload, Database, Image, Diamond } from 'lucide-react';

const Index = () => {
  // Sample data for featured images
  const featuredImages = [
    {
      id: 1,
      title: "Purple Haze Macro Trichomes",
      category: "Macro",
      imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f92a?q=80&w=1200&auto=format&fit=crop",
      photographer: "Jane Smith",
      jsonLd: {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "contentUrl": "https://cannavisuals.com/images/purple-haze-trichomes.jpg",
        "name": "Purple Haze Macro Trichomes",
        "description": "High-resolution macro photograph showing trichome development on Purple Haze cannabis flower with amber and clear trichome heads visible.",
        "keywords": ["Purple Haze", "Trichomes", "Macro Photography", "Cannabis", "Resin Glands"],
        "creator": {
          "@type": "Person",
          "name": "Jane Smith"
        }
      }
    },
    {
      id: 2,
      title: "Indoor Cultivation Setup",
      category: "Cultivation",
      imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=1200&auto=format&fit=crop",
      photographer: "Mike Johnson",
      jsonLd: {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "contentUrl": "https://cannavisuals.com/images/indoor-cultivation.jpg",
        "name": "Indoor Cannabis Cultivation Setup",
        "description": "Professional indoor cannabis cultivation facility with LED lighting systems and automated irrigation showing vegetative stage plants.",
        "keywords": ["Indoor Growing", "Cultivation", "LED Lighting", "Hydroponics", "Grow Room"],
        "creator": {
          "@type": "Person",
          "name": "Mike Johnson"
        }
      }
    },
    {
      id: 3,
      title: "CO2 Extraction Laboratory",
      category: "Extraction",
      imageUrl: "https://images.unsplash.com/photo-1631556097153-42f21c8e8a3f?q=80&w=1200&auto=format&fit=crop",
      photographer: "Lab Technologies Inc.",
      jsonLd: {
        "@context": "https://schema.org/",
        "@type": "ImageObject",
        "contentUrl": "https://cannavisuals.com/images/co2-extraction.jpg",
        "name": "CO2 Extraction Laboratory",
        "description": "CO2 extraction equipment in a licensed cannabis processing facility with pressure vessels and collection chambers in operation.",
        "keywords": ["CO2 Extraction", "Cannabis Processing", "Laboratory", "Extraction Methods", "Concentrates"],
        "creator": {
          "@type": "Organization",
          "name": "Lab Technologies Inc."
        }
      }
    }
  ];

  // Sample data for featured categories
  const categories = [
    {
      id: 1,
      name: "Strain Photography",
      imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f92a?q=80&w=800&auto=format&fit=crop",
      count: 632
    },
    {
      id: 2,
      name: "Cultivation & Growing",
      imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=800&auto=format&fit=crop",
      count: 245
    },
    {
      id: 3,
      name: "Extraction Processes",
      imageUrl: "https://images.unsplash.com/photo-1631556097153-42f21c8e8a3f?q=80&w=800&auto=format&fit=crop",
      count: 108
    },
    {
      id: 4,
      name: "Dispensary Interiors",
      imageUrl: "https://images.unsplash.com/photo-1591084728795-1149f32d9866?q=80&w=800&auto=format&fit=crop",
      count: 74
    },
    {
      id: 5,
      name: "Products & Packaging",
      imageUrl: "https://images.unsplash.com/photo-1603355710080-d172888f30e3?q=80&w=800&auto=format&fit=crop",
      count: 193
    },
    {
      id: 6,
      name: "Laboratory Testing",
      imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=800&auto=format&fit=crop",
      count: 85
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <Hero />
        
        {/* Featured Images */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block bg-visual-900/80 text-visual-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                Featured Visuals
              </span>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Stunning Cannabis Imagery</h2>
              <p className="text-gray-300">
                Explore our curated collection of high-resolution cannabis photography with comprehensive metadata.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredImages.map((image) => (
                <ImageCard
                  key={image.id}
                  id={image.id}
                  title={image.title}
                  category={image.category}
                  imageUrl={image.imageUrl}
                  photographer={image.photographer}
                  jsonLd={image.jsonLd}
                />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                bg-visual-600 text-white hover:bg-visual-700 h-10 px-8 py-2"
              >
                Explore Full Gallery
              </Link>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-20 bg-black/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block bg-visual-900/80 text-visual-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                Organized Collection
              </span>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Browse by Category</h2>
              <p className="text-gray-300">
                Thousands of cannabis images organized into easy-to-navigate categories for all your project needs.
              </p>
            </div>
            
            <CategoryGrid categories={categories} />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <span className="inline-block bg-visual-900/80 text-visual-200 text-xs font-medium px-3 py-1 rounded-full mb-4">
                Platform Benefits
              </span>
              <h2 className="text-3xl font-bold mb-4 gradient-text">Designed for Visual AI</h2>
              <p className="text-gray-300">
                Our platform delivers cannabis imagery with rich metadata, optimized for machine learning and AI applications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Image className="h-6 w-6" />}
                title="AI-Ready Metadata"
                description="Every image includes comprehensive JSON-LD structured data for seamless integration with AI systems."
              />
              
              <FeatureCard
                icon={<Diamond className="h-6 w-6" />}
                title="Premium Quality"
                description="High-resolution, professionally shot cannabis photography with careful attention to detail and accuracy."
              />
              
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Structured Categories"
                description="Meticulously organized collection makes finding the perfect cannabis visuals quick and efficient."
              />
              
              <FeatureCard
                icon={<Camera className="h-6 w-6" />}
                title="Custom Photography"
                description="Need something specific? Our network of cannabis photographers can create custom imagery for your project."
              />
              
              <FeatureCard
                icon={<Upload className="h-6 w-6" />}
                title="Contributor Platform"
                description="Join our marketplace as a photographer and monetize your cannabis photography skills."
              />
              
              <FeatureCard
                icon={<Image className="h-6 w-6" />}
                title="Flexible Licensing"
                description="Clear, straightforward licensing options for all uses from personal projects to commercial applications."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-visual-900 to-visual-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">Ready to elevate your cannabis visuals?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-visual-100">
              Join developers, researchers, and cannabis businesses using our structured visual data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                bg-white text-visual-900 hover:bg-gray-100 h-10 px-8 py-2"
              >
                Browse Gallery
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors 
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 
                border border-white bg-transparent hover:bg-white/10 text-white h-10 px-8 py-2"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="p-6 glass-card rounded-xl hover-card-animation">
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-visual-900/50 text-visual-400 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

export default Index;
