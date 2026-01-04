"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || "https://placehold.co/600x600");

    return (
        <div className="flex flex-col gap-6">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <Image
                    src={selectedImage}
                    alt={name}
                    fill
                    className="object-contain object-center transition-opacity duration-300"
                    priority
                />
            </div>

            {/* Thumbnail Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-4">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(img)}
                            className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${selectedImage === img
                                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-700"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${name} view ${index + 1}`}
                                fill
                                className="object-cover object-center"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
