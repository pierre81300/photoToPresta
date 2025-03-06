import { prestationService } from './prestationService';

export interface MistralResponse {
  response: string;
  prestations: any[];
}

export interface MistralError {
  error: string;
}

// Prompt prédéfini à utiliser pour toutes les analyses
const DEFAULT_PROMPT = `Tu es un assistant spécialisé dans l'analyse d'images de flyers de prestations de beauté. Ta tâche est d'extraire les informations et de les formater en JSON.

IMPORTANT: Tu dois UNIQUEMENT répondre avec un objet JSON valide, sans aucun texte avant ou après. Le format doit être exactement :
{
  "prestations": [
    {
      "category": "femmes",
      "type": "prestation",
      "name": "Nom de la prestation",
      "price": "30",
      "startingPrice": false,
      "duration": {
        "hours": 0,
        "minutes": 30
      },
      "description": "Description si disponible"
    }
  ]
}

Règles à suivre strictement :
- Utilise uniquement "femmes", "hommes" ou "enfants" pour category
- Utilise uniquement "prestation" ou "forfait" pour type
- Pour les prix variables (ex: 30-50€), mets le prix minimum dans price et startingPrice à true
- Mets les durées en nombres (pas de texte)
- Si une information est manquante, utilise une valeur par défaut (0 pour les nombres, "" pour les textes)
- NE PAS ajouter de texte explicatif, UNIQUEMENT le JSON`;

/**
 * Analyse les photos de flyers et extrait les informations sur les prestations
 */
export async function analyzePhotos(photos: File[], prompt: string = DEFAULT_PROMPT): Promise<MistralResponse> {
  const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('La clé API Mistral n\'est pas configurée. Veuillez ajouter votre clé API dans le fichier .env.local');
  }

  // Convertir les photos en base64
  const photoPromises = photos.map(file => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });

  const photoUrls = await Promise.all(photoPromises);

  // Préparer le contenu pour l'API Mistral
  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        ...photoUrls.map(url => ({
          type: 'image_url',
          image_url: { url }
        }))
      ]
    }
  ];

  const requestBody = {
    model: 'pixtral-large-latest',
    messages
  };

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Erreur de l'API Mistral (${response.status}): ${await response.text() || 'Pas de message d\'erreur'}`);
    }

    const responseData = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseData);
    } catch (parseError) {
      throw new Error('La réponse de l\'API n\'est pas un JSON valide: ' + (parseError as Error).message);
    }

    if (!data?.choices?.[0]?.message?.content) {
      throw new Error('Format de réponse invalide de l\'API Mistral');
    }

    const jsonResponse = data.choices[0].message.content;

    try {
      // Nettoyer la réponse avant le parsing
      const cleanedResponse = jsonResponse
        .trim()
        .replace(/^```json\s*/, '')
        .replace(/```$/, '')
        .replace(/^\s*```\s*/, '')
        .replace(/\n/g, ' ')
        .trim();
      
      // Parser la réponse JSON
      const parsedResponse = JSON.parse(cleanedResponse);
      
      if (!parsedResponse.prestations || !Array.isArray(parsedResponse.prestations)) {
        throw new Error('Le format de la réponse ne correspond pas à la structure attendue');
      }

      // Créer les prestations à partir du JSON
      parsedResponse.prestations.forEach((prestation: any) => {
        prestationService.addPrestation(prestation, 'flyer');
      });

      return {
        response: cleanedResponse,
        prestations: parsedResponse.prestations
      };
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'erreur inconnue';
      throw new Error('Format de réponse invalide: ' + errorMessage);
    }
  } catch (error) {
    throw error;
  }
} 