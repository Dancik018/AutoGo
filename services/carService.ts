import { Car } from '@/types/car';
import carData from './car.json';

export const getCars = (): Car[] => {
  return carData as Car[];
};