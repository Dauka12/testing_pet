import { Box, CircularProgress, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DashboardContent from '../components/dashboard/DashboardContent.tsx';
import Sidebar from '../components/dashboard/Sidebar.tsx';
import TestsContent from '../components/dashboard/TestsContent.tsx';
import useExamManager from '../hooks/useExamManager.ts';
import useTestSessionManager from '../hooks/useTestSessionManager.ts';
import { AppDispatch, RootState } from '../store';
import { logoutUser } from '../store/slices/authSlice.ts';

// Define view types
type DashboardView = 'dashboard' | 'tests';

const ContentContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(5, 5, 5, open ? 5 : 8),
    paddingTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3, 2),
        paddingTop: theme.spacing(6),
    }
}));

const Dashboard: React.FC = () => {
    const theme = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [open, setOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Get exams and sessions data
    const { exams, loading: examsLoading, error: examsError, fetchAllExams } = useExamManager();
    const {
        sessions,
        loading: sessionsLoading,
        error: sessionsError,
        getStudentSessions
    } = useTestSessionManager();

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const handleViewChange = (view: DashboardView) => {
        setCurrentView(view);
        if (isMobile) {
            setOpen(false);
        }
    };

    useEffect(() => {
        setMounted(true);

        // Close sidebar by default on mobile
        if (isMobile) {
            setOpen(false);
        }

        // Load tests data
        fetchAllExams();
        getStudentSessions();
    }, [fetchAllExams, getStudentSessions, isMobile]);

    if (!user) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f8faff',
                color: theme.palette.primary.main
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        <CircularProgress size={60} />
                        <Typography variant="h5" sx={{ mt: 3, fontWeight: 500 }}>
                            {t('dashboard.loading')}
                        </Typography>
                    </Box>
                </motion.div>
            </Box>
        );
    }

    const isLoading = examsLoading || sessionsLoading;
    const error = examsError || sessionsError;

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f8faff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative elements */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1 }}
                sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, rgba(255,255,255,0) 70%)`,
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
            
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.3 }}
                sx={{
                    position: 'absolute',
                    bottom: -100,
                    left: -100,
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.secondary.light} 0%, rgba(255,255,255,0) 70%)`,
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />

            {/* Sidebar Component */}
            <Sidebar 
                open={open}
                currentView={currentView} 
                user={user}
                onDrawerToggle={handleDrawerToggle}
                onViewChange={handleViewChange}
                onLogout={handleLogout}
                isMobile={isMobile}
            />

            <ContentContainer open={open}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ zIndex: 1, position: 'relative' }}
                    >
                        {currentView === 'dashboard' ? (
                            <DashboardContent 
                                isMobile={isMobile} 
                                onNavigateToTests={() => handleViewChange('tests')} 
                            />
                        ) : (
                            <TestsContent 
                                isMobile={isMobile}
                                exams={exams}
                                sessions={sessions}
                                loading={isLoading}
                                error={error}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </ContentContainer>
        </Box>
    );
};

export default Dashboard;