
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Plus, 
  Minus, 
  MapPin, 
  Phone, 
  Mail, 
  ChefHat, 
  Clock, 
  MessageCircle,
  ArrowRight,
  User as UserIcon,
  LogOut,
  History,
  Home,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Save,
  Flame,
  Utensils,
  IceCream,
  CupSoda,
  Beef,
} from 'lucide-react';
import { MenuItem, CartItem, Category, UserDetails, LAHORE_AREAS, User, SavedAddress, Order } from './types';
import { MENU_ITEMS as INITIAL_MENU_ITEMS, RESTAURANT_INFO } from './constants';

const categories: (Category | 'All')[] = ['All', 'Appetizers', 'Main Courses', 'Sides', 'Desserts', 'Beverages'];

const CategoryIcon: React.FC<{ category: Category; size?: number; className?: string }> = ({ category, size = 48, className = "" }) => {
  switch (category) {
    case 'Appetizers': return <Flame size={size} className={className} />;
    case 'Main Courses': return <Beef size={size} className={className} />;
    case 'Sides': return <Utensils size={size} className={className} />;
    case 'Desserts': return <IceCream size={size} className={className} />;
    case 'Beverages': return <CupSoda size={size} className={className} />;
    default: return <ChefHat size={size} className={className} />;
  }
};

