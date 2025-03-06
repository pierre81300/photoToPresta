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
    return stored ? JSON.parse(stored) : [];
  }

  getPrestation(id: string): Prestation | null {
    const prestations = this.getPrestations();
    return prestations.find(p => p.id === id) || null;
  }

  addPrestation(prestation: Omit<Prestation, 'id' | 'status'>, source: 'manual' | 'flyer' = 'manual'): Prestation {
    const prestations = this.getPrestations();
    const id = this.generateUniqueId();
    
    const newPrestation: Prestation = {
      ...prestation,
      id,
      status: source === 'flyer' ? 'pending' : 'active',
      source
    };
    
    prestations.push(newPrestation);
    this.savePrestations(prestations);
    return newPrestation;
  }

  updatePrestation(prestation: Prestation): void {
    const prestations = this.getPrestations();
    const index = prestations.findIndex(p => p.id === prestation.id);
    
    if (index !== -1) {
      prestations[index] = prestation;
      this.savePrestations(prestations);
    }
  }

  deletePrestation(id: string): void {
    const prestations = this.getPrestations();
    const filtered = prestations.filter(p => p.id !== id);
    this.savePrestations(filtered);
  }

  updatePrestationStatus(id: string, status: PrestationStatus): void {
    const prestations = this.getPrestations();
    const index = prestations.findIndex(p => p.id === id);
    
    if (index !== -1) {
      prestations[index] = { ...prestations[index], status };
      this.savePrestations(prestations);
    }
  }

  private savePrestations(prestations: Prestation[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(prestations));
    // Déclencher un événement storage pour mettre à jour les autres onglets
    window.dispatchEvent(new Event('storage'));
  }
}

export const prestationService = new PrestationService(); 