export interface AuthUser {
    firstname: string;
    lastname: string;
    middlename: string;
    iin: string;
    phone: string;
    university: string;
    email: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

export interface LoginRequest {
    iin: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    firstname: string;
    lastname: string;
    middlename: string;
    iin: string;
    phone: string;
    university: string;
    email: string;
}