import { CheckCircleOutlined, ErrorOutlined } from '@mui/icons-material';
import { Box, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const QuestionCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
}));

interface QuestionResultCardProps {
    question: any;
    selectedOptionId: number | null;
    hasAnswer: boolean;
    index: number;
    delay?: number;
}

const QuestionResultCard: React.FC<QuestionResultCardProps> = ({ 
    question, 
    selectedOptionId, 
    hasAnswer, 
    index, 
    delay = 0
}) => {
    const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
    
    return (
        <QuestionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: delay }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="500" gutterBottom>
                        Вопрос {index + 1}: {question.questionRus}
                    </Typography>

                    {hasAnswer ? (
                        <Box mt={1.5}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Ваш ответ:
                            </Typography>
                            <Typography variant="body1" fontWeight="500">
                                {selectedOption?.nameRus || 'Не найден вариант ответа'}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" mt={1.5}>
                            Вы не ответили на этот вопрос
                        </Typography>
                    )}
                </Box>

                <Box ml={2}>
                    {hasAnswer ? (
                        <CheckCircleOutlined color="success" fontSize="large" />
                    ) : (
                        <ErrorOutlined color="error" fontSize="large" />
                    )}
                </Box>
            </Box>
        </QuestionCard>
    );
};

export default QuestionResultCard;
