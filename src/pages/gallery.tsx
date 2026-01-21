import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import Layout from '@/components/Layout';
import { UnifiedSEO } from '@/components/UnifiedSEO';
import { Button } from '@/components/ui/button';
import { pageSEO, siteConfig } from '@/config/seo';
import { 
  Grid3X3, 
  ZoomIn, 
  X, 
  ArrowLeft, 
  ArrowRight,
  Download,
  Image as ImageIcon
} from 'lucide-react';

interface GalleryImage {
  src: string;
  alt: string;
  category: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // All images from the Gallery folder
  const galleryImages: GalleryImage[] = [
    // Labor Shelters
    { src: '/Gallery/imgi_1662_labor-shelters-1-7.jpg', alt: 'Labor Shelters - Modern Design', category: 'Labor Shelters' },
    { src: '/Gallery/imgi_1674_labor-shelters-1-5.jpg', alt: 'Labor Shelters - Interior View', category: 'Labor Shelters' },
    
    // Prefab Labor Camps
    { src: '/Gallery/imgi_1691_prefab-labor-camps-1-5.jpg', alt: 'Prefab Labor Camps - Exterior', category: 'Prefab Labor Camps' },
    { src: '/Gallery/imgi_1727_prefab-labor-camps-1-3.jpg', alt: 'Prefab Labor Camps - Layout', category: 'Prefab Labor Camps' },
    
    // Prefab Labor Hutments
    { src: '/Gallery/imgi_1744_prefab-pabor-hutments-1-4.jpg', alt: 'Prefab Labor Hutments - Design 1', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1750_prefab-pabor-hutments-1-6.jpg', alt: 'Prefab Labor Hutments - Design 2', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1756_prefab-pabor-hutments-1-3.jpg', alt: 'Prefab Labor Hutments - Design 3', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1762_prefab-pabor-hutments-1-1.jpg', alt: 'Prefab Labor Hutments - Design 4', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1768_prefab-pabor-hutments-1-5.jpg', alt: 'Prefab Labor Hutments - Design 5', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1774_prefab-pabor-hutments-1-2.jpg', alt: 'Prefab Labor Hutments - Design 6', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1780_prefab-pabor-hutments-1-7.jpg', alt: 'Prefab Labor Hutments - Design 7', category: 'Prefab Labor Hutments' },
    { src: '/Gallery/imgi_1786_prefab-pabor-hutments-1-8.jpg', alt: 'Prefab Labor Hutments - Design 8', category: 'Prefab Labor Hutments' },
    
    // Prefab Labor Sheds
    { src: '/Gallery/imgi_1797_Prefab-Labor-Sheds-1-8.jpg', alt: 'Prefab Labor Sheds - Design 1', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1803_Prefab-Labor-Sheds-1-1.jpg', alt: 'Prefab Labor Sheds - Design 2', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1809_Prefab-Labor-Sheds-1-3.jpg', alt: 'Prefab Labor Sheds - Design 3', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1815_Prefab-Labor-Sheds-1-6.jpg', alt: 'Prefab Labor Sheds - Design 4', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1821_Prefab-Labor-Sheds-1-7.jpg', alt: 'Prefab Labor Sheds - Design 5', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1827_Prefab-Labor-Sheds-1-2.jpg', alt: 'Prefab Labor Sheds - Design 6', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1833_Prefab-Labor-Sheds-1-4.jpg', alt: 'Prefab Labor Sheds - Design 7', category: 'Prefab Labor Sheds' },
    { src: '/Gallery/imgi_1839_Prefab-Labor-Sheds-1-5.jpg', alt: 'Prefab Labor Sheds - Design 8', category: 'Prefab Labor Sheds' },
    
    // Prefab Labor Colony
    { src: '/Gallery/imgi_1856_prefab-labor-colony-1-4.jpg', alt: 'Prefab Labor Colony - Layout 1', category: 'Prefab Labor Colony' },
    { src: '/Gallery/imgi_1862_prefab-labor-colony-1-7.jpg', alt: 'Prefab Labor Colony - Layout 2', category: 'Prefab Labor Colony' },
    { src: '/Gallery/imgi_1868_prefab-labor-colony-1-6.jpg', alt: 'Prefab Labor Colony - Layout 3', category: 'Prefab Labor Colony' },
    { src: '/Gallery/imgi_1874_prefab-labor-colony-1-8.jpg', alt: 'Prefab Labor Colony - Layout 4', category: 'Prefab Labor Colony' },
    { src: '/Gallery/imgi_1880_prefab-labor-colony-1-1.jpg', alt: 'Prefab Labor Colony - Layout 5', category: 'Prefab Labor Colony' },
    { src: '/Gallery/imgi_1886_prefab-labor-colony-1-2.jpg', alt: 'Prefab Labor Colony - Layout 6', category: 'Prefab Labor Colony' },
    { src: '/Gallery/imgi_1892_prefab-labor-colony-1-3.jpg', alt: 'Prefab Labor Colony - Layout 7', category: 'Prefab Labor Colony' },
    
    // Container Offices
    { src: '/Gallery/imgi_545_container-offices-grey.webp', alt: 'Container Office - Grey', category: 'Container Offices' },
    { src: '/Gallery/imgi_552_container-offices-black.webp', alt: 'Container Office - Black', category: 'Container Offices' },
    { src: '/Gallery/imgi_559_container-offices-blue.webp', alt: 'Container Office - Blue', category: 'Container Offices' },
    { src: '/Gallery/imgi_566_container-offices-yellow.webp', alt: 'Container Office - Yellow', category: 'Container Offices' },
    { src: '/Gallery/imgi_573_container-offices-white.webp', alt: 'Container Office - White', category: 'Container Offices' },
    { src: '/Gallery/imgi_580_container-offices-beige.webp', alt: 'Container Office - Beige', category: 'Container Offices' },
    { src: '/Gallery/imgi_587_container-offices-metallic.webp', alt: 'Container Office - Metallic', category: 'Container Offices' },
  ];

