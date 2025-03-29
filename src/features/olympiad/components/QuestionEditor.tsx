import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { default as addQuestion, default as updateQuestion } from '../store/slices/examSlice.ts';
import { ExamQuestion } from '../types/exam.ts';

interface QuestionEditorProps {
    question?: ExamQuestion;
    examId: string;
    onClose: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, examId, onClose }) => {
    const dispatch = useDispatch();
    const [questionText, setQuestionText] = useState(question ? question.text : '');
    const [questionId] = useState(question ? question.id : undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (questionId) {
            dispatch(updateQuestion({ id: questionId, text: questionText, examId }));
        } else {
            dispatch(addQuestion({ text: questionText, examId }));
        }
        onClose();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6">{question ? 'Edit Question' : 'Add Question'}</Typography>
            <TextField
                label="Question Text"
                variant="outlined"
                fullWidth
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                required
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
                {question ? 'Update Question' : 'Add Question'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose} sx={{ ml: 2 }}>
                Cancel
            </Button>
        </Box>
    );
};

export default QuestionEditor;