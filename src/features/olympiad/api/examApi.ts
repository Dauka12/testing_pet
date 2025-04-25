import axios from 'axios';
import base_url from '../../../settings/base_url.js';
import {
    ExamCreateRequest,
    ExamQuestionRequest,
    ExamQuestionResponse,
    ExamResponse
} from '../types/exam';
import { TestCategory } from '../types/testCategory';

const API_URL = `${base_url}/api/olympiad`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

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

// Exams API
export const createExam = async (examData: ExamCreateRequest): Promise<ExamResponse> => {
    try {
        const response = await api.post<ExamResponse>('/exam/create', examData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при создании экзамена');
    }
};

export const getAllExams = async (): Promise<ExamResponse[]> => {
    try {
        const response = await api.get<ExamResponse[]>('/exam/all');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении списка экзаменов');
    }
};

export const getExamById = async (id: number): Promise<ExamResponse> => {
    try {
        const response = await api.get<ExamResponse>(`/exam/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении экзамена');
    }
};

export const deleteExam = async (id: number): Promise<void> => {
    try {
        await api.delete(`/exam/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при удалении экзамена');
    }
};

// Questions API
export const createQuestion = async (questionData: ExamQuestionRequest, testId: number): Promise<ExamQuestionResponse> => {
    try {
        const response = await api.post<ExamQuestionResponse>(`/exam-question/create/${testId}`, questionData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при создании вопроса');
    }
};

export const updateQuestion = async (questionData: ExamQuestionRequest, id: number): Promise<ExamQuestionResponse> => {
    try {
        const response = await api.patch<ExamQuestionResponse>(`/exam-question/${id}`, questionData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при обновлении вопроса');
    }
};

export const deleteQuestion = async (id: number): Promise<void> => {
    try {
        await api.delete(`/exam-question/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при удалении вопроса');
    }
};

// Update question with AI
export const updateQuestionWithAi = async (questionId: number, prompt: string): Promise<ExamQuestionResponse> => {
    try {
        const response = await api.patch<ExamQuestionResponse>('/exam-question/ai', {
            questionId,
            prompt
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при обновлении вопроса с помощью AI');
    }
};

// Get all test categories
export const getAllCategories = async (): Promise<TestCategory[]> => {
    try {
        const response = await api.get<TestCategory[]>('/exam/all-categories');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении категорий');
    }
};

// AI Test Generation
export const generateAiTest = async (prompt: { subject: string, numQuestions: number, difficulty: string }): Promise<number> => {
    try {
        const response = await api.post<{ examId: number }>('/exam/chat', prompt);
        return response.data.examId;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при генерации теста с помощью AI');
    }
};

// Session endpoints
export const endExamSession = async (examSessionId: number): Promise<void> => {
    try {
        await api.post(`/exam/session/end/${examSessionId}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при завершении сессии экзамена');
    }
};

// Get question by ID
export const getQuestionById = async (id: number): Promise<ExamQuestionResponse> => {
    try {
        const response = await api.get<ExamQuestionResponse>(`/exam-question/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении вопроса');
    }
};