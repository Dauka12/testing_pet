import { OptionResponse } from './exam';

export interface StudentExamSessionRequest {
    examTestId: number;
}

export interface UpdateAnswerRequest {
    studentExamSessionId: number;
    questionId: number;
    selectedOptionId: number;
}

export interface StudentAnswerResponse {
    id: number;
    questionId: number;
    selectedOptionId: number;
    isCorrect?: boolean; // Added field to indicate if answer is correct
}

export interface SessionExamQuestionResponse {
    id: number;
    questionRus: string;
    questionKaz: string;
    options: OptionResponse[];
    correctOptionId: number; // Added field for correct answer
}

export interface SessionExamResponse {
    id: number;
    nameRus: string;
    nameKaz: string;
    typeRus: string;
    typeKaz: string;
    questions: SessionExamQuestionResponse[];
    studentAnswer: StudentAnswerResponse[];
    startTime: string;
    durationInMinutes: number;
}

export interface SessionExamResponses {
    id: number;
    nameRus: string;
    nameKaz: string;
    typeRus: string;
    typeKaz: string;
    startTime: string;
    durationInMinutes: number;
}

export interface StudentExamSessionResponse {
    id: number;
    examData: SessionExamResponse;
    startTime: string;
    endTime: string;
}

export interface StudentExamSessionResponses {
    id: number;
    examData: SessionExamResponses;
    startTime: string;
    endTime: string;
}

export interface TestSessionState {
    currentSession: StudentExamSessionResponse | null;
    sessions: StudentExamSessionResponses[];
    loading: boolean;
    error: string | null;
    answerUpdating: boolean;
    answerError: string | null;
}