import { Alert, Box, CircularProgress, Container, Grid, Paper, Tab, Tabs, Typography, styled } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import SessionCard from '../components/SessionCard.tsx';
import TestCard from '../components/TestCard.tsx';
import useExamManager from '../hooks/useExamManager.ts';
import useTestSessionManager from '../hooks/useTestSessionManager.ts';

// Styled components to match Dashboard aesthetic
const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(135deg, #1A2751 0%, #13203f 100%)',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(6),
}));

const ContentCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.secondary.main,
        height: 3,
    },
    '& .MuiTab-root': {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        minWidth: 120,
        padding: theme.spacing(1.5, 2),
        '&.Mui-selected': {
            color: theme.palette.secondary.main,
        },
    },
}));

const EmptyStateCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
}));

const PageHeading = styled(Typography)(({ theme }) => ({
    color: '#fff',
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

const TestsList: React.FC = () => {
    const [tabValue, setTabValue] = useState(0);
    const { exams, loading: examsLoading, error: examsError, fetchAllExams } = useExamManager();
    const {
        sessions,
        loading: sessionsLoading,
        error: sessionsError,
        getStudentSessions
    } = useTestSessionManager();

    useEffect(() => {
        fetchAllExams();
        getStudentSessions();
    }, [fetchAllExams, getStudentSessions]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const isLoading = examsLoading || sessionsLoading;
    const error = examsError || sessionsError;

    const activeExams = exams.filter(exam => {
        // Check if the exam has a startTime and it's in the future or present
        if (!exam.startTime) return false;
        const examStartTime = new Date(exam.startTime);
        return examStartTime <= new Date();
    });

    // Filter exams that don't already have an active or completed session
    const availableExams = activeExams.filter(exam =>
        !sessions.some(session => session.examData.id === exam.id)
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <PageHeading variant="h4">
                        Олимпиада - Тесты
                    </PageHeading>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)'
                            }}
                        >
                            {error}
                        </Alert>
                    </motion.div>
                )}

                <ContentCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={6}>
                            <CircularProgress size={60} thickness={4} color="secondary" />
                        </Box>
                    ) : (
                        <Box>
                            <StyledTabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="test tabs"
                                variant="fullWidth"
                                sx={{ mb: 4 }}
                            >
                                <Tab label="Доступные тесты" />
                                <Tab label="Мои тесты" />
                            </StyledTabs>

                            {tabValue === 0 && (
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {availableExams.length === 0 ? (
                                        <motion.div variants={item}>
                                            <EmptyStateCard>
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    Нет доступных тестов
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    В данный момент для вас нет доступных тестов
                                                </Typography>
                                            </EmptyStateCard>
                                        </motion.div>
                                    ) : (
                                        <Grid container spacing={3}>
                                            {availableExams.map((exam) => (
                                                <Grid item xs={12} md={6} lg={4} key={exam.id}>
                                                    <motion.div variants={item}>
                                                        <TestCard exam={exam} />
                                                    </motion.div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </motion.div>
                            )}

                            {tabValue === 1 && (
                                <motion.div
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {sessions.length === 0 ? (
                                        <motion.div variants={item}>
                                            <EmptyStateCard>
                                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                                    Нет пройденных тестов
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Вы еще не проходили ни одного теста
                                                </Typography>
                                            </EmptyStateCard>
                                        </motion.div>
                                    ) : (
                                        <Grid container spacing={3}>
                                            {sessions.map((session) => (
                                                <Grid item xs={12} md={6} lg={4} key={session.id}>
                                                    <motion.div variants={item}>
                                                        <SessionCard session={session} />
                                                    </motion.div>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </motion.div>
                            )}
                        </Box>
                    )}
                </ContentCard>
            </Container>
        </PageContainer>
    );
};

export default TestsList;