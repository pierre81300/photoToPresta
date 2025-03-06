'use client';

import { useState, useEffect } from 'react';

interface PhotoSelectorProps {
  onPhotosSelected: (photos: File[]) => void;
}

export default function PhotoSelector({ onPhotosSelected }: PhotoSelectorProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (selectedFiles.length > 0) {
      onPhotosSelected(selectedFiles);
      
      return () => {
        const newPreviews = [...previewUrls];
        newPreviews.forEach(preview => URL.revokeObjectURL(preview));
      };
    }
  }, [selectedFiles, previewUrls, onPhotosSelected]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  return (
    <div 
      onClick={() => document.getElementById('photo-input')?.click()}
      className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
    >
      {previewUrls.length > 0 ? (
        <div className="space-y-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          ))}
          <p className="text-sm text-gray-500">Cliquez pour changer de photo</p>
        </div>
      ) : (
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <p>Cliquez pour sélectionner une photo</p>
        </div>
      )}
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handlePhotoSelect}
        className="hidden"
      />
    </div>
  );
} 