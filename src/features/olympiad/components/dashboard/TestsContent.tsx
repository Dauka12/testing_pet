import { QuizOutlined } from '@mui/icons-material';
import {
    Alert,
    Box,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
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
                delayChildren: 0.15
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
                        p: isMobile ? 3 : 4,
                        borderRadius: isMobile ? 3 : 4,
                        background: '#ffffff',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                        mb: 4,
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 3, 
                        flexDirection: isMobile ? 'column' : 'row',
                        textAlign: isMobile ? 'center' : 'left',
                        gap: 2
                    }}>
                        <Box sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.light + '15',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <QuizOutlined sx={{ fontSize: 30, color: theme.palette.primary.main }} />
                        </Box>
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main
                            }}
                        >
                            Тесты олимпиады
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                            <CircularProgress size={40} thickness={4} />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                Загрузка тестов...
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider', 
                                mb: 4,
                                bgcolor: theme.palette.grey[50],
                                borderRadius: 3,
                                p: 0.5,
                            }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                    sx={{
                                        '& .MuiTab-root': {
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            textTransform: 'none',
                                            py: 1.5,
                                            borderRadius: 2,
                                            minHeight: 'auto',
                                            '&.Mui-selected': {
                                                bgcolor: '#ffffff',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                            }
                                        },
                                        '& .MuiTabs-indicator': {
                                            display: 'none',
                                        }
                                    }}
                                >
                                    <Tab label="Доступные тесты" />
                                    <Tab label="Мои тесты" />
                                </Tabs>
                            </Box>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={tabValue}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {tabValue === 0 && (
                                        <>
                                            {availableExams.length > 0 ? (
                                                <Grid container spacing={3}>
                                                    {availableExams.map((exam) => (
                                                        <Grid item xs={12} sm={6} lg={4} key={exam.id}>
                                                            <TestCard exam={exam} />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <Box 
                                                    textAlign="center" 
                                                    py={5}
                                                    sx={{
                                                        bgcolor: theme.palette.grey[50],
                                                        borderRadius: 4,
                                                        border: '1px dashed',
                                                        borderColor: theme.palette.divider,
                                                    }}
                                                >
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
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
                                                        <Grid item xs={12} sm={6} lg={4} key={session.id}>
                                                            <SessionCard session={session} />
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            ) : (
                                                <Box 
                                                    textAlign="center" 
                                                    py={5}
                                                    sx={{
                                                        bgcolor: theme.palette.grey[50],
                                                        borderRadius: 4,
                                                        border: '1px dashed',
                                                        borderColor: theme.palette.divider,
                                                    }}
                                                >
                                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                                        У вас нет пройденных тестов
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                                        Вы еще не приступали к прохождению тестов
                                                    </Typography>
                                                </Box>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </Box>
                    )}
                </Paper>
            </motion.div>
        </motion.div>
    );
};

export default TestsContent;
