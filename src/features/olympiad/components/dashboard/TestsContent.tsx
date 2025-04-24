import { QuizOutlined } from '@mui/icons-material';
import { Alert, Box, CircularProgress, Divider, Grid, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ExamResponse } from '../../types/exam';
import { StudentExamSessionResponses } from '../../types/testSession';
import SessionCard from './SessionCard.tsx';
import TestCard from './TestCard.tsx';

interface TestsContentProps {
    isMobile: boolean;
    exams: ExamResponse[];
    sessions: StudentExamSessionResponses[];
    loading: boolean;
    error: string | null;
}

const TestsContent: React.FC<TestsContentProps> = ({ isMobile, exams, sessions, loading, error }) => {
    const theme = useTheme();
    const [tabValue, setTabValue] = useState(0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.25
            }
        }
    };

    const itemVariants = {
        hidden: { y: 25, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 60,
                damping: 15
            }
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Filter exams for test list
    const activeExams = exams.filter(exam => {
        if (!exam.startTime) return false;
        const examStartTime = new Date(exam.startTime);
        return examStartTime <= new Date();
    });

    // Filter exams that don't already have an active or completed session
    const availableExams = activeExams.filter(exam =>
        !sessions.some(session => session.examData.id === exam.id)
    );

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <Paper
                    elevation={0}
                    sx={{
                        p: isMobile ? 3 : 5,
                        borderRadius: isMobile ? 4 : 6,
                        background: 'rgba(255, 255, 255, 0.97)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                        mb: 4
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <QuizOutlined sx={{ fontSize: 36, mr: 2, color: theme.palette.primary.main }} />
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            Тесты олимпиады
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {loading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    sx={{
                                        '& .MuiTab-root': {
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            py: 2
                                        }
                                    }}
                                >
                                    <Tab label="Доступные тесты" />
                                    <Tab label="Мои тесты" />
                                </Tabs>
                            </Box>

                            {tabValue === 0 && (
                                <>
                                    {availableExams.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {availableExams.map((exam) => (
                                                <Grid item xs={12} md={6} lg={4} key={exam.id}>
                                                    <TestCard exam={exam} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box textAlign="center" py={5}>
                                            <Typography variant="h6" color="text.secondary">
                                                Нет доступных тестов
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                На данный момент нет тестов, доступных для прохождения
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}

                            {tabValue === 1 && (
                                <>
                                    {sessions.length > 0 ? (
                                        <Grid container spacing={3}>
                                            {sessions.map((session) => (
                                                <Grid item xs={12} md={6} lg={4} key={session.id}>
                                                    <SessionCard session={session} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    ) : (
                                        <Box textAlign="center" py={5}>
                                            <Typography variant="h6" color="text.secondary">
                                                У вас нет пройденных тестов
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" mt={1}>
                                                Вы еще не приступали к прохождению тестов
                                            </Typography>
                                        </Box>
                                    )}
                                </>
                            )}
                        </Box>
                    )}
                </Paper>
            </motion.div>
        </motion.div>
    );
};

export default TestsContent;
