import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreStatus, VendorUser, StoreProfile } from '../types';

interface AuthContextType {
  user: VendorUser | null;
  store: StoreProfile;
  isAuthenticated: boolean;
  login: (identifier: string, pass?: string) => Promise<boolean>;
  logout: () => void;
  updateStoreStatus: (status: StoreStatus) => void;
  updateStoreProfile: (updates: Partial<StoreProfile>) => void;
  isKycCompleted: boolean;
  setKycCompleted: (val: boolean) => void;
}

const INITIAL_STORE: StoreProfile = {
  id: 'store_vogue_8892',
  name: 'Vogue Loom Studio',
  tagline: 'Contemporary & Luxury Ethnic Wear for Men & Women',
  ownerName: 'Vikramaditya Oberoi',
  phone: '+91 98201 44520',
  email: 'partner@vogueloom.com',
  address: {
    street: 'Shop 14, Ground Floor, Linking Road',
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    coordinates: { lat: 19.0607, lng: 72.8362 }
  },
  gstin: '27AABCV1294K1Z8',
  panNumber: 'AABCV1294K',
  businessType: 'Pvt Ltd',
  bankDetails: {
    accountNumber: '•••• •••• 9824',
    ifscCode: 'HDFC0000128',
    bankName: 'HDFC Bank',
    branch: 'Bandra West Branch, Mumbai',
    accountHolder: 'Vogue Loom Retail Private Limited'
  },
  status: 'ACTIVE',
  rating: 4.85,
  totalReviews: 428,
  images: [
    '/assets/boutique_store.png',
    '/assets/hero_banner.png'
  ],
  logo: '/image.png',
  commissionRate: 12.5,
  operatingHours: '10:00 AM - 09:30 PM (Daily)'
};

const INITIAL_USER: VendorUser = {
  id: 'usr_owner_01',
  name: 'Vikramaditya Oberoi',
  email: 'vikram@vogueloom.com',
  phone: '+91 98201 44520',
  role: 'STORE_OWNER',
  storeId: 'store_vogue_8892',
  storeName: 'Vogue Loom Studio',
  storeStatus: 'ACTIVE',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<VendorUser | null>(() => {
    const saved = localStorage.getItem('wn_vendor_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [store, setStore] = useState<StoreProfile>(() => {
    const saved = localStorage.getItem('wn_store_profile');
    return saved ? JSON.parse(saved) : INITIAL_STORE;
  });

  const [isKycCompleted, setKycCompleted] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('wn_vendor_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('wn_vendor_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('wn_store_profile', JSON.stringify(store));
  }, [store]);

  const login = async (identifier: string, _pass?: string): Promise<boolean> => {
    // Realistic authentication flow
    const loggedUser: VendorUser = {
      ...INITIAL_USER,
      email: identifier.includes('@') ? identifier : 'vikram@vogueloom.com',
      phone: !identifier.includes('@') ? identifier : '+91 98201 44520',
      storeStatus: store.status
    };
    setUser(loggedUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('wn_vendor_user');
  };

  const updateStoreStatus = (status: StoreStatus) => {
    setStore((prev) => ({ ...prev, status }));
    if (user) {
      setUser((prev) => (prev ? { ...prev, storeStatus: status } : null));
    }
  };

  const updateStoreProfile = (updates: Partial<StoreProfile>) => {
    setStore((prev) => ({ ...prev, ...updates }));
    if (updates.name && user) {
      setUser((prev) => (prev ? { ...prev, storeName: updates.name! } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        store,
        isAuthenticated: !!user,
        login,
        logout,
        updateStoreStatus,
        updateStoreProfile,
        isKycCompleted,
        setKycCompleted
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
