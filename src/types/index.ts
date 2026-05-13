export interface Translation {
  ar: string;
  en: string;
  ru: string;
}

export interface Coordinates {
  x: number; // Percent relative to map container
  y: number; // Percent relative to map container
}

export interface Site {
  id: string;
  name: Translation;
  hieroglyphicName?: string;
  description: Translation;
  period: Translation;
  governorateId: string;
  coordinates: Coordinates;
  images: string[];
  artifacts: string[]; // IDs
  tombs?: string[];
  discoveryDate?: string;
  discoverers?: Translation[];
  virtualTourUrl?: string;
  basePrice?: number;
  studentDiscount?: number;
  childDiscount?: number;
}

export interface AppUser {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  siteId: string;
  siteName: Translation;
  bookingDate: string;
  category: 'adult' | 'student' | 'child';
  price: number;
  qrCode: string;
  createdAt: string;
}

export interface Governorate {
  id: string;
  name: Translation;
  coordinates: Coordinates;
  sitesCount: number;
}

export interface Person {
  id: string;
  name: Translation;
  hieroglyphicName: string;
  title: Translation;
  description: Translation;
  period: Translation;
  achievements: Translation[];
  mummyStatus?: Translation;
  mummyLocation?: Translation;
  tombId?: string;
  images: string[];
  familyTree?: {
    father?: string;
    mother?: string;
    spouses?: string[];
    children?: string[];
  };
}

export interface Artifact {
  id: string;
  name: Translation;
  hieroglyphicText?: string;
  description: Translation;
  material: Translation;
  dimensions: string;
  originSiteId: string;
  currentLocation: Translation; // Museum
  discoveryDate: string;
  images: string[];
  category: 'statue' | 'papyri' | 'jewelry' | 'tool' | 'vessel' | 'other';
}
