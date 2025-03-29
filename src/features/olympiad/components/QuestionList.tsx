import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteQuestion } from '../store/slices/examSlice';
import { Question } from '../types/exam';

interface QuestionListProps {
    examId: string;
    onEdit: (question: Question) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ examId, onEdit }) => {
    const dispatch = useDispatch();
    const questions = useSelector((state: RootState) => state.exam.questions[examId] || []);

    const handleDelete = (questionId: string) => {
        dispatch(deleteQuestion({ examId, questionId }));
    };

    return (
        <div>
            <Typography variant="h6">Questions</Typography>
            <List>
                {questions.map((question) => (
                    <ListItem key={question.id}>
                        <ListItemText primary={question.text} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => onEdit(question)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(question.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default QuestionList;