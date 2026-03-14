"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ProductImageGalleryProps {
  mainImage: string;
  galleryImages: string[];
  productName: string;
}

export default function ProductImageGallery({ mainImage, galleryImages, productName }: ProductImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(mainImage);
  const allImages = [mainImage, ...galleryImages];

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 p-4">
      <div className="relative w-full h-96 mb-4 border rounded-lg overflow-hidden shadow-md">
        <Image
          src={currentImage}
          alt={productName}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
          className="object-contain object-center"
        />
      </div>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {allImages.map((img, index) => (
          <div
            key={index}
            className={`relative w-24 h-24 flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden ${
              img === currentImage ? 'border-blue-500' : 'border-gray-200'
            }`}
            onClick={() => setCurrentImage(img)}
          >
            <Image
              src={img}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