  const openImageModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const previousImage = () => {
    const prevIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  const downloadImage = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = image.alt.replace(/\s+/g, '-').toLowerCase() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredImages = selectedCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(image => image.category === selectedCategory);

  const categories = ['All', ...Array.from(new Set(galleryImages.map(img => img.category)))];

  return (
    <Layout>
      <UnifiedSEO
        fallbackTitle={pageSEO.gallery.title}
        fallbackDescription={pageSEO.gallery.description}
        fallbackCanonical={pageSEO.gallery.canonical}
        fallbackOgImage={siteConfig.ogImage}
        keywords={pageSEO.gallery.keywords}
        author={siteConfig.author}
        publisher={siteConfig.publisher}
      />

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto">
          <main className="container-padding">
            {/* Header */}
            <div className="text-center py-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Project Gallery
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore our comprehensive collection of portable cabins, container offices, and prefab solutions. 
                Each image showcases our commitment to quality, innovation, and sustainable construction.
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-12">
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="bg-[#0A3D2A] hover:bg-[#0A3D2A]/90 text-white"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Gallery Grid */}
            {filteredImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={`${image.src}-${index}`}
                    className="group relative bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => openImageModal(image, galleryImages.indexOf(image))}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={400}
                        height={400}
                        priority={index < 4} // Prioritize first 4 images for LCP
                        loading={index < 4 ? "eager" : "lazy"}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                      <h3 className="font-semibold text-sm mb-1">{image.alt}</h3>
                      <p className="text-xs text-gray-300">{image.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <ImageIcon className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-foreground mb-4">
                  No Images Found
                </h2>
                <p className="text-muted-foreground mb-6">
                  No images found for the selected category. Please try a different category.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory('All')}
                >
                  View All Images
                </Button>
              </div>
            )}

            {/* Back to Home */}
            <div className="mt-16 mb-16 text-center">
              <Button variant="outline" asChild size="lg">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              variant="ghost"
              size="sm"
              onClick={previousImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>

            {/* Download Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadImage(selectedImage)}
              className="absolute top-4 left-4 z-10 bg-black/50 text-white hover:bg-black/70"
            >
              <Download className="w-5 h-5" />
            </Button>

            {/* Image */}
            <div className="flex items-center justify-center h-full">
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 text-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{selectedImage.alt}</h3>
              <p className="text-sm text-gray-300">{selectedImage.category}</p>
              <p className="text-xs text-gray-400 mt-1">
                {currentImageIndex + 1} of {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Gallery;

