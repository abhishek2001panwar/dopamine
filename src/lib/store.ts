import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  image: string;
  selectedSize?: string;
}

export interface Badge {
  id?: string;
  _id?: string;
  name: string;
  title?: string;
  description: string;
  icon?: string;
  rewardFakeBucks?: number;
  unlockedAt?: string;
}

interface AppStore {
  fakeBalance: number;
  streakCount: number;
  lastClaimedDate: string | null;
  onboarded: boolean;
  cart: CartItem[];

  // Badge Notification State
  activeNotificationBadge: Badge | null;
  setActiveNotificationBadge: (badge: Badge | null) => void;
  clearBadgeNotification: () => void;

  setUserData: (data: { 
    fakeBalance?: number; 
    streakCount?: number; 
    lastClaimedDate?: string | null; 
    onboarded?: boolean; 
    cart?: CartItem[] 
  }) => void;
  setBalance: (amount: number) => void;
  setOnboarded: (status: boolean) => void;
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Added resetUser Action
  resetUser: () => void;
}

const DEFAULT_STATE = {
  fakeBalance: 10000,
  streakCount: 0,
  lastClaimedDate: null,
  onboarded: false,
  cart: [],
  activeNotificationBadge: null,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      // Badge Notification Actions
      setActiveNotificationBadge: (badge) => set({ activeNotificationBadge: badge }),
      clearBadgeNotification: () => set({ activeNotificationBadge: null }),

      setUserData: (data) =>
        set((state) => ({
          fakeBalance: data.fakeBalance ?? state.fakeBalance,
          streakCount: data.streakCount ?? state.streakCount,
          lastClaimedDate: data.lastClaimedDate !== undefined ? data.lastClaimedDate : state.lastClaimedDate,
          onboarded: data.onboarded ?? state.onboarded,
          cart: Array.isArray(data.cart) ? data.cart : state.cart,
        })),

      setBalance: (amount) => set({ fakeBalance: amount }),
      setOnboarded: (status) => set({ onboarded: status }),

      addToCart: (item: any) => {
        const currentCart = get().cart || [];
        const updatedCart = [...currentCart, item];
        set({ cart: updatedCart });
      },

      removeFromCart: (id: string) => {
        const currentCart = get().cart || [];
        const updatedCart = currentCart.filter((i) => i._id !== id);
        set({ cart: updatedCart });
      },

      clearCart: () => set({ cart: [] }),

      // Clears store data & local storage upon logout
      resetUser: () => {
        set(DEFAULT_STATE);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dopacart_daily_claimed_date');
          localStorage.removeItem('dopacart_daily_spin_date');
        }
      },
    }),
    {
      name: 'dopacart-store-storage',
    }
  )
);