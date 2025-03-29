import { useCallback } from 'react';
import {
    clearAnswerError,
    clearCurrentSession,
    clearTestSessionError,
    deleteAnswerThunk,
    endExamSessionThunk,
    getExamSessionThunk,
    getStudentExamSessionsThunk,
    startExamSessionThunk,
    updateAnswerThunk
} from '../store/slices/testSessionSlice.ts';
import { StudentExamSessionRequest, UpdateAnswerRequest } from '../types/testSession.ts';
import { useOlympiadDispatch, useOlympiadSelector } from './useOlympiadStore.ts';

const useTestSessionManager = () => {
    const dispatch = useOlympiadDispatch();
    const {
        currentSession,
        sessions,
        loading,
        error,
        answerUpdating,
        answerError
    } = useOlympiadSelector(state => state.testSession);

    // Start a new exam session
    const startExamSession = useCallback((examTestId: number) => {
        const request: StudentExamSessionRequest = { examTestId };
        return dispatch(startExamSessionThunk(request));
    }, [dispatch]);

    // End the current exam session
    const endExamSession = useCallback((sessionId: number) => {
        return dispatch(endExamSessionThunk(sessionId));
    }, [dispatch]);

    // Get a specific exam session
    const getExamSession = useCallback((sessionId: number) => {
        return dispatch(getExamSessionThunk(sessionId));
    }, [dispatch]);

    // Get all sessions for the current student
    const getStudentSessions = useCallback(() => {
        return dispatch(getStudentExamSessionsThunk());
    }, [dispatch]);

    // Update an answer during an active exam
    const updateAnswer = useCallback((sessionId: number, questionId: number, selectedOptionId: number) => {
        const request: UpdateAnswerRequest = {
            studentExamSessionId: sessionId,
            questionId,
            selectedOptionId
        };
        return dispatch(updateAnswerThunk(request));
    }, [dispatch]);

    // Delete an answer during an active exam
    const deleteAnswer = useCallback((sessionId: number, questionId: number, selectedOptionId: number = 0) => {
        const request: UpdateAnswerRequest = {
            studentExamSessionId: sessionId,
            questionId,
            selectedOptionId
        };
        return dispatch(deleteAnswerThunk(request));
    }, [dispatch]);

    // Clear the current session from state
    const clearSession = useCallback(() => {
        dispatch(clearCurrentSession());
    }, [dispatch]);

    // Clear errors
    const clearErrors = useCallback(() => {
        dispatch(clearTestSessionError());
        dispatch(clearAnswerError());
    }, [dispatch]);

    // Calculate if the exam is still active
    const isExamActive = useCallback(() => {
        if (!currentSession) return false;

        const endTimeDate = new Date(currentSession.endTime);
        const now = new Date();

        return !currentSession.endTime || endTimeDate > now;
    }, [currentSession]);

    // Calculate remaining time in seconds
    const getRemainingTime = useCallback(() => {
        if (!currentSession || !currentSession.endTime) return 0;

        const endTimeDate = new Date(currentSession.endTime);
        const now = new Date();

        const remainingMs = endTimeDate.getTime() - now.getTime();
        return Math.max(0, Math.floor(remainingMs / 1000)); // in seconds
    }, [currentSession]);

    return {
        // State
        currentSession,
        sessions,
        loading,
        error,
        answerUpdating,
        answerError,

        // Actions
        startExamSession,
        endExamSession,
        getExamSession,
        getStudentSessions,
        updateAnswer,
        deleteAnswer,
        clearSession,
        clearErrors,

        // Helper functions
        isExamActive,
        getRemainingTime
    };
};

export default useTestSessionManager;