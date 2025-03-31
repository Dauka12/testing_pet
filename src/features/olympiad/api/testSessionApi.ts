import axios from 'axios';
import base_url from '../../../settings/base_url.js';
import { DEMO_MODE, simulateDelay } from '../demoMode';
import {
    SessionExamQuestionResponse,
    StudentAnswerResponse,
    StudentExamSessionRequest,
    StudentExamSessionResponse,
    StudentExamSessionResponses,
    UpdateAnswerRequest
} from '../types/testSession';

// Demo data
const DEMO_SESSIONS: StudentExamSessionResponses[] = [
    {
        id: 101,
        examData: {
            id: 201,
            nameRus: "Математика",
            nameKaz: "Математика",
            typeRus: "Вступительный тест",
            typeKaz: "Кіру тесті",
            startTime: new Date(Date.now() - 2 * 86400000).toISOString(),
            durationInMinutes: 60
        },
        startTime: new Date(Date.now() - 1 * 86400000).toISOString(),
        endTime: new Date(Date.now() - 1 * 86400000 + 55 * 60000).toISOString()
    },
    {
        id: 102,
        examData: {
            id: 202,
            nameRus: "Физика",
            nameKaz: "Физика",
            typeRus: "Отборочный тур",
            typeKaz: "Іріктеу кезеңі",
            startTime: new Date(Date.now() - 24 * 3600000).toISOString(),
            durationInMinutes: 90
        },
        startTime: new Date(Date.now() - 12 * 3600000).toISOString(),
        endTime: new Date(Date.now() - 12 * 3600000 + 85 * 60000).toISOString()
    }
];

// Demo detailed session for individual view
const createDemoDetailedSession = (sessionId: number): StudentExamSessionResponse => {
    const baseSession = DEMO_SESSIONS.find(s => s.id === sessionId) || DEMO_SESSIONS[0];

    const questions: SessionExamQuestionResponse[] = [
        {
            id: 301,
            questionRus: "Решите уравнение: 2x + 5 = 15",
            questionKaz: "Теңдеуді шешіңіз: 2x + 5 = 15",
            options: [
                { id: 401, nameRus: "x = 5", nameKaz: "x = 5" },
                { id: 402, nameRus: "x = 10", nameKaz: "x = 10" },
                { id: 403, nameRus: "x = 7", nameKaz: "x = 7" },
                { id: 404, nameRus: "x = 8", nameKaz: "x = 8" }
            ]
        },
        {
            id: 302,
            questionRus: "Найдите производную функции f(x) = x²",
            questionKaz: "Функцияның туындысын табыңыз f(x) = x²",
            options: [
                { id: 405, nameRus: "f'(x) = x", nameKaz: "f'(x) = x" },
                { id: 406, nameRus: "f'(x) = 2x", nameKaz: "f'(x) = 2x" },
                { id: 407, nameRus: "f'(x) = 2", nameKaz: "f'(x) = 2" },
                { id: 408, nameRus: "f'(x) = x²", nameKaz: "f'(x) = x²" }
            ]
        }
    ];

    const studentAnswers: StudentAnswerResponse[] = [
        { id: 501, questionId: 301, selectedOptionId: 401 },
        { id: 502, questionId: 302, selectedOptionId: 406 }
    ];

    return {
        id: baseSession.id,
        examData: {
            ...baseSession.examData,
            questions: questions,
            studentAnswer: studentAnswers,
            startTime: baseSession.startTime,
            durationInMinutes: baseSession.examData.durationInMinutes
        },
        startTime: baseSession.startTime,
        endTime: baseSession.endTime
    };
};

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
    if (DEMO_MODE) {
        await simulateDelay();
        const newSession: StudentExamSessionResponse = {
            id: Math.floor(Math.random() * 1000) + 500,
            examData: {
                id: request.examTestId,
                nameRus: "Новая сессия",
                nameKaz: "Жаңа сессия",
                typeRus: "Текущий тест",
                typeKaz: "Ағымдағы тест",
                questions: [
                    {
                        id: 601,
                        questionRus: "Какой элемент имеет атомный номер 1?",
                        questionKaz: "Атомдық нөмірі 1 болатын элемент?",
                        options: [
                            { id: 701, nameRus: "Водород", nameKaz: "Сутегі" },
                            { id: 702, nameRus: "Гелий", nameKaz: "Гелий" },
                            { id: 703, nameRus: "Литий", nameKaz: "Литий" },
                            { id: 704, nameRus: "Бериллий", nameKaz: "Бериллий" }
                        ]
                    },
                    {
                        id: 602,
                        questionRus: "Что такое H₂O?",
                        questionKaz: "H₂O дегеніміз не?",
                        options: [
                            { id: 705, nameRus: "Углекислый газ", nameKaz: "Көмірқышқыл газы" },
                            { id: 706, nameRus: "Кислород", nameKaz: "Оттегі" },
                            { id: 707, nameRus: "Вода", nameKaz: "Су" },
                            { id: 708, nameRus: "Метан", nameKaz: "Метан" }
                        ]
                    }
                ],
                studentAnswer: [],
                startTime: new Date().toISOString(),
                durationInMinutes: 60
            },
            startTime: new Date().toISOString(),
            endTime: ""
        };
        return newSession;
    }

    try {
        const response = await api.post<StudentExamSessionResponse>('/start', request);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to start exam session');
    }
};

// End an exam session
export const endExamSession = async (examSessionId: number): Promise<StudentExamSessionResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();
        const session = createDemoDetailedSession(examSessionId);
        session.endTime = new Date().toISOString();
        return session;
    }

    try {
        const response = await api.post<StudentExamSessionResponse>(`/end/${examSessionId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to end exam session');
    }
};

// Get a specific exam session
export const getExamSession = async (examSessionId: number): Promise<StudentExamSessionResponse> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return createDemoDetailedSession(examSessionId);
    }

    try {
        const response = await api.post<StudentExamSessionResponse>(`/student/${examSessionId}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to retrieve exam session');
    }
};

// Get all sessions for the authenticated student
export const getStudentExamSessions = async (): Promise<StudentExamSessionResponses[]> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return DEMO_SESSIONS;
    }

    try {
        const response = await api.get<StudentExamSessionResponses[]>('/student');
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to retrieve exam sessions');
    }
};

// Update an answer during an active exam
export const updateAnswer = async (request: UpdateAnswerRequest): Promise<string> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return "Answer updated successfully";
    }

    try {
        const response = await api.post<string>('/answer/update', request);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update answer');
    }
};

// Delete an answer during an active exam
export const deleteAnswer = async (request: UpdateAnswerRequest): Promise<string> => {
    if (DEMO_MODE) {
        await simulateDelay();
        return "Answer deleted successfully";
    }

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