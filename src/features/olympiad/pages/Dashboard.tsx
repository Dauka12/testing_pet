import { Box, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
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
        easing: theme.transitions.easing.sharp,
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
                backgroundImage: 'linear-gradient(135deg, #1A2751 0%, #13203f 100%)',
                color: 'white'
            }}>
                <Typography variant="h5">Загрузка...</Typography>
            </Box>
        );
    }

    const isLoading = examsLoading || sessionsLoading;
    const error = examsError || sessionsError;

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            backgroundImage: 'linear-gradient(135deg, #1A2751 0%, #13203f 100%)'
        }}>
            {/* Background effect */}
            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1 }}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle, transparent 20%, #1A2751 80%)',
                    pointerEvents: 'none',
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
            </ContentContainer>
        </Box>
    );
};

export default Dashboard;