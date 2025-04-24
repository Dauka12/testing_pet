import { AssignmentTurnedInOutlined, QuizOutlined, TimerOutlined } from '@mui/icons-material';
import { Box, Chip, Divider, Grid, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { formatDate } from '../../utils/dateUtils';

const ResultsCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(4, 5),
    marginBottom: theme.spacing(3),
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
}));

const SummaryBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4, 2),
    borderRadius: 16,
    backgroundColor: 'rgba(26, 39, 81, 0.03)',
}));

const StatsItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '&:last-child': {
        marginBottom: 0
    }
}));

interface ResultSummaryProps {
    session: any;
    totalQuestions: number;
    answeredCount: number;
    completionPercentage: number;
    animate?: boolean;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ 
    session, 
    totalQuestions, 
    answeredCount, 
    completionPercentage,
    animate = true 
}) => {
    return (
        <ResultsCard
            initial={animate ? { opacity: 0, y: 20 } : undefined}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={animate ? { duration: 0.5, delay: 0.2 } : undefined}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4" fontWeight="bold">
                            Результаты теста
                        </Typography>
                        <Chip
                            icon={<AssignmentTurnedInOutlined />}
                            label="Завершен"
                            color="success"
                            variant="outlined"
                            sx={{ borderRadius: 3, p: 0.5 }}
                        />
                    </Box>
                    <Typography variant="h5" color="primary" gutterBottom>
                        {session.examData.nameRus}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                </Grid>

                <Grid item xs={12} md={8}>
                    <Box mb={4}>
                        <StatsItem>
                            <TimerOutlined sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Время начала
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(session.startTime)}
                                </Typography>
                            </Box>
                        </StatsItem>

                        <StatsItem>
                            <TimerOutlined sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Время завершения
                                </Typography>
                                <Typography variant="body1">
                                    {formatDate(session.endTime)}
                                </Typography>
                            </Box>
                        </StatsItem>

                        <StatsItem>
                            <QuizOutlined sx={{ mr: 1.5, color: 'text.secondary' }} />
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Отвечено вопросов
                                </Typography>
                                <Typography variant="body1">
                                    {answeredCount} из {totalQuestions} ({completionPercentage}%)
                                </Typography>
                            </Box>
                        </StatsItem>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <SummaryBox>
                        <Typography variant="h2" color="primary" fontWeight="bold">
                            {answeredCount}/{totalQuestions}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Отвеченные вопросы
                        </Typography>
                    </SummaryBox>
                </Grid>
            </Grid>
        </ResultsCard>
    );
};

export default ResultSummary;
