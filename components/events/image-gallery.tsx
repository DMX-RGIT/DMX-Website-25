import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

export function ImageGallery({ images, title = "Event Gallery" }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative rounded-lg overflow-hidden ${
              index % 3 === 0 ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
