import {
    AccountCircleOutlined,
    AssignmentOutlined,
    ChevronLeftOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuOutlined,
    QuizOutlined
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
    Tab,
    Tabs,
    Typography,
    useTheme
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SessionCard from '../components/SessionCard.tsx';
import TestCard from '../components/TestCard.tsx';
import useExamManager from '../hooks/useExamManager.ts';
import useTestSessionManager from '../hooks/useTestSessionManager.ts';
import { AppDispatch, RootState } from '../store';
import { logoutUser } from '../store/slices/authSlice.ts';

// Drawer width
const drawerWidth = 300;

// Desktop drawer (permanent variant)
const DesktopDrawer = styled(Drawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1250,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.97)',
        borderRight: 'none',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
        overflowX: 'hidden',
        overflowY: 'auto',
        transform: 'none',
        transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }
}));

// ContentContainer styles
const ContentContainer = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(5, 5, 5, open ? 5 : 8),
    paddingTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
    transition: theme.transitions.create(['margin', 'padding'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3, 2),
        paddingTop: theme.spacing(8),
        gap: theme.spacing(2.5),
        paddingLeft: theme.spacing(2), // Фиксированный отступ слева на мобильных
        width: '100%', // Важно для корректного отображения
        marginLeft: 0, // Не используем margin на мобильных
    },
    [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2, 1.5),
        paddingTop: theme.spacing(7),
    }
}));

const StyledAvatar = styled(motion.div)(({ theme }) => ({
    width: 140,
    height: 140,
    borderRadius: '50%',
    backgroundColor: theme.palette.grey[200],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
    border: '5px solid white',
    [theme.breakpoints.down('sm')]: {
        width: 90,
        height: 90,
        marginBottom: theme.spacing(2),
        border: '3px solid white'
    },
    [theme.breakpoints.down('xs')]: {
        width: 80,
        height: 80
    }
}));

const LogoutButton = styled(Button)(({ theme }) => ({
    borderRadius: 14,
    padding: theme.spacing(1.6, 2.5),
    fontSize: '0.98rem',
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 6px 16px rgba(211, 47, 47, 0.25)',
    '&:hover': {
        boxShadow: '0 8px 20px rgba(211, 47, 47, 0.35)',
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1.2, 2),
        fontSize: '0.9rem',
        borderRadius: 10
    }
}));

const ProfileCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        borderRadius: 16,
        marginBottom: theme.spacing(2)
    }
}));

const InfoCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(4),
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2.5),
        borderRadius: 16,
    }
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2, 0),
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    '&:last-child': {
        borderBottom: 'none',
        paddingBottom: 0
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(0.5),
        padding: theme.spacing(1.5, 0)
    }
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 1300,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    [theme.breakpoints.down('sm')]: {
        top: 10,
        left: 10,
        padding: theme.spacing(1),
        '& .MuiSvgIcon-root': {
            fontSize: '1.2rem'
        }
    }
}));

const MenuItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 12,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light + '20',
        '&:hover': {
            backgroundColor: theme.palette.primary.light + '30',
        }
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: 8,
        marginBottom: theme.spacing(0.5),
        padding: theme.spacing(1.5, 1.5),
        minHeight: 48  // Гарантируем минимальную высоту для удобства касания
    }
}));

const ContentPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(5),
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.97)',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        borderRadius: 16,
        marginBottom: theme.spacing(3),
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)'
    },
    [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2),
        borderRadius: 12,
        marginBottom: theme.spacing(2.5)
    }
}));

// Define views
type DashboardView = 'dashboard' | 'tests';

