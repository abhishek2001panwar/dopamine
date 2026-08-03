import { User } from '../models/User';
import { BADGES, Badge } from './badges';

export async function evaluateAndGrantBadges(userId: string): Promise<Badge[]> {
  const user = await User.findById(userId);
  if (!user) return [];

  // 1. Ensure array initialized safely even for older Mongo user documents
  const unlockedBadges = user.unlockedBadges || [];
  const newlyUnlocked: Badge[] = [];

  for (const badge of BADGES) {
    // Check safety array instead of user.unlockedBadges directly
    const alreadyUnlocked = unlockedBadges.includes(badge.id);
    if (alreadyUnlocked) continue;

    let qualifies = false;

    if (badge.conditionType === 'totalSpent' && (user.totalSpent || 0) >= badge.requiredValue) {
      qualifies = true;
    } else if (badge.conditionType === 'streakCount' && (user.streakCount || 0) >= badge.requiredValue) {
      qualifies = true;
    } else if (badge.conditionType === 'ordersCount' && (user.ordersCount || 0) >= badge.requiredValue) {
      qualifies = true;
    }

    if (qualifies) {
      if (!user.unlockedBadges) {
        user.unlockedBadges = [];
      }
      user.unlockedBadges.push(badge.id);
      user.fakeBalance = (user.fakeBalance || 0) + badge.rewardFakeBucks;
      newlyUnlocked.push(badge);
    }
  }

  if (newlyUnlocked.length > 0) {
    await user.save();
  }

  return newlyUnlocked;
}