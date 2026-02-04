import { Category, CollegeCutoffData } from "./types";

// Approximate data based on previous years' trends (2024-2025 data points)
export const MARKS_VS_PERCENTILE = [
  { marks: 300, percentile: 100 },
  { marks: 280, percentile: 99.99 },
  { marks: 250, percentile: 99.9 },
  { marks: 230, percentile: 99.5 },
  { marks: 210, percentile: 99.0 },
  { marks: 190, percentile: 98.5 },
  { marks: 170, percentile: 98.0 },
  { marks: 160, percentile: 97.0 },
  { marks: 150, percentile: 96.0 },
  { marks: 140, percentile: 95.0 },
  { marks: 130, percentile: 94.0 },
  { marks: 120, percentile: 93.0 },
  { marks: 110, percentile: 91.5 },
  { marks: 100, percentile: 90.0 },
  { marks: 90, percentile: 87.0 },
  { marks: 80, percentile: 84.0 },
  { marks: 70, percentile: 79.0 },
  { marks: 60, percentile: 73.0 },
  { marks: 50, percentile: 65.0 },
  { marks: 40, percentile: 55.0 },
  { marks: 0, percentile: 0 },
];

export const TOTAL_APPLICANTS = 1400000; // Estimated for 2026 cycle

// Multipliers to estimate Category Rank from AIR based on historical population distribution
export const CATEGORY_WEIGHTS: Record<Category, number> = {
  [Category.OPEN]: 1.0, // AIR is the rank
  [Category.OBC]: 0.34, // Approx 34% of candidates
  [Category.EWS]: 0.11, // Approx 11% of candidates
  [Category.SC]: 0.09,  // Approx 9% of candidates
  [Category.ST]: 0.04   // Approx 4% of candidates
};

// Simple icons for the UI
export const ICONS = {
  check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
  userGroup: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>`,
  chart: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" /></svg>`,
  badge: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.493V3.742a3.742 3.742 0 0 1 3.742-3.742H12a3.742 3.742 0 0 1 3.742 3.742v3.751m-7.484 0h14.968M4.636 10.612a9 9 0 0 0 14.728 0M12 18.75V21" /></svg>`,
  history: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`
};

// Static Database for filtering feature (Simulating a larger backend DB)
export const COLLEGE_DATABASE: CollegeCutoffData[] = [
    { id: '1', name: 'NIT Trichy', branch: 'Computer Science', quota: 'OS', category: Category.OPEN, closingRank: 1500, type: 'NIT' },
    { id: '2', name: 'NIT Trichy', branch: 'Computer Science', quota: 'OS', category: Category.OBC, closingRank: 400, type: 'NIT' },
    { id: '3', name: 'NIT Warangal', branch: 'Electronics & Comm', quota: 'OS', category: Category.OPEN, closingRank: 4500, type: 'NIT' },
    { id: '4', name: 'NIT Surathkal', branch: 'Mechanical', quota: 'OS', category: Category.OPEN, closingRank: 12000, type: 'NIT' },
    { id: '5', name: 'IIIT Hyderabad', branch: 'Computer Science', quota: 'AI', category: Category.OPEN, closingRank: 2000, type: 'IIIT' },
    { id: '6', name: 'IIIT Allahabad', branch: 'IT', quota: 'AI', category: Category.OPEN, closingRank: 4800, type: 'IIIT' },
    { id: '7', name: 'DTU (Delhi)', branch: 'Computer Science', quota: 'AI', category: Category.OPEN, closingRank: 6000, type: 'GFTI' },
    { id: '8', name: 'NIT Calicut', branch: 'Civil Engineering', quota: 'OS', category: Category.OPEN, closingRank: 28000, type: 'NIT' },
    { id: '9', name: 'NIT Rourkela', branch: 'Electrical', quota: 'OS', category: Category.SC, closingRank: 3000, type: 'NIT' },
    { id: '10', name: 'NIT Jaipur', branch: 'Chemical', quota: 'OS', category: Category.OPEN, closingRank: 35000, type: 'NIT' },
    { id: '11', name: 'IIIT Bangalore', branch: 'iMTech CSE', quota: 'AI', category: Category.OPEN, closingRank: 8000, type: 'IIIT' },
    { id: '12', name: 'NSUT (Delhi)', branch: 'CS & AI', quota: 'AI', category: Category.OPEN, closingRank: 5500, type: 'GFTI' },
    { id: '13', name: 'NIT Trichy', branch: 'Production', quota: 'HS', category: Category.OPEN, closingRank: 25000, type: 'NIT' },
    { id: '14', name: 'NIT Hamirpur', branch: 'Computer Science', quota: 'OS', category: Category.OPEN, closingRank: 10500, type: 'NIT' },
    { id: '15', name: 'PEC Chandigarh', branch: 'Aerospace', quota: 'AI', category: Category.OPEN, closingRank: 22000, type: 'GFTI' }
];