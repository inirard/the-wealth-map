
"use client";

import { useLocalStorage } from './use-local-storage';

type Plan = 'basic' | 'premium';

// For demo purposes, we allow easy switching.
// In a real app, this would be tied to a user's auth state and subscription status.
export function usePlan(): { plan: Plan, setPlan: (plan: Plan) => void } {
  const [plan, setPlan] = useLocalStorage<Plan>('userPlan', 'basic');
  return { plan, setPlan };
}
