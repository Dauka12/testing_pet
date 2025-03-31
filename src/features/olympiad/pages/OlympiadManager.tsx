import { ArrowBack } from '@mui/icons-material';
import {
    Alert,
    Box,
    CircularProgress,
    Container,
    Divider,
    IconButton,
    Paper,
    Snackbar,
    Tab,
    Tabs,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExamForm from '../components/ExamForm.tsx';
import ExamList from '../components/ExamList.tsx';
import ExamViewer from '../components/ExamViewer.tsx';
import QuestionForm from '../components/QuestionForm.tsx';
import { AppDispatch, RootState } from '../store';
import { clearError, fetchAllExams as fetchAllExamsAction, fetchExamById } from '../store/slices/examSlice.ts';
import { ExamResponse } from '../types/exam.ts';

const OlympiadManager: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { exams, currentExam, loading, error } = useSelector((state: RootState) => state.exam);
    const [activeTab, setActiveTab] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [viewMode, setViewMode] = useState<'view' | 'edit'>('edit');
    
    // Responsive hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');

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
        setActiveTab(2);
        setViewMode('edit');
    };

    const handleViewExam = (exam: ExamResponse) => {
        dispatch(fetchExamById(exam.id));
        setActiveTab(2);
        setViewMode('view');
    };

    const handleBackToList = () => {
        setActiveTab(0);
    };

    // Success handler for QuestionForm
    const handleQuestionSuccess = () => {
        if (currentExam) {
            dispatch(fetchExamById(currentExam.id));
        }
    };

    const getTabs = () => {
        const tabs = [
            <Tab 
                label={isMobile ? "Список" : "Список экзаменов"} 
                key="tab-list"
                sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
            />,
            <Tab 
                label={isMobile ? "Создать" : "Создать экзамен"} 
                key="tab-create"
                sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
            />
        ];

        if (currentExam) {
            const label = isMobile 
                ? (viewMode === 'view' ? "Просмотр" : "Вопросы") 
                : (viewMode === 'view' ? `Просмотр: ${currentExam.nameRus}` : `Управление вопросами: ${currentExam.nameRus}`);
                
            tabs.push(
                <Tab
                    label={label}
                    key="tab-manage"
                    sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
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
            <Container 
                maxWidth="xl" 
                sx={{ 
                    py: isMobile ? 2 : 4,
                    px: isMobile ? 1.5 : 3 
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: isMobile ? 2 : 4,
                            borderRadius: isMobile ? 2 : 4,
                            background: 'rgba(255, 255, 255, 0.97)',
                            backdropFilter: 'blur(15px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                            mb: isMobile ? 2 : 4,
                            overflow: 'hidden'
                        }}
                    >
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            mb={isMobile ? 2 : 3}
                            flexDirection={isMobile && activeTab === 2 ? "row" : "column"}
                            sx={{ 
                                width: '100%',
                                [theme.breakpoints.up('sm')]: {
                                    flexDirection: 'row'
                                }
                            }}
                        >
                            {isMobile && activeTab === 2 && (
                                <IconButton 
                                    color="primary" 
                                    onClick={handleBackToList}
                                    sx={{ mr: 1 }}
                                >
                                    <ArrowBack />
                                </IconButton>
                            )}
                            
                            <Typography
                                variant={isMobile ? "h5" : "h4"}
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    fontSize: isExtraSmall ? '1.5rem' : undefined,
                                    flexGrow: 1
                                }}
                            >
                                {activeTab === 2 && isMobile 
                                    ? (viewMode === 'view' 
                                        ? `Просмотр теста` 
                                        : `Редактирование`)
                                    : "Управление тестами"
                                }
                            </Typography>
                            
                            {(activeTab === 2 && isMobile && currentExam) && (
                                <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                        ml: 2, 
                                        color: 'text.secondary',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        maxWidth: '50%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {currentExam.nameRus}
                                </Typography>
                            )}
                        </Box>

                        <Divider sx={{ mb: isMobile ? 2 : 3 }} />

                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant={isMobile ? "fullWidth" : "standard"}
                            sx={{
                                mb: isMobile ? 2 : 3,
                                '& .MuiTab-root': {
                                    fontWeight: 600,
                                    minWidth: isMobile ? 0 : 90,
                                    p: isMobile ? 1 : 2
                                }
                            }}
                        >
                            {getTabs()}
                        </Tabs>

                        {/* Tab content */}
                        <Box sx={{ 
                            position: 'relative', 
                            minHeight: isMobile ? '300px' : '400px',
                        }}>
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
                                        borderRadius: isMobile ? 1 : 2
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
                                    isMobile={isMobile}
                                />
                            )}

                            {/* Create Exam Tab */}
                            {activeTab === 1 && (
                                <ExamForm
                                    isMobile={isMobile}
                                />
                            )}

                            {/* Questions Tab - Only visible when an exam is selected */}
                            {activeTab === 2 && currentExam && (
                                viewMode === 'view' ? (
                                    <ExamViewer 
                                        exam={currentExam}
                                        isMobile={isMobile}
                                    />
                                ) : (
                                    <QuestionForm
                                        testId={currentExam.id}
                                        onSuccess={handleQuestionSuccess}
                                        isMobile={isMobile}
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
                anchorOrigin={{ 
                    vertical: 'bottom', 
                    horizontal: isMobile ? 'center' : 'right' 
                }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity="error" 
                    sx={{ 
                        width: isMobile ? '100%' : '400px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default OlympiadManager;