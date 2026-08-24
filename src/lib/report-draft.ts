export const ISSUE_TYPES = [
  { value: 'garbage', label: 'Garbage' },
  { value: 'pothole', label: 'Pothole' },
  { value: 'drainage', label: 'Drainage' },
  { value: 'streetlight', label: 'Streetlight' },
  { value: 'others', label: 'Others' },
] as const;

export type IssueTypeValue = (typeof ISSUE_TYPES)[number]['value'];

export function parseIssueType(raw: unknown): IssueTypeValue | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== 'string') {
    return undefined;
  }
  return ISSUE_TYPES.find((item) => item.value === value)?.value;
}

export const DEPARTMENT_BY_TYPE: Record<IssueTypeValue, string> = {
  garbage: 'Waste Management Services',
  pothole: 'Roads & Infrastructure',
  drainage: 'Water & Drainage',
  streetlight: 'Electrical / Street Lighting',
  others: 'General Civic Services',
};

export const MOCK_LOCATION = {
  address: '123 Civic Road, Central Zone',
  lat: '28.6139',
  lng: '77.2090',
} as const;

export const MOCK_CONFIDENCE = 92;
export const MOCK_PRIORITY = 'High' as const;

export type ReportDraft = {
  category: IssueTypeValue;
  categoryLabel: string;
  description: string;
  photoUris: string[];
};

let draft: ReportDraft | null = null;

export function setReportDraft(next: ReportDraft) {
  draft = next;
}

export function getReportDraft(): ReportDraft | null {
  return draft;
}

export function clearReportDraft() {
  draft = null;
}

export function createTicketId() {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return `JRK${digits}`;
}

export type ReportStatus = 'Reported' | 'Assigned' | 'In Progress' | 'Resolved' | 'Verified';
export type ReportPriority = 'High' | 'Medium' | 'Low';
export type TimelineState = 'done' | 'current' | 'pending';

export type TimelineStep = {
  key: string;
  title: string;
  timestamp?: string;
  detail?: string;
  state: TimelineState;
};

export type CitizenReport = {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  category: IssueTypeValue;
  priority: ReportPriority;
  status: ReportStatus;
  dateLabel: string;
  photoUri?: string;
  timeline: TimelineStep[];
};

const SEED_REPORTS: CitizenReport[] = [
  {
    id: 'JRK250331',
    ticketId: 'JRK250331',
    title: 'Pothole on Main St.',
    description: 'Large pothole in the right lane near the intersection causing traffic delay.',
    category: 'pothole',
    priority: 'Medium',
    status: 'In Progress',
    dateLabel: '20 Oct',
    timeline: [
      {
        key: 'reported',
        title: 'Reported',
        timestamp: '20 Oct, 09:14 AM',
        detail: 'Issue logged into system.',
        state: 'done',
      },
      {
        key: 'assigned',
        title: 'Assigned',
        timestamp: '21 Oct, 02:30 PM',
        detail: 'Assigned to Public Works Team Beta.',
        state: 'done',
      },
      {
        key: 'in-progress',
        title: 'In Progress',
        timestamp: '22 Oct, 08:00 AM',
        detail: 'Crew dispatched to site for repair work.',
        state: 'current',
      },
      {
        key: 'resolved',
        title: 'Resolved',
        state: 'pending',
      },
    ],
  },
  {
    id: 'JRK250410',
    ticketId: 'JRK250410',
    title: 'Streetlight Outage',
    description: 'Streetlight post #442 on Elm St is flickering and mostly off.',
    category: 'streetlight',
    priority: 'Low',
    status: 'Reported',
    dateLabel: '23 Oct',
    timeline: [
      {
        key: 'reported',
        title: 'Reported',
        timestamp: '23 Oct, 06:45 PM',
        detail: 'Pending assignment.',
        state: 'current',
      },
      { key: 'assigned', title: 'Assigned', state: 'pending' },
      { key: 'in-progress', title: 'In Progress', state: 'pending' },
      { key: 'resolved', title: 'Resolved', state: 'pending' },
    ],
  },
  {
    id: 'JRK250208',
    ticketId: 'JRK250208',
    title: 'Garbage pile-up',
    description: 'Uncollected waste near the ward market entrance.',
    category: 'garbage',
    priority: 'High',
    status: 'Resolved',
    dateLabel: '12 Oct',
    timeline: [
      {
        key: 'reported',
        title: 'Reported',
        timestamp: '12 Oct, 07:10 AM',
        detail: 'Issue logged into system.',
        state: 'done',
      },
      {
        key: 'assigned',
        title: 'Assigned',
        timestamp: '12 Oct, 11:20 AM',
        detail: 'Routed to Waste Management Services.',
        state: 'done',
      },
      {
        key: 'in-progress',
        title: 'In Progress',
        timestamp: '13 Oct, 09:00 AM',
        detail: 'Collection crew on site.',
        state: 'done',
      },
      {
        key: 'resolved',
        title: 'Resolved',
        timestamp: '13 Oct, 04:15 PM',
        detail: 'Area cleared and verified by supervisor.',
        state: 'current',
      },
    ],
  },
];

let citizenReports: CitizenReport[] = SEED_REPORTS;
const reportListeners = new Set<() => void>();

function emitReports() {
  reportListeners.forEach((listener) => listener());
}

export function getCitizenReports() {
  return citizenReports;
}

export function subscribeCitizenReports(listener: () => void) {
  reportListeners.add(listener);
  return () => {
    reportListeners.delete(listener);
  };
}

export function addCitizenReport(report: CitizenReport) {
  citizenReports = [report, ...citizenReports];
  emitReports();
}

export function getCitizenReportById(id: string) {
  return citizenReports.find((report) => report.id === id);
}

export function updateCitizenReport(
  id: string,
  updater: (report: CitizenReport) => CitizenReport,
) {
  let changed = false;
  citizenReports = citizenReports.map((report) => {
    if (report.id !== id) {
      return report;
    }
    changed = true;
    return updater(report);
  });
  if (changed) {
    emitReports();
  }
}
