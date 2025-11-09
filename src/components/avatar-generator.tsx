"use client";
import { useState, useEffect } from 'react';

// Your exact configuration
const profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
const profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

interface AvatarGeneratorProps {
  currentImage?: string;
  size?: number;
  className?: string;
  onImageChange?: (imageUrl: string) => void;
}

export function AvatarGenerator({ 
  currentImage, 
  size = 120, 
  className = "",
  onImageChange 
}: AvatarGeneratorProps) {
  const [imageUrl, setImageUrl] = useState(currentImage || '');

  // Generate random avatar on initial load if no existing image
  useEffect(() => {
    if (!currentImage) {
      generateRandomAvatar();
    }
  }, []);

  const generateRandomAvatar = () => {
    const randomName = profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)];
    const randomCollection = profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)];
    
    const newImageUrl = `https://api.dicebear.com/6.x/${randomCollection}/svg?seed=${randomName}`;
    setImageUrl(newImageUrl);
    onImageChange?.(newImageUrl);
  };

  const generateRandomName = () => {
    const randomName = profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)];
    const currentCollection = imageUrl.split('/')[6]; // Extract collection from URL
    const newImageUrl = `https://api.dicebear.com/6.x/${currentCollection}/svg?seed=${randomName}`;
    setImageUrl(newImageUrl);
    onImageChange?.(newImageUrl);
  };

  const generateRandomCollection = () => {
    const randomCollection = profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)];
    const currentSeed = new URL(imageUrl).searchParams.get('seed') || 'Garfield';
    const newImageUrl = `https://api.dicebear.com/6.x/${randomCollection}/svg?seed=${currentSeed}`;
    setImageUrl(newImageUrl);
    onImageChange?.(newImageUrl);
  };

  // Extract current seed and collection from image URL for display
  const getCurrentAvatarInfo = () => {
    if (!imageUrl) return { seed: '', collection: '' };
    
    try {
      const url = new URL(imageUrl);
      const seed = url.searchParams.get('seed') || '';
      const collection = imageUrl.split('/')[6] || ''; // Extract collection from path
      return { seed, collection };
    } catch {
      return { seed: '', collection: '' };
    }
  };

  const { seed, collection } = getCurrentAvatarInfo();

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Avatar Display */}
      {imageUrl && (
        <div className="border-2 border-black rounded-full overflow-hidden bg-[#EFE9D5]">
          <img 
            src={imageUrl} 
            alt="User avatar"
            className="object-cover"
            style={{ width: size, height: size }}
          />
        </div>
      )}
      
      {/* Control Buttons */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button
          onClick={generateRandomAvatar}
          className="px-4 py-2 bg-black text-[#EFE9D5] border-2 border-black rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        >
          🎲 Random Avatar
        </button>
        
        <div className="flex gap-2">
          <button
            onClick={generateRandomName}
            className="flex-1 px-3 py-2 bg-[#EFE9D5] text-black border-2 border-black rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
          >
            Change Character
          </button>
          <button
            onClick={generateRandomCollection}
            className="flex-1 px-3 py-2 bg-[#EFE9D5] text-black border-2 border-black rounded-lg hover:bg-gray-200 transition-colors text-xs font-medium"
          >
            Change Style
          </button>
        </div>
      </div>

      {/* Current Avatar Info */}
      {seed && collection && (
        <div className="text-center text-xs text-gray-600 space-y-1">
          <p className="font-medium">Character: {seed}</p>
          <p className="font-medium">Style: {collection}</p>
        </div>
      )}
    </div>
  );
}