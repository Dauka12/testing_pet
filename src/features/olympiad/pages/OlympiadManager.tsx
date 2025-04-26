import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
    Alert,
    AppBar,
    Box,
    Breadcrumbs,
    Card,
    CardActionArea,
    CardContent,
    CircularProgress,
    Container,
    CssBaseline,
    Drawer,
    Fab,
    IconButton,
    Link,
    Snackbar,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AiTestGenerator from '../components/olympiadmanager/AiTestGenerator.tsx';
import ExamForm from '../components/olympiadmanager/ExamForm.tsx';
import ExamList from '../components/olympiadmanager/ExamList.tsx';
import ExamViewer from '../components/olympiadmanager/ExamViewer.tsx';
import QuestionForm from '../components/olympiadmanager/QuestionForm.tsx';
import TabPanel from '../components/olympiadmanager/TabPanel.tsx';
import { AppDispatch, RootState } from '../store';
import { clearError, fetchAllExams as fetchAllExamsAction, fetchExamById } from '../store/slices/examSlice.ts';
import { ExamResponse } from '../types/exam.ts';

// Define the view states
type ViewState = 'dashboard' | 'examList' | 'createExam' | 'aiGenerator' | 'examDetails';
type ExamView = 'view' | 'edit';

const OlympiadManager: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery('(max-width:480px)');

    const { exams, currentExam, loading, error } = useSelector((state: RootState) => state.exam);

    const [activeView, setActiveView] = useState<ViewState>('dashboard');
    const [examView, setExamView] = useState<ExamView>('view');
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        dispatch(fetchAllExamsAction());
    }, [dispatch, refreshKey]);

    useEffect(() => {
        if (error) {
            setSnackbarMessage(error);
            setShowSnackbar(true);
        }
    }, [error]);

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
        dispatch(clearError());
    };

    const handleEditExam = (exam: ExamResponse) => {
        dispatch(fetchExamById(exam.id));
        setActiveView('examDetails');
        setExamView('edit');
        if (isMobile) setDrawerOpen(false);
    };

    const handleViewExam = (exam: ExamResponse) => {
        dispatch(fetchExamById(exam.id));
        setActiveView('examDetails');
        setExamView('view');
        if (isMobile) setDrawerOpen(false);
    };

    const handleQuestionSuccess = () => {
        if (currentExam) {
            dispatch(fetchExamById(currentExam.id));
        }
    };

    const handleAiTestSuccess = (examId: number) => {
        dispatch(fetchExamById(examId));
        setActiveView('examDetails');
        setExamView('edit');
    };

    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const handleGoBack = () => {
        if (activeView === 'examDetails' || activeView === 'createExam' ||
            activeView === 'examList' || activeView === 'aiGenerator') {
            setActiveView('dashboard');
        }
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const navigationItems = [
        { name: 'Главная', icon: <HomeIcon />, view: 'dashboard' as ViewState },
        { name: 'Список экзаменов', icon: <ListIcon />, view: 'examList' as ViewState },
        { name: 'Создать экзамен', icon: <AddBoxIcon />, view: 'createExam' as ViewState },
        { name: 'AI генерация', icon: <SmartToyIcon />, view: 'aiGenerator' as ViewState },
    ];

    const drawerContent = (
        <Box
            sx={{
                width: 280,
                pt: 8,
                height: '100%',
                bgcolor: 'background.paper',
            }}
            role="presentation"
            onClick={() => isMobile && setDrawerOpen(false)}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Управление тестами
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Создавайте и управляйте экзаменами
                </Typography>
            </Box>

            {navigationItems.map((item) => (
                <Box
                    key={item.view}
                    sx={{
                        p: 1.5,
                        mx: 2,
                        my: 1,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        bgcolor: activeView === item.view ? 'rgba(26, 39, 81, 0.08)' : 'transparent',
                        color: activeView === item.view ? 'primary.main' : 'text.primary',
                        '&:hover': {
                            bgcolor: 'rgba(26, 39, 81, 0.05)',
                        }
                    }}
                    onClick={() => {
                        setActiveView(item.view);
                        if (isMobile) setDrawerOpen(false);
                    }}
                >
                    {item.icon}
                    <Typography fontWeight={activeView === item.view ? 'medium' : 'normal'}>
                        {item.name}
                    </Typography>
                </Box>
            ))}

            {currentExam && (
                <Box
                    sx={{
                        p: 1.5,
                        mx: 2,
                        my: 1,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        bgcolor: activeView === 'examDetails' ? 'rgba(26, 39, 81, 0.08)' : 'transparent',
                        color: activeView === 'examDetails' ? 'primary.main' : 'text.primary',
                        '&:hover': {
                            bgcolor: 'rgba(26, 39, 81, 0.05)',
                        }
                    }}
                    onClick={() => {
                        setActiveView('examDetails');
                        if (isMobile) setDrawerOpen(false);
                    }}
                >
                    <AssignmentIcon />
                    <Typography
                        fontWeight={activeView === 'examDetails' ? 'medium' : 'normal'}
                        noWrap
                        sx={{ maxWidth: 200 }}
                    >
                        {currentExam.nameRus}
                    </Typography>
                </Box>
            )}
        </Box>
    );

    // Helper function to render breadcrumbs
    const renderBreadcrumbs = () => {
        let items = [
            <Link
                color="inherit"
                key="dashboard"
                underline="hover"
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setActiveView('dashboard')}
            >
                <HomeIcon sx={{ mr: 0.5, fontSize: 18 }} />
                Главная
            </Link>
        ];

        switch (activeView) {
            case 'examList':
                items.push(
                    <Typography color="text.primary" key="list">
                        Список экзаменов
                    </Typography>
                );
                break;
            case 'createExam':
                items.push(
                    <Typography color="text.primary" key="create">
                        Создать экзамен
                    </Typography>
                );
                break;
            case 'aiGenerator':
                items.push(
                    <Typography color="text.primary" key="ai">
                        AI генерация
                    </Typography>
                );
                break;
            case 'examDetails':
                items.push(
                    <Link
                        color="inherit"
                        key="list-link"
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setActiveView('examList')}
                    >
                        Список экзаменов
                    </Link>
                );
                if (currentExam) {
                    items.push(
                        <Typography color="text.primary" key="exam-name" noWrap>
                            {currentExam.nameRus}
                        </Typography>
                    );
                }
                break;
        }

        return (
            <Breadcrumbs separator="›" sx={{ mb: 3, display: { xs: 'none', md: 'flex' } }}>
                {items}
            </Breadcrumbs>
        );
    };

    // Dashboard cards
    const dashboardCards = [
        {
            title: 'Список экзаменов',
            description: 'Просмотр и управление существующими экзаменами',
            icon: <ListIcon fontSize="large" color="primary" />,
            view: 'examList' as ViewState,
            count: exams.length
        },
        {
            title: 'Создать экзамен',
            description: 'Добавление нового экзамена вручную',
            icon: <AddBoxIcon fontSize="large" color="primary" />,
            view: 'createExam' as ViewState
        },
        {
            title: 'Генерация с помощью AI',
            description: 'Автоматическое создание тестов с использованием искусственного интеллекта',
            icon: <SmartToyIcon fontSize="large" color="primary" />,
            view: 'aiGenerator' as ViewState
        }
    ];

    // Render dashboard view
    const renderDashboard = () => (
        <Box>
            <Typography variant="h5" component="h1" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                Панель управления
            </Typography>

            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)'
                    },
                    gap: 3
                }}
            >
                {dashboardCards.map((card, index) => (
                    <Card
                        key={card.title}
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <CardActionArea
                            onClick={() => setActiveView(card.view)}
                            sx={{ height: '100%', p: 1 }}
                        >
                            <CardContent sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                p: 3
                            }}>
                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(26, 39, 81, 0.08)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {card.icon}
                                </Box>

                                <Typography variant="h6" component="h2" gutterBottom>
                                    {card.title}
                                    {card.count !== undefined && (
                                        <Typography
                                            component="span"
                                            sx={{
                                                ml: 1,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 10,
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            {card.count}
                                        </Typography>
                                    )}
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Box>

            {exams.length > 0 && (
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                        Последние экзамены
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)'
                            },
                            gap: 3
                        }}
                    >
                        {exams.slice(0, 6).map((exam, index) => (
                            <Card
                                key={exam.id}
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                sx={{
                                    bgcolor: 'background.paper',
                                    position: 'relative',
                                    overflow: 'visible'
                                }}
                            >
                                <CardActionArea
                                    onClick={() => handleViewExam(exam)}
                                    sx={{ p: 1 }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight="medium" noWrap>
                                            {exam.nameRus}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {exam.typeRus} • {exam.durationInMinutes} мин.
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mt: 1,
                                                gap: 1
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    px: 1,
                                                    py: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: 'primary.light',
                                                    color: 'white',
                                                }}
                                            >
                                                {exam.questions?.length || 0} вопросов
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f7f9fc' }}>
            <CssBaseline />

            {/* App Bar */}
            <AppBar position="fixed" color="default" elevation={0}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        {!isSmallMobile && (
                            <Typography variant="h6" noWrap component="div">
                            Менеджер
                            </Typography>
                        )}
                    </Box>

                    <Box>
                        <IconButton color="inherit" onClick={handleRefresh}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Navigation Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer}
                variant={isMobile ? "temporary" : "temporary"}
                sx={{ zIndex: theme.zIndex.appBar + 1 }}
            >
                <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <IconButton onClick={toggleDrawer}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Container
                maxWidth="xl"
                sx={{ pt: '80px', pb: 8, px: { xs: 2, sm: 3 } }}
            >
                {renderBreadcrumbs()}

                {/* Mobile Back Button */}
                {isMobile && activeView !== 'dashboard' && (
                    <Box sx={{ mb: 2 }}>
                        <IconButton
                            onClick={handleGoBack}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                mr: 1
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography component="span" variant="subtitle1">
                            {activeView === 'examList' && 'Список экзаменов'}
                            {activeView === 'createExam' && 'Создать экзамен'}
                            {activeView === 'aiGenerator' && 'AI генерация'}
                            {activeView === 'examDetails' && (currentExam ? currentExam.nameRus : 'Детали экзамена')}
                        </Typography>
                    </Box>
                )}

                <AnimatePresence mode="wait">
                    <Box key={activeView} sx={{ position: 'relative', minHeight: '500px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Dashboard View */}
                            {activeView === 'dashboard' && renderDashboard()}

                            {/* Exams List View */}
                            <TabPanel value={activeView} index="examList">
                                <ExamList
                                    onEditExam={handleEditExam}
                                    onViewExam={handleViewExam}
                                />
                            </TabPanel>

                            {/* Create Exam View */}
                            <TabPanel value={activeView} index="createExam">
                                <ExamForm />
                            </TabPanel>

                            {/* AI Generator View */}
                            <TabPanel value={activeView} index="aiGenerator">
                                <AiTestGenerator onSuccess={handleAiTestSuccess} />
                            </TabPanel>

                            {/* Exam Details View */}
                            <TabPanel
                                value={activeView}
                                index="examDetails"
                                loading={loading}
                            >
                                {currentExam && (
                                    examView === 'view' ? (
                                        <ExamViewer
                                            exam={currentExam}
                                            onEdit={() => setExamView('edit')}

                                        />
                                    ) : (
                                        <QuestionForm
                                            testId={currentExam.id}
                                            question={selectedQuestionId ?
                                                currentExam.questions?.find(q => q.id === selectedQuestionId) :
                                                undefined}
                                            onSuccess={() => {
                                                handleQuestionSuccess();
                                                setSelectedQuestionId(null);
                                                setExamView('view');
                                            }}
                                        />
                                    )
                                )}
                            </TabPanel>
                        </motion.div>

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
                    </Box>
                </AnimatePresence>
            </Container>

            {/* Mobile FAB for quick creating */}
            {isMobile && activeView === 'examList' && (
                <Fab
                    color="primary"
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                    }}
                    onClick={() => setActiveView('createExam')}
                >
                    <AddBoxIcon />
                </Fab>
            )}

            {/* Error Snackbar */}
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