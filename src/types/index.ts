// src/types/index.ts

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'officer' | 'resident';
}

export interface PatrolReport {
    id: string;
    officerId: string;
    timestamp: Date;
    location: string;
    description: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export interface Geolocation {
    latitude: number;
    longitude: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegistrationData {
    name: string;
    email: string;
    password: string;
    role: 'resident' | 'officer';
}

export interface LoginData {
    email: string;
    password: string;
}