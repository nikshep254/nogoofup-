export enum Category {
  OPEN = 'General / Open',
  OBC = 'OBC-NCL',
  EWS = 'General-EWS',
  SC = 'SC',
  ST = 'ST',
}

export interface SubjectMarks {
  physics: number;
  chemistry: number;
  maths: number;
}

export interface UserInput {
  name: string;
  marks: SubjectMarks; // Changed from number to object
  totalMarks: number;
  category: Category;
  state: string;
}

export interface CalculatedMetrics {
  percentile: number;
  rank: number;
  categoryRank: number; // Made mandatory
}

export interface CollegeSuggestion {
  name: string;
  probability: 'High' | 'Medium' | 'Low';
  branch: string;
}

export interface CollegeCutoffData {
  id: string;
  name: string;
  branch: string;
  quota: 'HS' | 'OS' | 'AI'; // Home State, Other State, All India
  category: Category;
  closingRank: number;
  type: 'IIT' | 'NIT' | 'IIIT' | 'GFTI';
}

export interface PredictionHistoryItem {
  id: string;
  date: string;
  input: UserInput;
  metrics: CalculatedMetrics;
}

export interface UserProfile {
  name: string;
  category: Category;
  homeState: string;
  bestMarks?: SubjectMarks;
  history: PredictionHistoryItem[];
}

export interface PredictionResult extends CalculatedMetrics {
  aiAnalysis: string;
  suggestedColleges: CollegeSuggestion[];
}

export const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry"
];