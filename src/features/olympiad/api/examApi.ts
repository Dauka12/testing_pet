import axios from 'axios';
import base_url from '../../../settings/base_url.js';
import { DEMO_MODE, simulateDelay } from '../demoMode';
import {
    ExamCreateRequest,
    ExamQuestionRequest,
    ExamQuestionResponse,
    ExamResponse
} from '../types/exam';
import { TestCategory } from '../types/testCategory';

// Demo data
const DEMO_CATEGORIES: TestCategory[] = [
    { id: 1, nameRus: "Математика", nameKaz: "Математика" },
    { id: 2, nameRus: "Физика", nameKaz: "Физика" },
    { id: 3, nameRus: "Химия", nameKaz: "Химия" },
    { id: 4, nameRus: "Биология", nameKaz: "Биология" },
    { id: 5, nameRus: "Информатика", nameKaz: "Информатика" }
];

const DEMO_EXAMS: ExamResponse[] = [
    {
        id: 1,
        nameRus: "Математика - общий курс",
        nameKaz: "Математика - жалпы курс",
        typeRus: "Отборочный",
        typeKaz: "Іріктеу",
        startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
        durationInMinutes: 60
    },
    {
        id: 2,
        nameRus: "Физика - механика",
        nameKaz: "Физика - механика",
        typeRus: "Финальный",
        typeKaz: "Финалдық",
        startTime: new Date(Date.now() + 2 * 86400000).toISOString(),
        durationInMinutes: 90
    },
    {
        id: 3,
        nameRus: "Химия - неорганическая",
        nameKaz: "Химия - бейорганикалық",
        typeRus: "Отборочный",
        typeKaz: "Іріктеу",
        startTime: new Date(Date.now() + 5 * 86400000).toISOString(),
        durationInMinutes: 75
    }
];

// Demo exam with questions
const getDemoExamWithQuestions = (id: number): ExamResponse => {
    const exam = DEMO_EXAMS.find(e => e.id === id) || DEMO_EXAMS[0];

    return {
        ...exam,
        questions: [
            {
                id: 101,
                questionRus: "Решите уравнение: 5x - 3 = 12",
                questionKaz: "Теңдеуді шешіңіз: 5x - 3 = 12",
                correctOptionId: 2,
                options: [
                    { id: 1, nameRus: "x = 2", nameKaz: "x = 2" },
                    { id: 2, nameRus: "x = 3", nameKaz: "x = 3" },
                    { id: 3, nameRus: "x = 4", nameKaz: "x = 4" },
                    { id: 4, nameRus: "x = 5", nameKaz: "x = 5" }
                ]
            },
            {
                id: 102,
                questionRus: "Найдите площадь квадрата со стороной 6 см",
                questionKaz: "Қабырғасы 6 см болатын шаршының ауданын табыңыз",
                correctOptionId: 7,
                options: [
                    { id: 5, nameRus: "12 см²", nameKaz: "12 см²" },
                    { id: 6, nameRus: "24 см²", nameKaz: "24 см²" },
                    { id: 7, nameRus: "36 см²", nameKaz: "36 см²" },
                    { id: 8, nameRus: "42 см²", nameKaz: "42 см²" }
                ]
            }
        ]
    };
};

const API_URL = `${base_url}/api/olympiad`;

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

// Exams API
export const createExam = async (examData: ExamCreateRequest): Promise<ExamResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return {
            id: Math.floor(Math.random() * 1000) + 100,
            nameRus: examData.nameRus,
            nameKaz: examData.nameKaz,
            typeRus: examData.typeRus,
            typeKaz: examData.typeKaz,
            startTime: examData.startTime,
            durationInMinutes: examData.durationInMinutes,
            questions: examData.questions?.map((q, idx) => ({
                id: Math.floor(Math.random() * 1000) + 200 + idx,
                questionRus: q.questionRus,
                questionKaz: q.questionKaz,
                correctOptionId: q.correctOptionId,
                options: q.options.map((o, optIdx) => ({
                    id: Math.floor(Math.random() * 1000) + 300 + optIdx,
                    nameRus: o.nameRus,
                    nameKaz: o.nameKaz
                }))
            }))
        };
    }

    try {
        const response = await api.post<ExamResponse>('/exam/create', examData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при создании экзамена');
    }
};

export const getAllExams = async (): Promise<ExamResponse[]> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return DEMO_EXAMS;
    }

    try {
        const response = await api.get<ExamResponse[]>('/exam/all');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении списка экзаменов');
    }
};

export const getExamById = async (id: number): Promise<ExamResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return getDemoExamWithQuestions(id);
    }

    try {
        const response = await api.get<ExamResponse>(`/exam/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении экзамена');
    }
};

export const deleteExam = async (id: number): Promise<void> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return;
    }

    try {
        await api.delete(`/exam/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при удалении экзамена');
    }
};

// Questions API
export const createQuestion = async (questionData: ExamQuestionRequest, testId: number): Promise<ExamQuestionResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return {
            id: Math.floor(Math.random() * 1000) + 400,
            questionRus: questionData.questionRus,
            questionKaz: questionData.questionKaz,
            correctOptionId: questionData.correctOptionId,
            options: questionData.options.map((o, idx) => ({
                id: Math.floor(Math.random() * 1000) + 500 + idx,
                nameRus: o.nameRus,
                nameKaz: o.nameKaz
            }))
        };
    }

    try {
        const response = await api.post<ExamQuestionResponse>(`/exam-question/create/${testId}`, questionData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при создании вопроса');
    }
};

export const updateQuestion = async (questionData: ExamQuestionRequest, id: number): Promise<void> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return;
    }

    try {
        await api.patch(`/exam-question/${id}`, questionData);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при обновлении вопроса');
    }
};

export const deleteQuestion = async (id: number): Promise<void> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return;
    }

    try {
        await api.delete(`/exam-question/${id}`);
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при удалении вопроса');
    }
};

// Get all test categories
export const getAllCategories = async (): Promise<TestCategory[]> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return DEMO_CATEGORIES;
    }

    try {
        const response = await api.get<TestCategory[]>('/exam/all-categories');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Ошибка при получении категорий');
    }
};