import { NextRequest, NextResponse } from 'next/server';

// Fonction pour convertir une image en base64
async function imageToBase64(file: ArrayBuffer): Promise<string> {
  const buffer = Buffer.from(file);
  return buffer.toString('base64');
}

export async function POST(request: NextRequest) {
  try {
    // Vérifier si la clé API Mistral est configurée
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'La clé API Mistral n\'est pas configurée' },
        { status: 500 }
      );
    }

    // Récupérer les données de la requête
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const photos = formData.getAll('photos') as File[];

    if (!prompt) {
      return NextResponse.json(
        { error: 'Le prompt est requis' },
        { status: 400 }
      );
    }

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: 'Au moins une photo est requise' },
        { status: 400 }
      );
    }

    // Convertir les photos en base64
    const imageContents = await Promise.all(
      photos.map(async (photo) => {
        const arrayBuffer = await photo.arrayBuffer();
        const base64 = await imageToBase64(arrayBuffer);
        return {
          type: "image_url",
          image_url: {
            url: `data:${photo.type};base64,${base64}`
          }
        };
      })
    );

    // Préparer les contenus pour l'API Mistral
    const messages = [{
      role: "user",
      content: [
        {
          type: "text",
          text: prompt
        },
        ...imageContents
      ]
    }];

    // Appeler l'API Mistral directement avec fetch
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'pixtral-large-latest',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.2,
      }),
    });

    if (!mistralResponse.ok) {
      const errorData = await mistralResponse.json();
      console.error('Erreur Mistral API:', errorData);
      return NextResponse.json(
        { error: 'Erreur lors de l\'appel à l\'API Mistral' },
        { status: mistralResponse.status }
      );
    }

    const data = await mistralResponse.json();
    
    // Retourner la réponse
    return NextResponse.json({
      response: data.choices[0].message.content,
    });
  } catch (error) {
    console.error('Erreur lors de l\'appel à Mistral:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'appel à Mistral' },
      { status: 500 }
    );
  }
} 