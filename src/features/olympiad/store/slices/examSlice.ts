import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    createExam,
    createQuestion as createQuestionApi,
    deleteExam as deleteExamApi,
    deleteQuestion as deleteQuestionApi,
    getAllExams,
    getExamById,
    updateQuestion as updateQuestionApi
} from '../../api/examApi.ts';
import { ExamCreateRequest, ExamQuestionRequest, ExamQuestionResponse, ExamResponse, ExamState } from '../../types/exam.ts';

// Initial state
const initialState: ExamState = {
    exams: [],
    currentExam: null,
    currentQuestion: null,
    loading: false,
    error: null
};

// Async thunk actions
export const fetchAllExams = createAsyncThunk(
    'olympiadExam/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getAllExams();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch exams');
        }
    }
);

export const fetchExamById = createAsyncThunk(
    'olympiadExam/fetchById',
    async (id: number, { rejectWithValue }) => {
        try {
            return await getExamById(id);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to fetch exam');
        }
    }
);

export const createExamThunk = createAsyncThunk(
    'olympiadExam/create',
    async (examData: ExamCreateRequest, { rejectWithValue }) => {
        try {
            return await createExam(examData);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to create exam');
        }
    }
);

export const deleteExamThunk = createAsyncThunk(
    'olympiadExam/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteExamApi(id);
            return id;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to delete exam');
        }
    }
);

export const createQuestionThunk = createAsyncThunk(
    'olympiadExam/createQuestion',
    async ({ questionData, testId }: { questionData: ExamQuestionRequest, testId: number }, { rejectWithValue }) => {
        try {
            return await createQuestionApi(questionData, testId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to create question');
        }
    }
);

export const updateQuestionThunk = createAsyncThunk(
    'olympiadExam/updateQuestion',
    async ({ questionData, id }: { questionData: ExamQuestionRequest, id: number }, { rejectWithValue }) => {
        try {
            await updateQuestionApi(questionData, id);
            return { ...questionData, id } as ExamQuestionResponse;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to update question');
        }
    }
);

export const deleteQuestionThunk = createAsyncThunk(
    'olympiadExam/deleteQuestion',
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteQuestionApi(id);
            return id;
        } catch (error: unknown) {
            
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to delete question');
        }
    }
);

// Slice
const examSlice = createSlice({
    name: 'olympiadExam',
    initialState,
    reducers: {
        setCurrentExam: (state, action: PayloadAction<ExamResponse | null>) => {
            state.currentExam = action.payload;
        },
        setCurrentQuestion: (state, action: PayloadAction<ExamQuestionResponse | null>) => {
            state.currentQuestion = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all exams
            .addCase(fetchAllExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllExams.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = action.payload;
            })
            .addCase(fetchAllExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch exam by id
            .addCase(fetchExamById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExamById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExam = action.payload;
            })
            .addCase(fetchExamById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create exam
            .addCase(createExamThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createExamThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = [...state.exams, action.payload];
            })
            .addCase(createExamThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete exam
            .addCase(deleteExamThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExamThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.exams = state.exams.filter(exam => exam.id !== action.payload);
                if (state.currentExam && state.currentExam.id === action.payload) {
                    state.currentExam = null;
                }
            })
            .addCase(deleteExamThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create question
            .addCase(createQuestionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQuestionThunk.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentExam) {
                    state.currentExam = {
                        ...state.currentExam,
                        questions: [...(state.currentExam.questions || []), action.payload]
                    };
                }
            })
            .addCase(createQuestionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update question
            .addCase(updateQuestionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateQuestionThunk.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentExam && state.currentExam.questions) {
                    state.currentExam = {
                        ...state.currentExam,
                        questions: state.currentExam.questions.map(q =>
                            q.id === action.payload.id ? { ...q, ...action.payload } : q
                        )
                    };
                }
            })
            .addCase(updateQuestionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete question
            .addCase(deleteQuestionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteQuestionThunk.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentExam && state.currentExam.questions) {
                    state.currentExam = {
                        ...state.currentExam,
                        questions: state.currentExam.questions.filter(q => q.id !== action.payload)
                    };
                }
            })
            .addCase(deleteQuestionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setCurrentExam, setCurrentQuestion, clearError } = examSlice.actions;
export default examSlice.reducer;