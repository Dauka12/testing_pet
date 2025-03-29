import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import {
    createExamThunk,
    createQuestionThunk,
    deleteExamThunk,
    deleteQuestionThunk,
    fetchAllExams as fetchAllExamsAction,
    fetchExamById,
    setCurrentExam,
    updateQuestionThunk
} from '../store/slices/examSlice.ts';
import { ExamCreateRequest, ExamQuestionRequest } from '../types/exam.ts';

const useExamManager = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { exams, currentExam, loading, error } = useSelector((state: RootState) => state.exam);

    // Add the fetchAllExams function
    const fetchAllExams = useCallback(() => {
        return dispatch(fetchAllExamsAction());
    }, [dispatch]);

    const createExam = useCallback((examData: ExamCreateRequest) => {
        return dispatch(createExamThunk(examData));
    }, [dispatch]);

    const removeExam = useCallback((examId: number) => {
        return dispatch(deleteExamThunk(examId));
    }, [dispatch]);

    const selectExam = useCallback((examId: number) => {
        return dispatch(fetchExamById(examId));
    }, [dispatch]);

    const clearSelectedExam = useCallback(() => {
        dispatch(setCurrentExam(null));
    }, [dispatch]);

    const createQuestion = useCallback((questionData: ExamQuestionRequest, testId: number) => {
        return dispatch(createQuestionThunk({ questionData, testId }));
    }, [dispatch]);

    const updateQuestion = useCallback((questionData: ExamQuestionRequest, id: number) => {
        return dispatch(updateQuestionThunk({ questionData, id }));
    }, [dispatch]);

    const removeQuestion = useCallback((questionId: number) => {
        return dispatch(deleteQuestionThunk(questionId));
    }, [dispatch]);

    return {
        exams,
        currentExam,
        loading,
        error,
        fetchAllExams,
        createExam,
        removeExam,
        selectExam,
        clearSelectedExam,
        createQuestion,
        updateQuestion,
        removeQuestion,
    };
};

export default useExamManager;