// Types for API requests and responses
export interface Option {
    id?: number;
    nameRus: string;
    nameKaz: string;
}

export interface OptionRequest {
    nameRus: string;
    nameKaz: string;
}

export interface OptionResponse {
    id: number;
    nameRus: string;
    nameKaz: string;
}

export interface ExamQuestion {
    id?: number;
    questionRus: string;
    questionKaz: string;
    options: Option[];
    correctOptionId: number;
    testId?: number;
}

export interface ExamQuestionRequest {
    questionRus: string;
    questionKaz: string;
    options: OptionRequest[];
    correctOptionId: number;
}

export interface ExamQuestionResponse {
    id: number;
    questionRus: string;
    questionKaz: string;
    options: OptionResponse[];
    correctOptionId: number;
}

export interface ExamTest {
    id?: number;
    nameRus: string;
    nameKaz: string;
    typeRus: string;
    typeKaz: string;
    startTime?: string;
    durationInMinutes: number; // Add this field
    questions?: ExamQuestion[];
}

export interface ExamCreateRequest {
    nameRus: string;
    nameKaz: string;
    typeRus: string;
    typeKaz: string;
    startTime?: string;
    durationInMinutes: number;
    questions?: ExamQuestionRequest[];
    categories: number[]; // Added this field for multiple categories
}

export interface ExamResponse {
    id: number;
    nameRus: string;
    nameKaz: string;
    typeRus: string;
    typeKaz: string;
    startTime?: string;
    durationInMinutes: number; // Add this field
    questions?: ExamQuestionResponse[];
}

// Redux state types
export interface ExamState {
    exams: ExamResponse[];
    currentExam: ExamResponse | null;
    currentQuestion: ExamQuestionResponse | null;
    loading: boolean;
    error: string | null;
}