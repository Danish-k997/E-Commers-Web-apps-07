export type ProductType = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  bestseller?: boolean;
  description: string;
  category: string;
  subCategory: string;
  sizes?: string[];
  size?: string[];
};