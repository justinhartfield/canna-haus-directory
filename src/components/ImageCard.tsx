
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import CategoryBadge from './directory/CategoryBadge';
import { AspectRatio } from './ui/aspect-ratio';
import { Download, Share2, Heart } from 'lucide-react';
import { Button } from './ui/button';

interface ImageCardProps {
  title: string;
  category: string;
  imageUrl: string;
  photographer?: string;
  jsonLd: Record<string, any>;
  className?: string;
  id: number;
  resolution?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  title,
  category,
  imageUrl,
  photographer,
  jsonLd,
  className,
  id,
  resolution = '1920 × 1080',
}) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-xl overflow-hidden hover-card-animation", 
        className
      )}
    >
      <div className="image-card group">
        <AspectRatio ratio={16/9}>
          <img 
            src={imageUrl} 
            alt={title} 
            className="object-cover w-full h-full"
          />
        </AspectRatio>
        <div className="image-card-overlay">
          <div className="flex items-center justify-between mb-1">
            <CategoryBadge category={category} className="bg-visual-900/80 text-visual-100" />
            <span className="text-xs text-gray-300">{resolution}</span>
          </div>
          <h3 className="text-white font-medium text-lg mb-1">{title}</h3>
          {photographer && (
            <p className="text-xs text-gray-300 mb-2">by {photographer}</p>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50">
                <Heart className="h-4 w-4 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50">
                <Share2 className="h-4 w-4 text-white" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="bg-visual-600 hover:bg-visual-700 text-white text-xs px-3 py-1 h-8 rounded-full">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
