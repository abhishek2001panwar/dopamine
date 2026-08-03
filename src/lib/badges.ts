import { Badge } from "lucide-react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or SVG name
  conditionType: 'totalSpent' | 'streakCount' | 'ordersCount';
  requiredValue: number;
  rewardFakeBucks: number;
}

export const BADGES: Badge[] = [
  {
    id: 'first_dopamine',
    name: 'First Hit',
    description: 'Place your very first fake order.',
    icon: '🛍️',
    conditionType: 'ordersCount',
    requiredValue: 1,
    rewardFakeBucks: 1000,
  },
  {
    id: 'big_spender_50k',
    name: 'Virtual Baller',
    description: 'Spend a total of $50,000 Fake Bucks.',
    icon: '💸',
    conditionType: 'totalSpent',
    requiredValue: 50000,
    rewardFakeBucks: 5000,
  },
  {
    id: 'millionaire',
    name: 'Dopamine Millionaire',
    description: 'Spend $1,000,000 Fake Bucks in cloud therapy.',
    icon: '💎',
    conditionType: 'totalSpent',
    requiredValue: 1000000,
    rewardFakeBucks: 50000,
  },
  {
    id: 'streak_7',
    name: 'Week-Long Window Shopper',
    description: 'Maintain a 7-day daily login streak.',
    icon: '🔥',
    conditionType: 'streakCount',
    requiredValue: 7,
    rewardFakeBucks: 10000,
  },
];