import axios from 'axios';

export interface MistralResponse {
  response: string;
}

export interface MistralError {
  error: string;
}

export async function analyzePhotos(photos: File[], prompt: string): Promise<MistralResponse> {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    
    // Ajouter chaque photo au FormData
    photos.forEach((photo) => {
      formData.append('photos', photo);
    });
    
    // Appeler notre API
    const response = await axios.post('/api/mistral', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as MistralError;
    }
    throw { error: 'Une erreur est survenue lors de l\'analyse des photos' };
  }
} 