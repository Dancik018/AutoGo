export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price_per_day: number;
  availability: boolean;
  features: string[];
  images: string[];
  class: 'econom' | 'comfort' | 'premium';
  fuel_type: string;
  engine_capacity: string;
  body_type: string;
  image_folder: string;
}