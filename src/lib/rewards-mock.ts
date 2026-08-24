/**
 * STATIC MOCK community rewards. Names, ranks, and points are placeholders
 * and are not derived from report-draft.ts or any backend.
 */
import type { ComponentProps } from 'react';

import type MaterialIcons from '@expo/vector-icons/MaterialIcons';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export const MOCK_CIVIC_POINTS = 1250;
export const MOCK_USER_RANK = 42;

export type LeaderboardEntry = {
  rank: number;
  name: string;
  zone: string;
  points: number;
  isYou?: boolean;
};

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Asha Verma', zone: 'North District', points: 3420 },
  { rank: 2, name: 'Rohan Iyer', zone: 'Central Zone', points: 2850 },
  { rank: 3, name: 'Anita Patel', zone: 'East Ward', points: 2100 },
  { rank: 4, name: 'Farhan Qureshi', zone: 'South District', points: 1950 },
  { rank: 5, name: 'Meera Joshi', zone: 'West Colony', points: 1680 },
  { rank: 6, name: 'Kabir Singh', zone: 'Lake Ward', points: 1510 },
];

export type CivicBadge = {
  id: string;
  title: string;
  detail: string;
  icon: IconName;
  earned: boolean;
  progressLabel?: string;
  progressPct?: number;
};

export const MOCK_BADGES: CivicBadge[] = [
  {
    id: 'clean-streets',
    title: 'Clean Streets Hero',
    detail: '5+ sanitation reports resolved.',
    icon: 'cleaning-services',
    earned: true,
  },
  {
    id: 'ten-reports',
    title: 'Active Citizen',
    detail: '10 Issues Reported',
    icon: 'campaign',
    earned: true,
  },
  {
    id: 'first-verified',
    title: 'First Verified Resolution',
    detail: 'Confirmed a resolved civic issue.',
    icon: 'verified-user',
    earned: true,
  },
  {
    id: 'green-guardian',
    title: 'Green Guardian',
    detail: 'Report 5 park issues.',
    icon: 'lock',
    earned: false,
    progressLabel: '2/5',
    progressPct: 40,
  },
];

export type RewardActivity = {
  id: string;
  title: string;
  detail: string;
  points: number;
  when: string;
  icon: IconName;
};

export const MOCK_REWARD_ACTIVITY: RewardActivity[] = [
  {
    id: 'act-1',
    title: 'Issue Resolved: Pothole on Main St.',
    detail: 'The municipal team fixed the issue you reported.',
    points: 50,
    when: 'Yesterday, 14:30',
    icon: 'task-alt',
  },
  {
    id: 'act-2',
    title: 'New Report Filed',
    detail: 'Reported broken streetlight in Central Park.',
    points: 10,
    when: '12 Oct, 09:15',
    icon: 'edit-document',
  },
  {
    id: 'act-3',
    title: 'Badge Earned: Clean Streets Hero',
    detail: 'Congratulations! You reached a new milestone.',
    points: 100,
    when: '10 Oct, 11:00',
    icon: 'workspace-premium',
  },
];
