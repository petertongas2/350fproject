export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  votedOptions: Set<string>;
  lastLoginAt?: string;
  status?: 'active' | 'inactive';
}

export interface Candidate {
  id: string;
  name: string;
  description: string;
  votes: number;
  position?: string;
  imageUrl?: string;
  campaignDetails?: string;
}

export interface VotingOption {
  id: string;
  name: string;
  title: string;
  description: string;
  candidates: Candidate[];
  startDate: string;
  endDate: string;
  type: 'single' | 'multiple' | 'ranked';
  maxSelections: number;
  status: 'draft' | 'active' | 'ended';
  createdBy: string;
  updatedAt: string;
}

export interface BallotRecord {
  id: string;
  userId: string;
  optionId: string;
  candidateId: string;
  timestamp: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  ipAddress?: string;
  deviceInfo?: string;
}