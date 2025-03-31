import axios from 'axios';
import base_url from '../../../settings/base_url.js';
import { DEMO_MODE, simulateDelay } from '../demoMode';
import { LoginRequest, LoginResponse } from '../types/auth';
import { RegisterStudentRequest, RegisterStudentResponse } from '../types/student';

// Demo user data
const DEMO_USER: LoginResponse = {
    token: "demo_token_123456789",
    firstname: "Таңырыс",
    lastname: "",
    middlename: "Айбынқызы",
    iin: "000000000000",
    phone: "+7 777 367 2796",
    university: "Astana International University",
    email: "asan.tusupov@example.com"
};

// Create axios instance with base URL and default headers
const olympiadApi = axios.create({
    baseURL: `${base_url}/api/olympiad`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Custom type guard for Axios errors
interface AxiosError {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
}

function isAxiosError(error: any): error is AxiosError {
    return error && typeof error === 'object' && 'response' in error;
}

// Add request interceptor to attach the token
olympiadApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('olympiad_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const registerStudent = async (studentData: RegisterStudentRequest): Promise<RegisterStudentResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();

        // Check if IIN is already used (in demo we'll just check against our demo user)
        if (studentData.iin === DEMO_USER.iin) {
            throw new Error("Пользователь с таким ИИН уже зарегистрирован");
        }

        return {
            success: true,
            message: "Регистрация успешно завершена",
            student: {
                id: Math.floor(Math.random() * 1000) + 1,
                firstname: studentData.firstname,
                lastname: studentData.lastname,
                middlename: studentData.middlename,
                iin: studentData.iin,
                phone: studentData.phone,
                university: studentData.university,
                email: studentData.email,
                password: ""
            }
        };
    }

    try {
        const response = await olympiadApi.post<RegisterStudentResponse>('/auth/register', studentData);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
        throw new Error('Registration failed');
    }
};

export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();

        // For demo, we'll accept any credentials with IIN starting with '99' or our demo user
        // You can modify this logic as needed
        if (credentials.iin === DEMO_USER.iin || credentials.iin.startsWith('99')) {
            // Store token and user in localStorage for persistence
            localStorage.setItem('olympiad_token', DEMO_USER.token);
            localStorage.setItem('olympiad_user', JSON.stringify(DEMO_USER));
            return DEMO_USER;
        } else {
            throw new Error("Неверный ИИН или пароль");
        }
    }

    try {
        const response = await olympiadApi.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Ошибка авторизации');
        }
        throw error;
    }
};

export const logoutUser = (): void => {
    localStorage.removeItem('olympiad_token');
    localStorage.removeItem('olympiad_user');
};