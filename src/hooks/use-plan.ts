
"use client";

import { useLocalStorage } from './use-local-storage';

// This is a placeholder hook. When authentication is implemented,
// the plan will be derived from the user's subscription status.
type Plan = 'basic' | 'premium';

export function usePlan(): { plan: Plan, setPlan: (plan: Plan) => void } {
  // Default to 'premium' when no auth is present to show all features
  const [plan, setPlan] = useLocalStorage<Plan>('userPlan', 'premium');
  return { plan, setPlan };
}
