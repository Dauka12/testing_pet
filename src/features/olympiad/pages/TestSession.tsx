import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    styled,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TestNavigationPanel from '../components/TestNavigationPanel.tsx';
import TestQuestion from '../components/TestQuestion.tsx';
import TestTimer from '../components/TestTimer.tsx';
import useTestSessionManager from '../hooks/useTestSessionManager.ts';

const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    backgroundImage: 'linear-gradient(135deg, #1A2751 0%, #13203f 100%)',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(6),
}));

const StyledPaper = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: 14,
    padding: theme.spacing(1.2, 3),
    fontWeight: 600,
    textTransform: 'none',
}));

const TestSession: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();
    const {
        currentSession,
        loading,
        error,
        getExamSession,
        endExamSession,
        updateAnswer,
        isExamActive,
        getRemainingTime
    } = useTestSessionManager();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [confirmEndOpen, setConfirmEndOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [autoSubmitWarning, setAutoSubmitWarning] = useState(false);

    // Load the exam session
    useEffect(() => {
        if (!sessionId) {
            navigate('/olympiad/dashboard');
            return;
        }
        getExamSession(parseInt(sessionId));
    }, [sessionId, getExamSession, navigate]);

    // Auto-submit when time runs out
    useEffect(() => {
        if (!currentSession) return;

        const timeRemaining = getRemainingTime();
        if (timeRemaining <= 0 && isExamActive()) {
            handleEndExam();
        }

        // Show warning when 60 seconds remain
        if (timeRemaining <= 60 && timeRemaining > 0) {
            setAutoSubmitWarning(true);
        } else {
            setAutoSubmitWarning(false);
        }
    }, [currentSession, getRemainingTime, isExamActive]);

    // Return to dashboard if the exam is completed or doesn't exist
    useEffect(() => {
        if (!loading && currentSession && !isExamActive()) {
            navigate('/olympiad/test-results/' + sessionId);
        }
    }, [currentSession, loading, isExamActive, navigate, sessionId]);

    const handleNextQuestion = () => {
        if (currentSession && currentQuestionIndex < currentSession.examData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSelectOption = (questionId: number, optionId: number) => {
        if (!currentSession) return;
        updateAnswer(currentSession.id, questionId, optionId);
    };

    const handleEndExam = async () => {
        if (!sessionId || !currentSession) return;

        try {
            setIsSubmitting(true);
            await endExamSession(parseInt(sessionId));
            navigate('/olympiad/test-results/' + sessionId);
        } catch (error) {
            console.error('Failed to end exam:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenConfirmEnd = () => {
        setConfirmEndOpen(true);
    };

    const handleCloseConfirmEnd = () => {
        setConfirmEndOpen(false);
    };

    const getCurrentQuestion = () => {
        return currentSession?.examData.questions[currentQuestionIndex];
    };

    // Get the selected answer for current question
    const getSelectedOption = (questionId: number) => {
        if (!currentSession) return null;
        const answer = currentSession.examData.studentAnswer.find(
            answer => answer.questionId === questionId
        );
        return answer ? answer.selectedOptionId : null;
    };

    // Get answered questions count
    const getAnsweredCount = () => {
        if (!currentSession) return 0;
        const uniqueAnsweredQuestions = new Set(
            currentSession.examData.studentAnswer.map(answer => answer.questionId)
        );
        return uniqueAnsweredQuestions.size;
    };

    if (loading || !currentSession) {
        return (
            <PageContainer>
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress size={60} sx={{ color: 'white' }} />
                </Box>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <StyledPaper
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Paper elevation={0}>
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                            <Button sx={{ mt: 2 }} onClick={() => navigate('/olympiad/dashboard')}>
                                Вернуться на главную
                            </Button>
                        </Paper>
                    </StyledPaper>
                </Container>
            </PageContainer>
        );
    }

    const currentQuestion = getCurrentQuestion();
    const totalQuestions = currentSession.examData.questions.length;
    const answeredCount = getAnsweredCount();

    return (
        <PageContainer>
            <Container maxWidth="lg">
                <StyledPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper elevation={0}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h5" component="h1" fontWeight="600">
                                    {currentSession.examData.nameRus}
                                </Typography>
                                <Typography variant="subtitle1" color="text.secondary">
                                    {currentSession.examData.typeRus}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                                <TestTimer remainingSeconds={getRemainingTime()} onTimeExpired={handleEndExam} />
                                <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                                    Вопросов отвечено: {answeredCount} из {totalQuestions}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </StyledPaper>

                {autoSubmitWarning && (
                    <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, boxShadow: '0 6px 20px rgba(255, 152, 0, 0.15)' }}>
                        Внимание! Осталось меньше минуты до окончания теста. Тест будет автоматически завершен.
                    </Alert>
                )}

                {currentQuestion && (
                    <StyledPaper
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <Paper elevation={0}>
                            <Typography variant="subtitle1" fontWeight={600} color="primary" gutterBottom>
                                Вопрос {currentQuestionIndex + 1} из {totalQuestions}
                            </Typography>

                            <TestQuestion
                                question={currentQuestion}
                                selectedOptionId={getSelectedOption(currentQuestion.id)}
                                onSelectOption={handleSelectOption}
                            />

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                <ActionButton
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    disabled={currentQuestionIndex === 0}
                                    onClick={handlePrevQuestion}
                                    sx={{ borderRadius: 3 }}
                                >
                                    Предыдущий
                                </ActionButton>

                                {currentQuestionIndex < totalQuestions - 1 ? (
                                    <ActionButton
                                        variant="outlined"
                                        color="primary"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleNextQuestion}
                                        sx={{ borderRadius: 3 }}
                                    >
                                        Следующий
                                    </ActionButton>
                                ) : (
                                    <ActionButton
                                        variant="contained"
                                        color="primary"
                                        endIcon={<CheckIcon />}
                                        onClick={handleOpenConfirmEnd}
                                        sx={{ borderRadius: 3 }}
                                    >
                                        Завершить тест
                                    </ActionButton>
                                )}
                            </Box>
                        </Paper>
                    </StyledPaper>
                )}

                <StyledPaper
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Paper elevation={0}>
                        <TestNavigationPanel
                            questions={currentSession.examData.questions}
                            currentIndex={currentQuestionIndex}
                            answers={currentSession.examData.studentAnswer}
                            onQuestionSelect={(index) => setCurrentQuestionIndex(index)}
                        />

                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                            <ActionButton
                                variant="contained"
                                color="secondary"
                                size="large"
                                onClick={handleOpenConfirmEnd}
                                disabled={isSubmitting}
                                sx={{
                                    borderRadius: 3,
                                    px: 6,
                                    py: 1.5,
                                    boxShadow: '0 8px 16px rgba(245, 178, 7, 0.2)'
                                }}
                            >
                                {isSubmitting ? <CircularProgress size={24} /> : 'Завершить тест'}
                            </ActionButton>
                        </Box>
                    </Paper>
                </StyledPaper>

                <Dialog
                    open={confirmEndOpen}
                    onClose={handleCloseConfirmEnd}
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            boxShadow: '0 24px 38px rgba(0, 0, 0, 0.14)'
                        }
                    }}
                >
                    <DialogTitle>Завершить тест?</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Вы уверены, что хотите завершить тест? Вы ответили на {answeredCount} из {totalQuestions} вопросов.
                            После завершения вы не сможете изменить свои ответы.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 3, pr: 3 }}>
                        <Button
                            onClick={handleCloseConfirmEnd}
                            sx={{ borderRadius: 2, textTransform: 'none' }}
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleEndExam}
                            variant="contained"
                            color="primary"
                            autoFocus
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
                        >
                            Завершить тест
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </PageContainer>
    );
};

export default TestSession;