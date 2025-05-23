import {
    Box,
    Button,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    Typography
} from '@mui/material';
import React from 'react';
import { ExamQuestionResponse } from '../../../types/exam.ts';

interface QuestionViewerProps {
    question: ExamQuestionResponse;
    onClose: () => void;
    onEdit: (question: ExamQuestionResponse) => void;
}

const QuestionViewer: React.FC<QuestionViewerProps> = ({ question, onClose, onEdit }) => {
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Сұрақты қарау
                </Typography>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={onClose}
                >
                    Жабу
                </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Сұрақ (Қаз):</Typography>
                    <Typography paragraph>{question.questionKaz}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1">Сұрақ (Орыс):</Typography>
                    <Typography paragraph>{question.questionRus}</Typography>
                </Grid>
            </Grid>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Жауап нұсқалары:</Typography>
            <List>
                {question.options.map((option) => (
                    <ListItem
                        key={option.id}
                        sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            mb: 1,
                            bgcolor: option.id === question.correctOptionId ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
                        }}
                    >
                        <Radio
                            checked={option.id === question.correctOptionId}
                            disabled
                            size="small"
                        />
                        <ListItemText
                            primary={(
                                <Box>
                                    <Typography component="span" fontWeight={option.id === question.correctOptionId ? 'bold' : 'normal'}>
                                        {option.nameKaz}
                                    </Typography>
                                    {option.id === question.correctOptionId && (
                                        <Typography component="span" color="success.main" sx={{ ml: 1 }}>
                                            (дұрыс жауап)
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            secondary={option.nameRus}
                        />
                    </ListItem>
                ))}
            </List>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => onEdit(question)}
                >
                    Бұл сұрақты өңдеу
                </Button>
            </Box>
        </Paper>
    );
};

export default QuestionViewer;
