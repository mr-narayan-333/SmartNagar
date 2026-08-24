import type { IssueTypeValue, ReportPriority } from '@/lib/report-draft';

/**
 * STATIC MOCK nearby issues for the Map tab.
 * This is not live GIS data: pins use fixed percentages inside a styled View,
 * not latitude/longitude, GPS, or a map SDK.
 */
export type NearbyIssue = {
  id: string;
  title: string;
  category: IssueTypeValue;
  priority: ReportPriority;
  address: string;
  distance: string;
  reportedAgo: string;
  /** Percentage offsets inside the mock map box (0–100). */
  pinTop: number;
  pinLeft: number;
};

export const MOCK_NEARBY_ISSUES: NearbyIssue[] = [
  {
    id: 'near-1',
    title: 'Overflowing Drain',
    category: 'drainage',
    priority: 'High',
    address: 'Ward 12, Main St. Intersection',
    distance: '0.2 km',
    reportedAgo: '2h ago',
    pinTop: 28,
    pinLeft: 42,
  },
  {
    id: 'near-2',
    title: 'Uncollected Garbage Dump',
    category: 'garbage',
    priority: 'Medium',
    address: 'Ward 8, Park Avenue Back Alley',
    distance: '0.3 km',
    reportedAgo: '5h ago',
    pinTop: 48,
    pinLeft: 62,
  },
  {
    id: 'near-3',
    title: 'Streetlight Not Working',
    category: 'streetlight',
    priority: 'Medium',
    address: 'Ward 10, Sector 4 Roundabout',
    distance: '0.4 km',
    reportedAgo: '1d ago',
    pinTop: 66,
    pinLeft: 28,
  },
  {
    id: 'near-4',
    title: 'Pothole near market',
    category: 'pothole',
    priority: 'High',
    address: 'Ward 4, Civic Market Lane',
    distance: '0.5 km',
    reportedAgo: '3h ago',
    pinTop: 22,
    pinLeft: 72,
  },
  {
    id: 'near-5',
    title: 'Open manhole',
    category: 'drainage',
    priority: 'Low',
    address: 'Ward 6, Lake View Road',
    distance: '0.7 km',
    reportedAgo: '2d ago',
    pinTop: 58,
    pinLeft: 18,
  },
  {
    id: 'near-6',
    title: 'Broken footpath slab',
    category: 'pothole',
    priority: 'Low',
    address: 'Ward 2, Station Approach',
    distance: '0.9 km',
    reportedAgo: '4d ago',
    pinTop: 38,
    pinLeft: 14,
  },
];
