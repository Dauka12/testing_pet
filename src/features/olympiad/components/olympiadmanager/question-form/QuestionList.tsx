import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Tooltip,
    Typography
} from '@mui/material';
import React from 'react';
import { ExamQuestionResponse } from '../../../types/exam.ts';

interface QuestionListProps {
    questions: ExamQuestionResponse[];
    editingQuestionId?: number;
    onView: (question: ExamQuestionResponse) => void;
    onEdit: (question: ExamQuestionResponse) => void;
    onDelete: (questionId: number) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ 
    questions, 
    editingQuestionId, 
    onView, 
    onEdit, 
    onDelete 
}) => {
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
                Вопросы экзамена ({questions.length})
            </Typography>
            <List>
                {questions.map((q) => (
                    <ListItem
                        key={q.id}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: editingQuestionId === q.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                        }}
                    >
                        <ListItemText
                            primary={q.questionRus}
                            secondary={`${q.options.length} вариантов ответа`}
                        />
                        <ListItemSecondaryAction>
                            <Tooltip title="Просмотреть">
                                <IconButton edge="end" onClick={() => onView(q)}>
                                    <VisibilityIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Редактировать">
                                <IconButton edge="end" onClick={() => onEdit(q)}>
                                    <EditIcon color="secondary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Удалить">
                                <IconButton edge="end" onClick={() => onDelete(q.id)}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default QuestionList;
