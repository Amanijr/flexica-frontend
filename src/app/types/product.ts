import { StaticImageData } from 'next/image';

export interface Product {
  id: number;
  name: string;
  image: string | StaticImageData;
  weight: number;
  price: number;
}