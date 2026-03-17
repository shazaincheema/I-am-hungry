
import { MenuItem } from './types';

export const RESTAURANT_INFO = {
  name: "iamhungry.com.pk",
  phone: "042-9892323",
  email: "management@iamhungry.pk",
  city: "Lahore",
  hours: "12:00 PM - 12:00 AM"
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'app-1',
    name: 'Pakistani Samosas',
    caption: 'Crispy, Golden, Perfection.',
    description: '2 pieces of crispy pastries filled with spiced potatoes, peas, and lentils. A street food staple of Lahore.',
    price: 200,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb01793?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'app-2',
    name: 'Chicken Seekh Kebabs',
    caption: 'Fire-kissed and Smokey.',
    description: '4 pieces of minced chicken skewers marinated in aromatic spices and grilled to succulent perfection.',
    price: 350,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'app-3',
    name: 'Aloo Tikki',
    caption: 'A crunchy potato hug.',
    description: '3 pieces of spiced potato patties served with our signature zesty mint chutney.',
    price: 150,
    category: 'Appetizers',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'main-1',
    name: 'Chicken Biryani',
    caption: 'The Heartbeat of Lahore.',
    description: 'Serves 1-2. Fragrant basmati rice layered with tender chicken, saffron, and traditional whole spices.',
    price: 800,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'main-2',
    name: 'Beef Nihari',
    caption: 'Velvety, Rich, and Royal.',
    description: 'Serves 1. Slow-cooked beef stew with marrow-infused rich spices. Best enjoyed with our hot Naan.',
    price: 700,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'main-3',
    name: 'Mutton Karahi',
    caption: 'Sizzling Wok Magic.',
    description: 'Serves 1-2. Spicy stir-fried mutton with fresh tomatoes, ginger, and green chilies in a traditional karahi.',
    price: 900,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1603496036393-ef7bf01704c0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'main-4',
    name: 'Butter Chicken',
    caption: 'The Smooth Operator.',
    description: 'Serves 1-2. Creamy tomato-based gravy with tender tandoori-grilled chicken chunks. Pure luxury.',
    price: 850,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1603894527134-99e44e39712c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'main-5',
    name: 'Vegetable Pulao',
    caption: 'Nature’s Bounty in Rice.',
    description: 'Serves 1-2. Light aromatic rice with mixed garden vegetables, caramelized onions, and mild spices.',
    price: 600,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'main-6',
    name: 'Fish Tikka Masala',
    caption: 'Grilled to Zesty Perfection.',
    description: 'Serves 1. Tender fish pieces grilled and then tossed in a creamy, spice-laden tomato masala.',
    price: 750,
    category: 'Main Courses',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'side-1',
    name: 'Naan Bread',
    caption: 'Hot, Fluffy, and Fresh.',
    description: '2 pieces of freshly baked flatbread. The perfect companion for our Nihari and Karahi.',
    price: 100,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1601303584126-28af25244be5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'side-2',
    name: 'Roti',
    caption: 'The Taste of Home.',
    description: '2 pieces of whole wheat flatbread, soft and delivered warm.',
    price: 120,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'des-1',
    name: 'Gulab Jamun',
    caption: 'Syrupy spheres of bliss.',
    description: '4 pieces of soft, warm milk dumplings soaked in a fragrant rose syrup.',
    price: 300,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1589119908995-c6800ffecf3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'des-2',
    name: 'Ras Malai',
    caption: 'Milkier than your dreams.',
    description: '4 pieces of delicate chilled cheese dumplings floating in sweetened, saffron-infused milk.',
    price: 250,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1621535970221-12502c34749a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bev-1',
    name: 'Lassi',
    caption: 'The Ultimate Lahori Refreshment.',
    description: '300ml. Thick, creamy yogurt-based drink. Available in Sweet or Salty variants.',
    price: 150,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1571006682855-3829037413f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bev-2',
    name: 'Chai',
    caption: 'A Cup of Pakistani Culture.',
    description: '2 cups of traditional karak tea brewed with spices and premium milk.',
    price: 100,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1544787210-2213d242699e?auto=format&fit=crop&w=800&q=80'
  }
];
