import { create } from 'zustand';
import { Badge } from '@/lib/badges';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
}

interface AppStore {
  fakeBalance: number;
  streakCount: number;
  lastClaimedDate: string | null;
  cart: CartItem[];
  activeNotificationBadge: Badge | null;
  
  setUserData: (data: { fakeBalance: number; streakCount: number; lastClaimedDate: string | null }) => void;
  setBalance: (amount: number) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  showBadgeNotification: (badge: Badge) => void;
  clearBadgeNotification: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  fakeBalance: 10000,
  streakCount: 0,
  lastClaimedDate: null,
  cart: [],
  activeNotificationBadge: null,

  setUserData: (data) => set({
    fakeBalance: data.fakeBalance,
    streakCount: data.streakCount,
    lastClaimedDate: data.lastClaimedDate,
  }),
  setBalance: (amount) => set({ fakeBalance: amount }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i._id !== id) })),
  clearCart: () => set({ cart: [] }),
  showBadgeNotification: (badge) => set({ activeNotificationBadge: badge }),
  clearBadgeNotification: () => set({ activeNotificationBadge: null }),
}));