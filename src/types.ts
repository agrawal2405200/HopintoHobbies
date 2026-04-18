export interface Hobby {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface Tutor {
  id: string;
  name: string;
  hobby: string;
  price: number;
  rating: number;
  reviews: number;
  bio: string;
  image: string;
  verified: boolean;
  certifications?: string[];
  badges?: string[];
}

export interface Space {
  id: string;
  name: string;
  location: string;
  price: number;
  type: string;
  image: string;
  capacity: number;
}

export interface Booking {
  id: string;
  tutorId: string;
  learnerId: string;
  hobby: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed';
  isTrial: boolean;
}