// Drawer content component to avoid repetition
const DrawerContent = ({ 
    user, 
    currentView, 
    handleViewChange, 
    handleLogout, 
    isMobile, 
    isExtraSmall, 
    handleDrawerToggle
}) => {
    const theme = useTheme();
    const fullName = `${user.lastname} ${user.firstname} ${user.middlename}`;

    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: isMobile ? 2 : 3,
            overflowY: 'auto'
        }}>
            {/* Добавляем кнопку закрытия для мобильных устройств */}
            {isMobile && (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: 1,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <IconButton
                        onClick={handleDrawerToggle}
                        size="small"
                        sx={{ mb: 1 }}
                    >
                        <ChevronLeftOutlined />
                    </IconButton>
                </Box>
            )}

            {/* Остальное содержимое сайдбара */}
            <ProfileCard
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 70,
                    delay: 0.1
                }}
            >
                <StyledAvatar
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 100,
                        delay: 0.4
                    }}
                >
                    <AccountCircleOutlined sx={{
                        fontSize: isMobile ? 60 : 100,
                        color: theme.palette.primary.main
                    }} />
                </StyledAvatar>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Typography
                        variant={isMobile ? "h6" : "h5"}
                        sx={{
                            textAlign: 'center',
                            fontWeight: 600,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: isMobile ? 0.5 : 1,
                            fontSize: isExtraSmall ? '1.1rem' : undefined
                        }}
                    >
                        {fullName}
                    </Typography>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            mt: isMobile ? 1 : 1.5,
                            textAlign: 'center',
                            color: theme.palette.text.secondary,
                            fontWeight: 500,
                            fontSize: isMobile ? '0.9rem' : '1rem'
                        }}
                    >
                        {user.university}
                    </Typography>
                </motion.div>
            </ProfileCard>

            {/* Navigation menu */}
            <Paper
                component={motion.div}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 70,
                    delay: 0.25
                }}
                elevation={0}
                sx={{
                    p: isMobile ? 2 : 3,
                    borderRadius: isMobile ? 3 : 4,
                    background: 'rgba(255, 255, 255, 0.97)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                    mb: isMobile ? 2 : 4
                }}
            >
                <List component="nav" sx={{ p: isMobile ? 0 : 1 }}>
                    <MenuItemButton
                        selected={currentView === 'dashboard'}
                        onClick={() => handleViewChange('dashboard')}
                    >
                        <ListItemIcon>
                            <DashboardOutlined sx={{
                                color: currentView === 'dashboard' ? theme.palette.primary.main : 'inherit',
                                fontSize: isMobile ? '1.3rem' : undefined
                            }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Главная"
                            primaryTypographyProps={{
                                fontWeight: currentView === 'dashboard' ? 600 : 400,
                                color: currentView === 'dashboard' ? theme.palette.primary.main : 'inherit',
                                fontSize: isMobile ? '0.95rem' : undefined
                            }}
                        />
                    </MenuItemButton>

                    <MenuItemButton
                        selected={currentView === 'tests'}
                        onClick={() => handleViewChange('tests')}
                    >
                        <ListItemIcon>
                            <AssignmentOutlined sx={{
                                color: currentView === 'tests' ? theme.palette.primary.main : 'inherit',
                                fontSize: isMobile ? '1.3rem' : undefined
                            }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Тесты"
                            primaryTypographyProps={{
                                fontWeight: currentView === 'tests' ? 600 : 400,
                                color: currentView === 'tests' ? theme.palette.primary.main : 'inherit',
                                fontSize: isMobile ? '0.95rem' : undefined
                            }}
                        />
                    </MenuItemButton>
                </List>
            </Paper>

            <InfoCard
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 70,
                    delay: 0.3
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: isMobile ? 2 : 3,
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        fontSize: isMobile ? '1.1rem' : '1.2rem'
                    }}
                >
                    Личная информация
                </Typography>

                <InfoItem>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            width: isMobile ? '100%' : 90,
                            color: theme.palette.text.secondary,
                            fontSize: isMobile ? '0.85rem' : '0.9rem'
                        }}
                    >
                        Телефон
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            fontSize: isMobile ? '0.9rem' : '0.95rem'
                        }}
                    >
                        {user.phone}
                    </Typography>
                </InfoItem>
            </InfoCard>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: isMobile ? 3 : 4 }}>
                <LogoutButton
                    component={motion.button}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<LogoutOutlined />}
                    size={isMobile ? "small" : "medium"}
                >
                    Выйти из системы
                </LogoutButton>
            </Box>
        </Box>
    );
};

