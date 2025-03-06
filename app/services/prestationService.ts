interface Duration {
  hours: string;
  minutes: string;
}

export type PrestationStatus = 'active' | 'pending';

export interface Prestation {
  id: string;
  category: 'femmes' | 'hommes' | 'enfants';
  type: 'prestation' | 'forfait';
  name: string;
  price: string;
  startingPrice: boolean;
  duration: Duration;
  description: string;
  photos: string[];
  status: PrestationStatus;
  source?: 'manual' | 'flyer';
}

class PrestationService {
  private readonly STORAGE_KEY = 'prestations';

  private generateUniqueId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
  }

  getPrestations(): Prestation[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const prestations = stored ? JSON.parse(stored) : [];
    console.log('Prestations récupérées du localStorage:', prestations);
    return prestations;
  }

  getPrestation(id: string): Prestation | null {
    console.log('Recherche de la prestation avec l\'ID:', id);
    const prestations = this.getPrestations();
    const prestation = prestations.find(p => {
      const match = p.id === id;
      console.log('Comparaison:', { prestationId: p.id, searchId: id, match });
      return match;
    });
    console.log('Prestation trouvée:', prestation);
    return prestation || null;
  }

  addPrestation(prestation: Omit<Prestation, 'id' | 'status'>, source: 'manual' | 'flyer' = 'manual'): Prestation {
    const prestations = this.getPrestations();
    const id = this.generateUniqueId();
    console.log('Nouvel ID généré:', id);
    
    const newPrestation: Prestation = {
      ...prestation,
      id,
      status: source === 'flyer' ? 'pending' as const : 'active' as const,
      source
    };
    
    console.log('Nouvelle prestation à ajouter:', newPrestation);
    prestations.push(newPrestation);
    this.savePrestations(prestations);
    return newPrestation;
  }

  updatePrestation(prestation: Prestation): void {
    const prestations = this.getPrestations();
    console.log('Mise à jour de la prestation:', prestation);
    
    const index = prestations.findIndex(p => p.id === prestation.id);
    console.log('Index trouvé:', index);
    
    if (index !== -1) {
      prestations[index] = prestation;
      this.savePrestations(prestations);
      console.log('Prestation mise à jour avec succès');
    } else {
      console.warn('Prestation non trouvée pour la mise à jour');
    }
  }

  deletePrestation(id: string): void {
    const prestations = this.getPrestations();
    const filtered = prestations.filter(p => p.id !== id);
    this.savePrestations(filtered);
  }

  updatePrestationStatus(id: string, status: PrestationStatus): void {
    const prestations = this.getPrestations();
    console.log('Mise à jour du statut:', { id, status });
    
    const index = prestations.findIndex(p => p.id === id);
    console.log('Index trouvé pour le statut:', index);
    
    if (index !== -1) {
      prestations[index] = { ...prestations[index], status };
      this.savePrestations(prestations);
      console.log('Statut mis à jour avec succès');
    } else {
      console.warn('Prestation non trouvée pour la mise à jour du statut');
    }
  }

  private savePrestations(prestations: Prestation[]): void {
    console.log('Sauvegarde des prestations:', prestations);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prestations));
    // Déclencher un événement storage pour mettre à jour les autres onglets
    window.dispatchEvent(new Event('storage'));
  }
}

export const prestationService = new PrestationService(); 