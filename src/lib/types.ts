export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  INACTIVE = 'inactive'
}

export enum PaymentStatus {
  ACTIVE = 'active',
  OVERDUE = 'overdue',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface SecurityOfficer {
  userType: 'officer';
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  scansThisWeek: number;
  targetScans?: number;
}

export interface Resident {
  userType: 'resident';
  id: string;
  username: string;
  email: string;
  status: UserStatus;
  subscriptionEndDate: string;
  paymentStatus?: PaymentStatus;
}

export interface Admin {
  userType: 'admin';
  id: string;
  username: string;
  email: string;
  status: UserStatus;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  date: string;
  reference: string;
  subscriptionPeriod: string;
  isSuccessful: boolean;
}

export type User = SecurityOfficer | Resident | Admin;