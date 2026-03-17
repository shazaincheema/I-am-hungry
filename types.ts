
export type Category = 'Appetizers' | 'Main Courses' | 'Sides' | 'Desserts' | 'Beverages';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  caption: string; // New field for catchy captions
  price: number;
  category: Category;
  image: string;
  tags?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  area: string;
  address: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  savedAddresses: SavedAddress[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  deliveryAddress: string;
  deliveryArea: string;
}

export interface UserDetails {
  name: string;
  phone: string;
  email: string;
  area: string;
  address: string;
}

export const LAHORE_AREAS = [
  "Gulberg", "DHA Phase 1-8", "Model Town", "Johar Town", "Garden Town", 
  "Bahria Town", "Wapda Town", "Valencia", "Iqbal Town", "Samnabad", 
  "Cavalry Ground", "Askari", "Paragon City", "Lake City"
];
