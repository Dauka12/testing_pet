import { useCallback } from 'react';
import {
    clearAnswerError,
    clearCurrentSession,
    clearTestSessionError,
    deleteAnswerThunk,
    endExamSessionThunk,
    getExamSessionThunk,
    getStudentExamSessionsThunk,
    getTeacherExamSessionsThunk, // Add new thunk import
    startExamSessionThunk,
    updateAnswerThunk
} from '../store/slices/testSessionSlice.ts';
import { UpdateAnswerRequest } from '../types/testSession.ts';
import { useAppDispatch } from './hooks.ts';
import { useOlympiadSelector } from './useOlympiadStore.ts';

const useTestSessionManager = () => {
    const dispatch = useAppDispatch();
    const {
        currentSession,
        sessions,
        loading,
        error,
        answerUpdating,
        answerError
    } = useOlympiadSelector(state => state.testSession);
    
    const { user } = useOlympiadSelector(state => state.auth);
    
    // Check if user is a teacher with the new role structure
    const isTeacher = user?.role && 
        Array.isArray(user.role) && 
        user.role.some(role => 
            ['teacher', 'TEACHER', 'Teacher'].includes(role.name)
        );
    
    // Start a new exam session
    const startExamSession = useCallback(async (examId: number) => {
        return await dispatch(startExamSessionThunk({ examTestId: examId }));
    }, [dispatch]);

    // End the current exam session
    const endExamSession = useCallback(async (sessionId: number) => {
        return await dispatch(endExamSessionThunk(sessionId));
    }, [dispatch]);

    // Get a specific exam session
    const getExamSession = useCallback((sessionId: number) => {
        return dispatch(getExamSessionThunk(sessionId));
    }, [dispatch]);

    // Get all sessions - automatically chooses the correct endpoint based on user role
    const getStudentSessions = useCallback(() => {
        if (isTeacher) {
            return dispatch(getTeacherExamSessionsThunk());
        }
        return dispatch(getStudentExamSessionsThunk());
    }, [dispatch, isTeacher]);

    // Update an answer during an active exam
    const updateAnswer = useCallback(async (sessionId: number, questionId: number, optionId: number) => {
        return await dispatch(updateAnswerThunk({
            studentExamSessionId: sessionId,
            questionId,
            selectedOptionId: optionId
        }));
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
        isTeacher,  // Add isTeacher flag to the returned object

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