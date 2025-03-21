
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilter from '@/components/SearchFilter';
import ImageCard from '@/components/ImageCard';
import { useDirectoryFilters } from '@/hooks/useDirectoryFilters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gallery = () => {
  const { 
    filteredData, 
    handleSearch, 
    handleFilter, 
    clearFilters 
  } = useDirectoryFilters();

  // Transform data into image format
  const sampleImages = [
    {
      id: 1,
      title: "Purple Haze Macro Trichomes",
      category: "Macro",
      imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f92a?q=80&w=1200&auto=format&fit=crop",
      photographer: "Jane Smith",
      resolution: "4096 × 2730",
      jsonLd: {}
    },
    {
      id: 2,
      title: "Indoor Cultivation Setup",
      category: "Cultivation",
      imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=1200&auto=format&fit=crop",
      photographer: "Mike Johnson",
      resolution: "3840 × 2160",
      jsonLd: {}
    },
    {
      id: 3,
      title: "CO2 Extraction Laboratory",
      category: "Extraction",
      imageUrl: "https://images.unsplash.com/photo-1631556097153-42f21c8e8a3f?q=80&w=1200&auto=format&fit=crop",
      photographer: "Lab Technologies Inc.",
      resolution: "4000 × 2667",
      jsonLd: {}
    },
    {
      id: 4,
      title: "Dispensary Interior Design",
      category: "Retail",
      imageUrl: "https://images.unsplash.com/photo-1591084728795-1149f32d9866?q=80&w=1200&auto=format&fit=crop",
      photographer: "Modern Spaces",
      resolution: "3600 × 2400",
      jsonLd: {}
    },
    {
      id: 5,
      title: "OG Kush Close-Up",
      category: "Strains",
      imageUrl: "https://images.unsplash.com/photo-1603355710080-d172888f30e3?q=80&w=1200&auto=format&fit=crop",
      photographer: "Cannabis Chronicles",
      resolution: "5000 × 3333",
      jsonLd: {}
    },
    {
      id: 6,
      title: "Cannabis Sample Testing",
      category: "Laboratory",
      imageUrl: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1200&auto=format&fit=crop",
      photographer: "Research Labs",
      resolution: "4200 × 2800",
      jsonLd: {}
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl font-bold mb-2 gradient-text">Cannabis Visual Gallery</h1>
            <p className="text-gray-300">
              Browse our extensive collection of high-quality cannabis imagery, categorized for easy discovery and integration.
            </p>
            
            <div className="mt-8">
              <SearchFilter
                onSearch={handleSearch}
                onFilter={handleFilter}
                className="mb-8"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-12">
            <div className="flex justify-center">
              <TabsList className="bg-gray-900/60">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="strains">Strains</TabsTrigger>
                <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
                <TabsTrigger value="extraction">Extraction</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="laboratory">Laboratory</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    id={image.id}
                    title={image.title}
                    category={image.category}
                    imageUrl={image.imageUrl}
                    photographer={image.photographer}
                    resolution={image.resolution}
                    jsonLd={image.jsonLd}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="strains" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleImages.filter(img => img.category === "Strains" || img.category === "Macro").map((image) => (
                  <ImageCard
                    key={image.id}
                    id={image.id}
                    title={image.title}
                    category={image.category}
                    imageUrl={image.imageUrl}
                    photographer={image.photographer}
                    resolution={image.resolution}
                    jsonLd={image.jsonLd}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Additional tabs content would follow similar pattern */}
          </Tabs>
          
          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center justify-center rounded-full bg-visual-900/80 px-4 py-2">
              <span className="text-visual-200 text-sm">Showing 6 of 1,243 images</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Gallery;