const Dashboard: React.FC = () => {
    const theme = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [open, setOpen] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
    const [tabValue, setTabValue] = useState(0);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isExtraSmall = useMediaQuery('(max-width:400px)');

    // Get exams and sessions data
    const { exams, loading: examsLoading, error: examsError, fetchAllExams } = useExamManager();
    const {
        sessions,
        loading: sessionsLoading,
        error: sessionsError,
        getStudentSessions
    } = useTestSessionManager();

    useEffect(() => {
        setMounted(true);

        // Load tests data
        fetchAllExams();
        getStudentSessions();
    }, [fetchAllExams, getStudentSessions]);

    useEffect(() => {
        // Close sidebar by default on mobile
        if (isMobile) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [isMobile]);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/olympiad/login');
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleViewChange = (view: DashboardView) => {
        setCurrentView(view);
        // Close drawer automatically on mobile when view changes
        if (isMobile) {
            setOpen(false);
        }
    };

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

    const fullName = `${user.lastname} ${user.firstname} ${user.middlename}`;

    // Filter exams for test list
    const isLoading = examsLoading || sessionsLoading;
    const error = examsError || sessionsError;

    const activeExams = exams.filter(exam => {
        if (!exam.startTime) return false;
        const examStartTime = new Date(exam.startTime);
        return examStartTime <= new Date();
    });

    // Filter exams that don't already have an active or completed session
    const availableExams = activeExams.filter(exam =>
        !sessions.some(session => session.examData.id === exam.id)
    );

    // Animation variants
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

    // Render the appropriate content based on the current view
    const renderContent = () => {
        switch (currentView) {
            case 'tests':
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <ContentPaper>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    flexWrap: 'wrap'
                                }}>
                                    <QuizOutlined sx={{
                                        fontSize: isMobile ? 28 : 36,
                                        mr: isMobile ? 1.5 : 2,
                                        color: theme.palette.primary.main
                                    }} />
                                    <Typography
                                        variant={isExtraSmall ? "h5" : isMobile ? "h4" : "h4"}
                                        sx={{
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Тесты
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                                {isLoading ? (
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
                                                        fontSize: isMobile ? '0.85rem' : '1rem',
                                                        textTransform: 'none',
                                                        py: isMobile ? 1.5 : 2
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
                                                    <Grid container spacing={isMobile ? 2 : 3}>
                                                        {availableExams.map((exam) => (
                                                            <Grid item xs={12} sm={6} md={6} lg={4} key={exam.id}>
                                                                <TestCard exam={exam} />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                ) : (
                                                    <Box textAlign="center" py={isMobile ? 3 : 5}>
                                                        <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary">
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
                                                    <Grid container spacing={isMobile ? 2 : 3}>
                                                        {sessions.map((session) => (
                                                            <Grid item xs={12} sm={6} md={6} lg={4} key={session.id}>
                                                                <SessionCard session={session} />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                ) : (
                                                    <Box textAlign="center" py={isMobile ? 3 : 5}>
                                                        <Typography variant={isMobile ? "subtitle1" : "h6"} color="text.secondary">
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
                            </ContentPaper>
                        </motion.div>
                    </motion.div>
                );

            case 'dashboard':
            default:
                return (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants}>
                            <ContentPaper>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 3,
                                    flexWrap: 'wrap'
                                }}>
                                    <DashboardOutlined sx={{
                                        fontSize: isMobile ? 32 : 42,
                                        mr: isMobile ? 1.5 : 2.5,
                                        color: theme.palette.primary.main
                                    }} />
                                    <Typography
                                        variant={isExtraSmall ? "h5" : isMobile ? "h4" : "h3"}
                                        sx={{
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        Панель управления
                                    </Typography>
                                </Box>

                                <Divider sx={{ mb: isMobile ? 3 : 4 }} />

                                <Typography
                                    variant={isMobile ? "h6" : "h5"}
                                    gutterBottom
                                    sx={{ fontWeight: 600, mb: 2 }}
                                >
                                    Добро пожаловать в систему тестирования!
                                </Typography>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{
                                        mb: isMobile ? 2 : 3,
                                        fontSize: isMobile ? '1rem' : '1.1rem'
                                    }}
                                >
                                    Здесь вы сможете отслеживать свой прогресс, управлять профилем и проходить тесты.
                                </Typography>

                                <motion.div
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 0.2 }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: isMobile ? 2 : 5,
                                            borderRadius: isMobile ? 4 : 6,
                                            background: 'rgba(255, 255, 255, 0.97)',
                                            backdropFilter: 'blur(15px)',
                                            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                                            mb: isMobile ? 3 : 4
                                        }}
                                    >
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: isMobile ? 'flex-start' : 'flex-start',
                                            flexDirection: isExtraSmall ? 'column' : 'row'
                                        }}>
                                            <QuizOutlined sx={{
                                                fontSize: isMobile ? 20 : 24,
                                                mr: isExtraSmall ? 0 : 2,
                                                mb: isExtraSmall ? 1 : 0,
                                                color: theme.palette.primary.main,
                                                mt: isExtraSmall ? 0 : 0.5
                                            }} />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: isMobile ? '1.1rem' : 'inherit'
                                                    }}
                                                >
                                                    Тесты
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontSize: isMobile ? '0.95rem' : '1.05rem'
                                                    }}
                                                >
                                                    Перейдите в раздел "Тесты" в боковом меню, чтобы просмотреть доступные тесты и начать их прохождение.
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size={isMobile ? "small" : "medium"}
                                                    sx={{
                                                        mt: 2,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        py: isMobile ? 0.8 : undefined
                                                    }}
                                                    onClick={() => handleViewChange('tests')}
                                                >
                                                    Перейти к тестам
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </ContentPaper>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <ContentPaper>
                                <Typography
                                    variant={isMobile ? "h5" : "h4"}
                                    sx={{
                                        mb: isMobile ? 3 : 4,
                                        fontWeight: 600,
                                        color: theme.palette.primary.main
                                    }}
                                >
                                    Предстоящие события
                                </Typography>

                                <Box sx={{ p: isMobile ? 2 : 5, textAlign: 'center' }}>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ fontSize: isMobile ? '1rem' : '1.1rem' }}
                                    >
                                        Информация о предстоящих событиях будет отображаться здесь
                                    </Typography>
                                </Box>
                            </ContentPaper>
                        </motion.div>
                    </motion.div>
                );
        }
    };

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

            {/* Toggle Drawer Button */}
            <ToggleButton
                component={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDrawerToggle}
                size={isMobile ? "medium" : "large"}
            >
                {open ? <ChevronLeftOutlined /> : <MenuOutlined />}
            </ToggleButton>

            {/* Different drawer implementations for mobile and desktop */}
            {isMobile ? (
                // Mobile Drawer
                <Drawer
                    variant="temporary"
                    open={open}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true
                    }}
                    sx={{
                        zIndex: 1250,
                        '& .MuiDrawer-paper': {
                            width: '85%',
                            maxWidth: 320,
                            borderRadius: 0,
                            background: 'rgba(255, 255, 255, 0.97)'
                        }
                    }}
                >
                    <DrawerContent
                        user={user}
                        currentView={currentView}
                        handleViewChange={handleViewChange}
                        handleLogout={handleLogout}
                        isMobile={isMobile}
                        isExtraSmall={isExtraSmall}
                        handleDrawerToggle={handleDrawerToggle}
                    />
                </Drawer>
            ) : (
                // Desktop Drawer
                <DesktopDrawer
                    variant="permanent"
                    open={open}
                >
                    <DrawerContent
                        user={user}
                        currentView={currentView}
                        handleViewChange={handleViewChange}
                        handleLogout={handleLogout}
                        isMobile={isMobile}
                        isExtraSmall={isExtraSmall}
                        handleDrawerToggle={handleDrawerToggle}
                    />
                </DesktopDrawer>
            )}

            <ContentContainer open={open}>
                {renderContent()}
            </ContentContainer>
        </Box>
    );
};

export default Dashboard;