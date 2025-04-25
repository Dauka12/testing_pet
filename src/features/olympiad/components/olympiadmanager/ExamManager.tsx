import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { fetchExamById } from '../../store/slices/examSlice.ts';
import { ExamQuestionResponse } from '../../types/exam.ts';
import ExamViewer from './ExamViewer';
import QuestionForm from './QuestionForm';

const ExamManager = ({ examId }) => {
    const dispatch = useAppDispatch();
    const { currentExam } = useAppSelector(state => state.exam);
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestionResponse | null>(null);

    useEffect(() => {
        dispatch(fetchExamById(examId));
    }, [dispatch, examId]);

    // Find selected question when ID changes
    useEffect(() => {
        if (selectedQuestionId && currentExam?.questions) {
            const question = currentExam.questions.find(q => q.id === selectedQuestionId);
            setSelectedQuestion(question || null);
        } else {
            setSelectedQuestion(null);
        }
    }, [selectedQuestionId, currentExam]);

    const handleEditQuestion = (questionId: number) => {
        setSelectedQuestionId(questionId);
        setIsEditingQuestion(true);
    };

    const handleQuestionSaved = () => {
        // Refresh the exam data
        dispatch(fetchExamById(examId));
        setIsEditingQuestion(false);
        setSelectedQuestionId(null);
    };

    if (!currentExam) return <div>Loading...</div>;

    return (
        <div>
            {isEditingQuestion ? (
                <QuestionForm 
                    testId={examId}
                    question={selectedQuestion || undefined}
                    onSuccess={handleQuestionSaved}
                />
            ) : (
                <ExamViewer
                    exam={currentExam}
                    onEditQuestion={handleEditQuestion}
                />
            )}
        </div>
    );
};

export default ExamManager;
