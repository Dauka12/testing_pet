import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
    Box,
    Button,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { ExamQuestionResponse } from '../../../types/exam.ts';

interface AIComparisonViewProps {
    originalQuestion: ExamQuestionResponse;
    enhancedQuestion: ExamQuestionResponse;
    onAccept: () => void;
    onCancel: () => void;
}

const AIComparisonView: React.FC<AIComparisonViewProps> = ({
    originalQuestion,
    enhancedQuestion,
    onAccept,
    onCancel
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 2,
                    p: 1,
                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                    borderRadius: 1,
                }}>
                    <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                        Результат улучшения с помощью ИИ
                    </Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                    Вопрос:
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">Было:</Typography>
                        <Paper 
                            variant="outlined" 
                            sx={{ p: 2, bgcolor: '#f5f5f5', height: '100%', minHeight: 100 }}
                        >
                            <Typography>{originalQuestion.questionRus}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">Стало:</Typography>
                        <Paper 
                            variant="outlined" 
                            sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.08)', height: '100%', minHeight: 100 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Typography>{enhancedQuestion.questionRus}</Typography>
                            </motion.div>
                        </Paper>
                    </Grid>
                </Grid>
                
                <Typography variant="subtitle2" gutterBottom>
                    Варианты ответов:
                </Typography>
                
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <List dense>
                            {originalQuestion.options.map((option, i) => (
                                <ListItem key={i} sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: option.id === originalQuestion.correctOptionId ? 'rgba(76, 175, 80, 0.08)' : 'transparent'
                                }}>
                                    <Radio
                                        checked={option.id === originalQuestion.correctOptionId}
                                        disabled
                                        size="small"
                                    />
                                    <ListItemText 
                                        primary={option.nameRus}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <List dense>
                            {enhancedQuestion.options.map((option, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 * (i + 1) }}
                                >
                                    <ListItem sx={{
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        mb: 1,
                                        bgcolor: option.id === enhancedQuestion.correctOptionId ? 'rgba(76, 175, 80, 0.08)' : 'transparent'
                                    }}>
                                        <Radio
                                            checked={option.id === enhancedQuestion.correctOptionId}
                                            disabled
                                            size="small"
                                        />
                                        <ListItemText 
                                            primary={option.nameRus}
                                        />
                                    </ListItem>
                                </motion.div>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button 
                        variant="outlined" 
                        color="inherit" 
                        onClick={onCancel}
                        sx={{ mr: 2 }}
                    >
                        Отменить изменения
                    </Button>
                    
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={onAccept}
                    >
                        Принять изменения ИИ
                    </Button>
                </Box>
            </Paper>
        </motion.div>
    );
};

export default AIComparisonView;
