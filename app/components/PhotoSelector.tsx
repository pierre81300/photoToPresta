import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface PhotoSelectorProps {
  onPhotosSelected: (photos: File[]) => void;
}

export default function PhotoSelector({ onPhotosSelected }: PhotoSelectorProps) {
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Utiliser useEffect pour s'assurer que le code spécifique au navigateur
  // ne s'exécute que côté client après le montage du composant
  useEffect(() => {
    setIsMounted(true);
    
    // Nettoyage des URL d'objets lors du démontage du composant
    return () => {
      previews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, []);

  const handlePhotoSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedPhotos(files);
      
      // Créer des URLs pour les aperçus uniquement côté client
      if (isMounted) {
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
      }
      
      // Appeler la fonction de callback avec les fichiers sélectionnés
      onPhotosSelected(files);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...selectedPhotos];
    const newPreviews = [...previews];
    
    // Libérer l'URL de l'objet pour éviter les fuites de mémoire
    if (isMounted && newPreviews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setSelectedPhotos(newPhotos);
    setPreviews(newPreviews);
    onPhotosSelected(newPhotos);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoSelection}
          ref={fileInputRef}
        />
        <button
          onClick={triggerFileInput}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors w-full"
        >
          Sélectionner des photos
        </button>
      </div>

      {isMounted && previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 