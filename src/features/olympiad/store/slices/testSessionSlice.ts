import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    deleteAnswer as deleteAnswerApi,
    endExamSession as endExamSessionApi,
    getExamSession as getExamSessionApi,
    getStudentExamSessions as getStudentExamSessionsApi,
    startExamSession as startExamSessionApi,
    updateAnswer as updateAnswerApi
} from '../../api/testSessionApi.ts';
import {
    StudentExamSessionRequest,
    StudentExamSessionResponse,
    TestSessionState,
    UpdateAnswerRequest
} from '../../types/testSession.ts';

// Initial state
const initialState: TestSessionState = {
    currentSession: null,
    sessions: [],
    loading: false,
    error: null,
    answerUpdating: false,
    answerError: null
};

// Async thunk actions
export const startExamSessionThunk = createAsyncThunk(
    'olympiadTestSession/start',
    async (request: StudentExamSessionRequest, { rejectWithValue }) => {
        try {
            return await startExamSessionApi(request);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to start exam session');
        }
    }
);

export const endExamSessionThunk = createAsyncThunk(
    'olympiadTestSession/end',
    async (examSessionId: number, { rejectWithValue }) => {
        try {
            return await endExamSessionApi(examSessionId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to end exam session');
        }
    }
);

export const getExamSessionThunk = createAsyncThunk(
    'olympiadTestSession/getById',
    async (examSessionId: number, { rejectWithValue }) => {
        try {
            return await getExamSessionApi(examSessionId);
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to retrieve exam session');
        }
    }
);

export const getStudentExamSessionsThunk = createAsyncThunk(
    'olympiadTestSession/getAll',
    async (_, { rejectWithValue }) => {
        try {
            return await getStudentExamSessionsApi();
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to retrieve exam sessions');
        }
    }
);

export const updateAnswerThunk = createAsyncThunk(
    'olympiadTestSession/updateAnswer',
    async (request: UpdateAnswerRequest, { rejectWithValue }) => {
        try {
            await updateAnswerApi(request);
            return request; // Return the request data for state updates
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to update answer');
        }
    }
);

export const deleteAnswerThunk = createAsyncThunk(
    'olympiadTestSession/deleteAnswer',
    async (request: UpdateAnswerRequest, { rejectWithValue }) => {
        try {
            await deleteAnswerApi(request);
            return request; // Return the request data for state updates
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('Failed to delete answer');
        }
    }
);

// Slice
const testSessionSlice = createSlice({
    name: 'olympiadTestSession',
    initialState,
    reducers: {
        clearCurrentSession: (state) => {
            state.currentSession = null;
        },
        clearTestSessionError: (state) => {
            state.error = null;
        },
        clearAnswerError: (state) => {
            state.answerError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Start exam session
            .addCase(startExamSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startExamSessionThunk.fulfilled, (state, action: PayloadAction<StudentExamSessionResponse>) => {
                state.loading = false;
                state.currentSession = action.payload;
                // Also add to sessions list if it's not already there
                const sessionExists = state.sessions.some(session => session.id === action.payload.id);
                if (!sessionExists) {
                    state.sessions.push({
                        id: action.payload.id,
                        examData: {
                            id: action.payload.examData.id,
                            nameRus: action.payload.examData.nameRus,
                            nameKaz: action.payload.examData.nameKaz,
                            typeRus: action.payload.examData.typeRus,
                            typeKaz: action.payload.examData.typeKaz,
                            startTime: action.payload.examData.startTime,
                            durationInMinutes: action.payload.examData.durationInMinutes
                        },
                        startTime: action.payload.startTime,
                        endTime: action.payload.endTime
                    });
                }
            })
            .addCase(startExamSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // End exam session
            .addCase(endExamSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(endExamSessionThunk.fulfilled, (state, action: PayloadAction<StudentExamSessionResponse>) => {
                state.loading = false;
                state.currentSession = action.payload;
                // Update in sessions list
                state.sessions = state.sessions.map(session =>
                    session.id === action.payload.id
                        ? {
                            ...session,
                            endTime: action.payload.endTime
                        }
                        : session
                );
            })
            .addCase(endExamSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get exam session
            .addCase(getExamSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getExamSessionThunk.fulfilled, (state, action: PayloadAction<StudentExamSessionResponse>) => {
                state.loading = false;
                state.currentSession = action.payload;
            })
            .addCase(getExamSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Get all student exam sessions
            .addCase(getStudentExamSessionsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStudentExamSessionsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload;
            })
            .addCase(getStudentExamSessionsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update answer
            .addCase(updateAnswerThunk.pending, (state) => {
                state.answerUpdating = true;
                state.answerError = null;
            })
            .addCase(updateAnswerThunk.fulfilled, (state, action: PayloadAction<UpdateAnswerRequest>) => {
                state.answerUpdating = false;

                // Update the current session state if we have the active session
                if (state.currentSession && state.currentSession.id === action.payload.studentExamSessionId) {
                    // Find if the answer already exists
                    const existingAnswerIndex = state.currentSession.examData.studentAnswer.findIndex(
                        answer => answer.questionId === action.payload.questionId
                    );

                    if (existingAnswerIndex !== -1) {
                        // Update existing answer
                        state.currentSession.examData.studentAnswer[existingAnswerIndex].selectedOptionId =
                            action.payload.selectedOptionId;
                    } else {
                        // Add new answer
                        state.currentSession.examData.studentAnswer.push({
                            id: Date.now(), // Temporary ID until refresh
                            questionId: action.payload.questionId,
                            selectedOptionId: action.payload.selectedOptionId
                        });
                    }
                }
            })
            .addCase(updateAnswerThunk.rejected, (state, action) => {
                state.answerUpdating = false;
                state.answerError = action.payload as string;
            })

            // Delete answer
            .addCase(deleteAnswerThunk.pending, (state) => {
                state.answerUpdating = true;
                state.answerError = null;
            })
            .addCase(deleteAnswerThunk.fulfilled, (state, action: PayloadAction<UpdateAnswerRequest>) => {
                state.answerUpdating = false;

                // Update the current session state if we have the active session
                if (state.currentSession && state.currentSession.id === action.payload.studentExamSessionId) {
                    state.currentSession.examData.studentAnswer =
                        state.currentSession.examData.studentAnswer.filter(
                            answer => answer.questionId !== action.payload.questionId
                        );
                }
            })
            .addCase(deleteAnswerThunk.rejected, (state, action) => {
                state.answerUpdating = false;
                state.answerError = action.payload as string;
            });
    }
});

export const { clearCurrentSession, clearTestSessionError, clearAnswerError } = testSessionSlice.actions;
export default testSessionSlice.reducer;