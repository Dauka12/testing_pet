import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Divider,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AiTestGenerator from '../components/AiTestGenerator.tsx';
import ExamForm from '../components/ExamForm.tsx';
import ExamList from '../components/ExamList.tsx';
import ExamViewer from '../components/ExamViewer.tsx';
import QuestionForm from '../components/QuestionForm.tsx';
import { AppDispatch, RootState } from '../store';
import { clearError, fetchAllExams as fetchAllExamsAction, fetchExamById } from '../store/slices/examSlice.ts';
import theme from '../theme.ts'; // Adjust path as necessary
import { ExamResponse } from '../types/exam.ts';

const OlympiadManager: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { exams, currentExam, loading, error } = useSelector((state: RootState) => state.exam);
    const [activeTab, setActiveTab] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('edit');

    useEffect(() => {
        dispatch(fetchAllExamsAction());
    }, [dispatch]);

    useEffect(() => {
        // Show errors in snackbar
        if (error) {
            setSnackbarMessage(error);
            setShowSnackbar(true);
        }
    }, [error]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
        dispatch(clearError());
    };

    const handleEditExam = (exam: ExamResponse) => {
        dispatch(fetchExamById(exam.id));
        setActiveTab(3);
        setViewMode('edit');
    };

    const handleViewExam = (exam: ExamResponse) => {
        dispatch(fetchExamById(exam.id));
        setActiveTab(3);
        setViewMode('view');
    };

    // Success handler for QuestionForm
    const handleQuestionSuccess = () => {
        if (currentExam) {
            dispatch(fetchExamById(currentExam.id));
        }
    };

    // Handle AI test generation success
    const handleAiTestSuccess = (examId: number) => {
        // Fetch the exam after successful generation
        dispatch(fetchExamById(examId));
        // Optionally switch to the exam view tab
        setActiveTab(3);
        setViewMode('edit');
    };

    const getTabs = () => {
        const tabs = [
            <Tab label="Список экзаменов" key="tab-list" />,
            <Tab label="Создать экзамен" key="tab-create" />,
            <Tab label="Создание с помощью AI" key="tab-ai" /> // New AI tab
        ];

        if (currentExam) {
            tabs.push(
                <Tab
                    label={
                        viewMode === 'view'
                            ? `Просмотр: ${currentExam.nameRus}`
                            : `Управление вопросами: ${currentExam.nameRus}`
                    }
                    key="tab-manage"
                />
            );
        }

        return tabs;
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(135deg, #1A2751 0%, #13203f 100%)'
        }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.97)',
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                            mb: 4
                        }}
                    >
                        <Box display="flex" alignItems="center" mb={3}>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Управление олимпиадами
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{
                                mb: 3,
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    fontSize: '1rem'
                                }
                            }}
                        >
                            {getTabs()}
                        </Tabs>

                        {/* Tab content */}
                        <Box sx={{ position: 'relative', minHeight: '400px' }}>
                            {loading && (
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        zIndex: 10,
                                        borderRadius: 2
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}

                            {/* Exams List Tab */}
                            {activeTab === 0 && (
                                <ExamList
                                    onEditExam={handleEditExam}
                                    onViewExam={handleViewExam}
                                />
                            )}

                            {/* Create Exam Tab */}
                            {activeTab === 1 && (
                                <ExamForm />
                            )}

                            {/* AI Test Generator Tab */}
                            {activeTab === 2 && (
                                <AiTestGenerator onSuccess={handleAiTestSuccess} />
                            )}

                            {/* Questions Tab - Only visible when an exam is selected */}
                            {activeTab === 3 && currentExam && (
                                viewMode === 'view' ? (
                                    <ExamViewer exam={currentExam} />
                                ) : (
                                    <QuestionForm
                                        testId={currentExam.id}
                                        onSuccess={handleQuestionSuccess}
                                    />
                                )
                            )}
                        </Box>
                    </Paper>
                </motion.div>
            </Container>

            <Snackbar
                open={showSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OlympiadManager;