const App: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', phone: '' });
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '', phone: '', email: '', area: '', address: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'orders' | 'addresses'>('orders');
  
  // Operating Hours Logic: 12 PM to 12 AM
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isKitchenOpen = useMemo(() => {
    const hour = currentTime.getHours();
    return hour >= 12 && hour < 24;
  }, [currentTime]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ih_user');
    const savedOrders = localStorage.getItem('ih_orders');
    const savedMenu = localStorage.getItem('ih_menu');
    
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedOrders) setOrderHistory(JSON.parse(savedOrders));
    if (savedMenu) setMenuItems(JSON.parse(savedMenu));
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUserDetails(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone
      }));
    }
  }, [currentUser]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register') {
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: authForm.email,
        name: authForm.name,
        phone: authForm.phone,
        savedAddresses: []
      };
      setCurrentUser(newUser);
      localStorage.setItem('ih_user', JSON.stringify(newUser));
    } else {
      const mockUser: User = {
        id: 'u1',
        email: authForm.email,
        name: 'Guest User',
        phone: '0300-1112233',
        savedAddresses: []
      };
      setCurrentUser(mockUser);
      localStorage.setItem('ih_user', JSON.stringify(mockUser));
    }
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ih_user');
    setIsProfileOpen(false);
    setProfileTab('orders');
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      savedAddresses: currentUser.savedAddresses.filter(a => a.id !== id)
    };
    setCurrentUser(updatedUser);
    localStorage.setItem('ih_user', JSON.stringify(updatedUser));
  };

  const selectAddress = (addr: SavedAddress) => {
    setUserDetails(prev => ({ ...prev, area: addr.area, address: addr.address }));
  };

  const filteredMenu = useMemo(() => {
    return activeCategory === 'All' 
      ? menuItems 
      : menuItems.filter(item => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  const addToCart = (item: MenuItem) => {
    if (!isKitchenOpen) {
      alert("Our kitchen is currently closed. We are open from 12:00 PM to 12:00 AM.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  const [saveAddress, setSaveAddress] = useState(false);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);

    if (!isKitchenOpen) {
      setCheckoutError("Our kitchen is currently closed. We serve from 12:00 PM to 12:00 AM.");
      return;
    }

    if (!userDetails.name.trim() || !userDetails.phone.trim() || !userDetails.address.trim()) {
      setCheckoutError("Please fill in all the required fields.");
      return;
    }

    if (!userDetails.area || !LAHORE_AREAS.includes(userDetails.area)) {
      setCheckoutError("We currently only deliver within Lahore. Please select a valid Lahore area.");
      return;
    }

    // Save address if requested
    if (saveAddress && currentUser) {
      const isDuplicate = currentUser.savedAddresses.some(
        a => a.address === userDetails.address && a.area === userDetails.area
      );
      
      if (!isDuplicate) {
        const newAddr: SavedAddress = {
          id: Math.random().toString(36).substr(2, 9),
          label: userDetails.area,
          area: userDetails.area,
          address: userDetails.address
        };
        const updatedUser = {
          ...currentUser,
          savedAddresses: [...currentUser.savedAddresses, newAddr]
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('ih_user', JSON.stringify(updatedUser));
      }
    }

    const newOrder: Order = {
      id: `IH-${Math.floor(Math.random() * 90000 + 10000)}`,
      userId: currentUser?.id || 'guest',
      items: [...cart],
      total: cartTotal,
      date: new Date().toISOString(),
      status: 'Preparing',
      deliveryAddress: userDetails.address,
      deliveryArea: userDetails.area
    };

    const updatedHistory = [newOrder, ...orderHistory];
    setOrderHistory(updatedHistory);
    localStorage.setItem('ih_orders', JSON.stringify(updatedHistory));

    setOrderComplete(true);
    setCart([]);
    setTimeout(() => {
      setOrderComplete(false);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
    }, 5000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Operating Hours Alert */}
      {!isKitchenOpen && (
        <div className="bg-amber-600 text-white py-2 px-4 text-center font-bold text-sm flex items-center justify-center gap-2 z-[60]">
          <AlertCircle size={16} /> Kitchen is Closed. Order between 12:00 PM and 12:00 AM.
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-emerald-900 leading-none">iamhungry<span className="text-emerald-600">.com.pk</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Lahore's Online Kitchen</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-stone-600">
            <button onClick={() => scrollToSection('menu')} className="hover:text-emerald-600 transition-colors uppercase tracking-widest text-[11px]">Our Menu</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition-colors uppercase tracking-widest text-[11px]">About</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-emerald-600 transition-colors uppercase tracking-widest text-[11px]">Contact</button>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 rounded-xl transition-colors text-stone-700"
              >
                <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm font-semibold">{currentUser.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button 
                onClick={() => { setIsAuthModalOpen(true); setAuthMode('login'); }}
                className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors px-4 py-2 border border-emerald-100 rounded-xl"
              >
                <UserIcon size={18} /> Login
              </button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-700 hover:text-emerald-600 transition-colors"
            >
              <ShoppingBag size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-emerald-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-stone-900">
        <img 
          src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=1920&q=80" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Pakistani Cuisine"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 w-full text-center md:text-left">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-xl">
              <Clock size={14} className="animate-pulse" /> Serving 12:00 PM - 12:00 AM
            </div>
            <h2 className="text-6xl md:text-8xl font-serif text-white mb-8 leading-tight">
              Lahore’s <br /> 
              <span className="text-emerald-400 italic">Royal</span> Feast.
            </h2>
            <p className="text-xl text-stone-300 mb-12 leading-relaxed max-w-xl font-medium">
              We bring the authentic, spicy, and rich flavors of traditional Pakistani cuisine straight to your door. Only in Lahore. Only Fresh.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={() => scrollToSection('menu')}
                className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all flex items-center gap-3 group shadow-2xl shadow-emerald-900/60 uppercase tracking-widest text-sm"
              >
                Start Ordering <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-emerald-600/5 rounded-[4rem] group-hover:bg-emerald-600/10 transition-colors duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1512132411229-c30391241dd8?auto=format&fit=crop&w=1000&q=80" 
              className="rounded-[3.5rem] shadow-2xl relative z-10 w-full object-cover aspect-square md:aspect-auto"
              alt="Our Delicious Nihari"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-100 rounded-full -z-0 opacity-50 blur-3xl animate-pulse"></div>
          </div>
          <div className="space-y-10">
            <div>
              <span className="text-emerald-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Culinary Heritage</span>
              <h2 className="text-5xl font-serif font-bold text-stone-900 leading-tight">A Kitchen Dedicated to Lahore.</h2>
            </div>
            <p className="text-xl text-stone-600 leading-relaxed font-medium">
              iamhungry.com.pk is an online-only premium kitchen. By removing the traditional dining hall, we focus 100% of our energy on ingredient quality and delivery temperature.
            </p>
            <p className="text-lg text-stone-500 leading-relaxed italic">
              "We understand that a Biryani is only good if it's steaming hot when it reaches your table. That is our promise to every home in Lahore."
            </p>
            <div className="grid grid-cols-2 gap-10 pt-6">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-emerald-900">100%</p>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Lahore Delivery Only</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-emerald-900">Fresh</p>
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest">Cooked to Order</p>
              </div>
            </div>
            <button 
              onClick={() => scrollToSection('menu')}
              className="inline-flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-sm hover:gap-4 transition-all"
            >
              Explore the Menu <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h2 className="text-5xl font-serif font-bold text-stone-900">The Royal Menu</h2>
              <p className="text-stone-500 max-w-md text-lg italic">Explore the signature tastes of Pakistan, curated for the modern Lahori.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/30 ring-2 ring-emerald-600 ring-offset-2' 
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200 shadow-sm'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredMenu.map(item => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-stone-100 group shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col relative">
                <div className="relative h-48 bg-stone-50 flex items-center justify-center overflow-hidden border-b border-stone-100">
                  <div className="absolute inset-0 bg-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CategoryIcon category={item.category} size={64} className="text-emerald-600/20 group-hover:text-emerald-600/40 transition-all duration-500 group-hover:scale-110" />
                  <div className="absolute top-6 right-6 px-4 py-2 bg-emerald-600/90 backdrop-blur shadow-sm rounded-2xl">
                    <span className="font-black text-white text-sm">{item.price} PKR</span>
                  </div>
                </div>

                <div className="p-10 flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600">{item.category}</span>
                  </div>
                  <p className="text-emerald-600 font-black italic text-sm mb-4 tracking-wide uppercase">"{item.caption}"</p>
                  <h3 className="text-2xl font-bold mb-4 text-stone-900 group-hover:text-emerald-700 transition-colors">{item.name}</h3>
                  <p className="text-stone-500 text-sm mb-10 leading-relaxed flex-1 line-clamp-3 font-medium">{item.description}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    disabled={!isKitchenOpen}
                    className={`w-full py-5 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] ${
                      isKitchenOpen 
                        ? 'bg-stone-900 hover:bg-emerald-600 text-white shadow-lg' 
                        : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    }`}
                  >
                    <Plus size={18} /> {isKitchenOpen ? 'Add To Order' : 'Kitchen Closed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Account Profile Modal */}
      {isProfileOpen && currentUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={() => setIsProfileOpen(false)} />
          <div className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <div className="w-full md:w-72 bg-stone-50 p-10 border-r border-stone-100 flex flex-col">
              <div className="mb-10 text-center md:text-left">
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-3xl flex items-center justify-center text-3xl font-bold mb-6 mx-auto md:mx-0 shadow-lg shadow-emerald-600/20">
                  {currentUser.name.charAt(0)}
                </div>
                <h4 className="text-2xl font-bold text-stone-900">{currentUser.name}</h4>
                <p className="text-sm text-stone-500 mt-1">{currentUser.email}</p>
              </div>
              
              <div className="space-y-2 flex-1">
                <button 
                  onClick={() => setProfileTab('orders')}
                  className={`w-full flex items-center gap-3 px-5 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-[11px] ${
                    profileTab === 'orders' ? 'bg-white shadow-sm text-emerald-600' : 'text-stone-500 hover:bg-white hover:text-emerald-600'
                  }`}
                >
                  <History size={16} /> Order History
                </button>
                <button 
                  onClick={() => setProfileTab('addresses')}
                  className={`w-full flex items-center gap-3 px-5 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-[11px] ${
                    profileTab === 'addresses' ? 'bg-white shadow-sm text-emerald-600' : 'text-stone-500 hover:bg-white hover:text-emerald-600'
                  }`}
                >
                  <Home size={16} /> My Addresses
                </button>
              </div>

              <button 
                onClick={handleLogout}
                className="mt-10 flex items-center gap-3 px-5 py-4 text-red-500 hover:bg-red-50 font-black rounded-2xl transition-all uppercase tracking-widest text-[11px]"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-12">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-4xl font-serif font-bold">{profileTab === 'orders' ? 'Past Orders' : 'My Addresses'}</h3>
                <button onClick={() => setIsProfileOpen(false)} className="p-3 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
              </div>

              {profileTab === 'orders' ? (
                orderHistory.filter(o => o.userId === currentUser.id).length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-stone-400 italic">
                    <History size={48} className="mb-4 opacity-20" />
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orderHistory.filter(o => o.userId === currentUser.id).map(order => (
                      <div key={order.id} className="p-8 border border-stone-100 rounded-[2rem] bg-stone-50/50 hover:border-emerald-200 transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
                          <div>
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-1 tracking-[0.2em]">Order ID</span>
                            <span className="font-bold text-stone-900 text-lg">#{order.id}</span>
                          </div>
                          <div className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={12} /> {order.status}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-black uppercase text-stone-400 block mb-1 tracking-[0.2em]">Total Bill</span>
                            <span className="font-bold text-stone-900 text-lg">{order.total} PKR</span>
                          </div>
                        </div>
                        <div className="text-sm text-stone-600 space-y-2 mb-6 p-6 bg-white rounded-2xl border border-stone-100">
                          <p className="flex items-center gap-3 font-medium"><MapPin size={14} className="text-emerald-600"/> {order.deliveryArea}, {order.deliveryAddress}</p>
                          <p className="flex items-center gap-3 font-medium"><Clock size={14} className="text-emerald-600"/> {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <div className="flex items-center gap-2 overflow-hidden">
                          {order.items.map((item, i) => (
                            <div key={i} className="h-10 px-3 flex items-center justify-center bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold border border-emerald-100 flex items-center gap-2">
                              <CategoryIcon category={item.category} size={14} />
                              {item.quantity}x {item.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  {currentUser.savedAddresses.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-stone-400 italic">
                      <Home size={48} className="mb-4 opacity-20" />
                      No saved addresses yet.
                    </div>
                  ) : (
                    currentUser.savedAddresses.map(addr => (
                      <div key={addr.id} className="p-8 border border-stone-100 rounded-[2rem] bg-stone-50/50 flex items-center justify-between group hover:border-emerald-200 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-stone-100">
                            <MapPin size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-stone-900 text-lg">{addr.label}</h4>
                            <p className="text-sm text-stone-500 font-medium">{addr.address}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => deleteAddress(addr.id)}
                          className="p-4 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-md" onClick={() => setIsAuthModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-serif font-bold">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="p-3 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
            </div>
            
            <form onSubmit={handleAuth} className="space-y-5">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Full Name</label>
                    <input 
                      required 
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" 
                      placeholder="e.g., Salman Iqbal"
                      value={authForm.name}
                      onChange={e => setAuthForm({...authForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                    <input 
                      required 
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" 
                      placeholder="03xx-xxxxxxx"
                      value={authForm.phone}
                      onChange={e => setAuthForm({...authForm, phone: e.target.value})}
                    />
                  </div>
                </>
              )}
              <div>
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Email Address</label>
                <input 
                  required 
                  type="email" 
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" 
                  placeholder="ali@example.com"
                  value={authForm.email}
                  onChange={e => setAuthForm({...authForm, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 block">Password</label>
                <input 
                  required 
                  type="password" 
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium" 
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm({...authForm, password: e.target.value})}
                />
              </div>

              <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl mt-6 transition-all shadow-xl shadow-emerald-600/30 uppercase tracking-widest text-xs">
                {authMode === 'login' ? 'Login to Kitchen' : 'Sign Up Now'}
              </button>
            </form>

            <p className="text-center mt-8 text-sm text-stone-500 font-medium">
              {authMode === 'login' ? "Hungry for the first time?" : "Already an regular?"}{' '}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-emerald-600 font-black hover:underline"
              >
                {authMode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-8 border-b flex items-center justify-between">
              <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                Your Bag <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-widest">{cart.length} items</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-xl transition-colors"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={100} className="mb-6 text-stone-200" />
                  <p className="text-2xl font-bold">Your bag is empty.</p>
                  <p className="text-sm italic font-medium mt-2">"Laughter is brightest where food is best."</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-20 h-20 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-100 shrink-0">
                      <CategoryIcon category={item.category} size={32} className="text-emerald-600/30" />
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="font-bold text-stone-900 text-lg leading-tight">{item.name}</h4>
                      <p className="text-sm font-black text-emerald-600 mb-4">{item.price} PKR</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-stone-100 text-stone-400 transition-colors"><Minus size={14}/></button>
                          <span className="px-3 font-bold text-sm min-w-[2rem] text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-stone-100 text-stone-400 transition-colors"><Plus size={14}/></button>
                        </div>
                        <span className="text-sm font-black text-stone-900 ml-auto">{item.price * item.quantity} PKR</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-10 border-t bg-stone-50 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-black uppercase tracking-widest text-[10px]">Grand Total</span>
                  <span className="text-3xl font-black text-emerald-900">{cartTotal} PKR</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  disabled={!isKitchenOpen}
                  className={`w-full py-6 font-black rounded-3xl shadow-xl transition-all flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px] ${
                    isKitchenOpen 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30' 
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {isKitchenOpen ? (
                    <>Checkout <ArrowRight size={20} /></>
                  ) : 'Kitchen Closed'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" onClick={() => !orderComplete && setIsCheckoutOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-10 border-b flex justify-between items-center bg-stone-50/50">
              <h3 className="text-4xl font-serif font-bold">Finish Order</h3>
              <button onClick={() => setIsCheckoutOpen(false)} className="p-3 hover:bg-stone-100 rounded-full transition-colors"><X /></button>
            </div>

            {orderComplete ? (
              <div className="p-16 text-center animate-in zoom-in-95 duration-500">
                <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100/50">
                  <CheckCircle2 size={56} />
                </div>
                <h4 className="text-4xl font-serif font-bold mb-6 text-emerald-950 leading-tight">Order Received!</h4>
                <p className="text-stone-500 mb-12 text-lg italic leading-relaxed font-medium">
                  We've notified our chefs. Your meal is being prepared and will arrive at {userDetails.area} in approximately 45 minutes.
                </p>
                <div className="p-10 bg-emerald-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                  <p className="text-xs uppercase tracking-[0.4em] font-black text-emerald-400 mb-4">Estimated Arrival</p>
                  <p className="text-4xl font-bold">Today, {new Date(Date.now() + 45 * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckout} className="p-10 overflow-y-auto space-y-10">
                {checkoutError && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-4">
                    <AlertCircle size={18} />
                    {checkoutError}
                  </div>
                )}

                {currentUser && currentUser.savedAddresses.length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Use a Saved Address</label>
                    <div className="flex flex-wrap gap-3">
                      {currentUser.savedAddresses.map(addr => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => selectAddress(addr)}
                          className={`px-4 py-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                            userDetails.address === addr.address && userDetails.area === addr.area
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                          }`}
                        >
                          <Home size={14} /> {addr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Recipient Name</label>
                    <input 
                      required 
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold" 
                      placeholder="e.g., Salman Iqbal"
                      value={userDetails.name}
                      onChange={e => setUserDetails({...userDetails, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Active Contact #</label>
                    <input 
                      required 
                      className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold" 
                      placeholder="03xx-xxxxxxx"
                      value={userDetails.phone}
                      onChange={e => setUserDetails({...userDetails, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Delivery Area (Lahore)</label>
                  <select 
                    required 
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold appearance-none"
                    value={userDetails.area}
                    onChange={e => setUserDetails({...userDetails, area: e.target.value})}
                  >
                    <option value="">Select Area...</option>
                    {LAHORE_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                    <option value="Outside Lahore">Outside Lahore (No Service)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">Detailed Delivery Address</label>
                  <textarea 
                    required 
                    className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold h-32" 
                    placeholder="Provide specific landmarks, House #, Street #, Sector..."
                    value={userDetails.address}
                    onChange={e => setUserDetails({...userDetails, address: e.target.value})}
                  ></textarea>
                </div>

                {currentUser && (
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={saveAddress}
                        onChange={e => setSaveAddress(e.target.checked)}
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${
                        saveAddress ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-stone-200 group-hover:border-emerald-300'
                      }`}>
                        {saveAddress && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-600 select-none">Save this address for future orders</span>
                  </label>
                )}

                <div className="p-10 bg-emerald-950 text-white rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-3xl shadow-emerald-900/40 border-t-4 border-emerald-500">
                  <div className="text-center md:text-left">
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Cash on Delivery</p>
                    <p className="text-4xl font-serif font-bold">{cartTotal} PKR</p>
                  </div>
                  <button type="submit" className="w-full md:w-auto px-14 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-3xl transition-all shadow-xl text-[11px] uppercase tracking-[0.3em]">
                    Place My Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer / Contact Section */}
      <footer id="contact" className="bg-stone-950 text-stone-300 py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-24">
          <div className="col-span-1 md:col-span-2 space-y-12">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-600/20">
                <ChefHat size={32} />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white font-serif">iamhungry<span className="text-emerald-500">.com.pk</span></h1>
            </div>
            <p className="text-stone-400 max-w-sm leading-loose text-xl italic font-medium opacity-80">
              "Dedicated to the hungry souls of Lahore. Bringing the rich culinary heritage of Pakistan to your modern doorstep."
            </p>
            <div className="flex gap-8">
              {[Phone, Mail, MessageCircle].map((Icon, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all cursor-pointer group shadow-lg active:scale-95">
                  <Icon size={24} className="group-hover:scale-110 transition-transform" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[11px] mb-10 opacity-60">Kitchen Hotline</h4>
            <ul className="space-y-10">
              <li className="flex items-center gap-5 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-600/20 transition-all border border-white/5"><Phone size={20} className="text-emerald-500" /></div>
                <span className="font-black text-lg tracking-wide">{RESTAURANT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-5 group cursor-pointer whitespace-nowrap overflow-visible">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-600/20 transition-all border border-white/5 flex-shrink-0"><Mail size={20} className="text-emerald-500" /></div>
                <span className="font-bold text-lg">{RESTAURANT_INFO.email}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-[0.4em] text-[11px] mb-10 opacity-60">Operations</h4>
            <ul className="space-y-8 font-black text-sm tracking-widest">
              <li className="flex items-center gap-4 text-emerald-500">
                <Clock size={20}/> 12:00 PM - 12:00 AM
              </li>
              <li className="flex items-center gap-4 opacity-70">
                <MapPin size={20}/> Lahore Wide Delivery
              </li>
              <li className="flex items-center gap-4 text-stone-500 italic">
                <CheckCircle2 size={20}/> Hygiene Certified
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-20 mt-20 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.6em] opacity-40 font-black">
          <p>© {new Date().getFullYear()} iamhungry.com.pk — The Heart of Lahore.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
