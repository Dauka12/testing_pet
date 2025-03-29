import axios from 'axios';
import base_url from '../../../settings/base_url.js';
import {
    StudentExamSessionRequest,
    StudentExamSessionResponse,
    StudentExamSessionResponses,
    UpdateAnswerRequest,
} from '../types/testSession';

const API_URL = `${base_url}/api/olympiad/exam/session`;

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
}); 

// Add request interceptor for auth token
api.interceptors.request.use(
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

// Start an exam session
export const startExamSession = async (request: StudentExamSessionRequest): Promise<StudentExamSessionResponse> => {
    try {
        const response = await api.post<StudentExamSessionResponse>('/start', request);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to start exam session');
    }
};

// End an exam session
export const endExamSession = async (examSessionId: number): Promise<StudentExamSessionResponse> => {
    try {
        const response = await api.post<StudentExamSessionResponse>(`/end/${examSessionId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to end exam session');
    }
};

// Get a specific exam session
export const getExamSession = async (examSessionId: number): Promise<StudentExamSessionResponse> => {
    try {
        const response = await api.post<StudentExamSessionResponse>(`/student/${examSessionId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to retrieve exam session');
    }
};

// Get all sessions for the authenticated student
export const getStudentExamSessions = async (): Promise<StudentExamSessionResponses[]> => {
    try {
        const response = await api.get<StudentExamSessionResponses[]>('/student');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to retrieve exam sessions');
    }
};

// Update an answer during an active exam
export const updateAnswer = async (request: UpdateAnswerRequest): Promise<string> => {
    try {
        const response = await api.post<string>('/answer/update', request);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update answer');
    }
};

// Delete an answer during an active exam
export const deleteAnswer = async (request: UpdateAnswerRequest): Promise<string> => {
    try {
        const response = await api.request<string>({
            url: '/answer/delete',
            method: 'DELETE',
            data: JSON.stringify(request),
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete answer');
    }
};