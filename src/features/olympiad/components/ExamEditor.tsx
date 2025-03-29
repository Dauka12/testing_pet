import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addExam, updateExam } from '../store/slices/examSlice.ts';
import { ExamTest } from '../types/exam.ts';

interface ExamEditorProps {
    exam?: ExamTest;
    onClose: () => void;
}

const ExamEditor: React.FC<ExamEditorProps> = ({ exam, onClose }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(exam ? exam.title : '');
    const [description, setDescription] = useState(exam ? exam.description : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (exam) {
            dispatch(updateExam({ ...exam, title, description }));
        } else {
            dispatch(addExam({ title, description }));
        }
        onClose();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
            <Typography variant="h6">{exam ? 'Edit Exam' : 'Create Exam'}</Typography>
            <TextField
                label="Exam Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
                {exam ? 'Update Exam' : 'Create Exam'}
            </Button>
        </Box>
    );
};

export default ExamEditor;