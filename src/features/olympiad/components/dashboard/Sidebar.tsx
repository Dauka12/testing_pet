import {
    AssignmentOutlined,
    ChevronLeftOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuOutlined,
    TranslateOutlined
} from '@mui/icons-material';
import {
    Box,
    Button,
    ButtonGroup,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
    SwipeableDrawer,
    Typography,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import InfoCard from './InfoCard';
import ProfileCard from './ProfileCard';

// Drawer width
const drawerWidth = 300;

const StyledDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    width: open ? drawerWidth : 0,
    flexShrink: 0,
    transition: theme.transitions.create(['width', 'transform'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.standard,
    }),
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        background: '#ffffff',
        borderRight: 'none',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        overflowX: 'hidden',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
        })
    },
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        background: '#ffffff',
        borderRight: 'none',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
    },
}));

const ToggleButton = styled(motion.button)(({ theme }) => ({
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1300,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
    },
    [theme.breakpoints.down('sm')]: {
        top: 12,
        left: 12,
    }
}));

const MenuItemButton = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 12,
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    '&.Mui-selected': {
        backgroundColor: theme.palette.primary.light + '15',
        '&:hover': {
            backgroundColor: theme.palette.primary.light + '25',
        }
    },
    '&:hover': {
        backgroundColor: theme.palette.grey[100],
    }
}));

const LogoutButton = styled(motion.button)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1.6, 2.5),
    fontSize: '0.98rem',
    fontWeight: 600,
    backgroundColor: '#ffffff',
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.error.main + '10',
        boxShadow: '0 4px 14px rgba(211, 47, 47, 0.15)',
    }
}));

const LanguageSelector = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    border: '1px solid',
    borderColor: theme.palette.divider,
}));

interface SidebarProps {
    open: boolean;
    currentView: string;
    user: any;
    onDrawerToggle: () => void;
    onViewChange: (view: string) => void;
    onLogout: () => void;
    isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    open,
    currentView,
    user,
    onDrawerToggle,
    onViewChange,
    onLogout,
    isMobile
}) => {
    const theme = useTheme();
    const fullName = `${user.lastname} ${user.firstname}`;
    const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const navigate = useNavigate();
    
    // Check if user has admin role
    const isAdmin = user.role && ['teacher', 'TEACHER', 'Teacher'].includes(user.role);
    
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    }

    const handleViewChange = (view: string) => {
        onViewChange(view);
    };
    
    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: open ? 3 : 0 }}>
            <ProfileCard fullName={fullName} />

            <LanguageSelector
                component={motion.div}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 70,
                    delay: 0.2
                }}
                elevation={0}
            >
                <TranslateOutlined 
                    sx={{ 
                        color: theme.palette.primary.main,
                        mr: 1.5,
                        fontSize: 20
                    }} 
                />
                <Typography variant="body2" sx={{ mr: 2, fontWeight: 500 }}>
                    {t('language.' + language)}
                </Typography>
                <ButtonGroup size="small" variant="outlined">
                    <Button 
                        onClick={() => changeLanguage('ru')}
                        variant={language === 'ru' ? 'contained' : 'outlined'}
                        sx={{ 
                            minWidth: '40px',
                            fontWeight: language === 'ru' ? 600 : 400,
                        }}
                    >
                        RU
                    </Button>
                    <Button 
                        onClick={() => changeLanguage('kz')}
                        variant={language === 'kz' ? 'contained' : 'outlined'}
                        sx={{ 
                            minWidth: '40px',
                            fontWeight: language === 'kz' ? 600 : 400,
                        }}
                    >
                        KZ
                    </Button>
                </ButtonGroup>
            </LanguageSelector>

            {/* Navigation menu */}
            <Paper
                component={motion.div}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 70,
                    delay: 0.25
                }}
                elevation={0}
                sx={{
                    p: 2,
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: 'divider',
                    background: '#ffffff',
                    mb: 4
                }}
            >
                <List component="nav" sx={{ p: 1 }}>
                    <MenuItemButton
                        selected={currentView === 'dashboard'}
                        onClick={() => handleViewChange('dashboard')}
                    >
                        <ListItemIcon>
                            <DashboardOutlined sx={{ 
                                color: currentView === 'dashboard' ? theme.palette.primary.main : theme.palette.text.secondary 
                            }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={t('sidebar.main')}
                            primaryTypographyProps={{
                                fontWeight: currentView === 'dashboard' ? 600 : 400,
                                color: currentView === 'dashboard' ? theme.palette.primary.main : 'inherit'
                            }}
                        />
                    </MenuItemButton>

                    <MenuItemButton
                        selected={currentView === 'tests'}
                        onClick={() => handleViewChange('tests')}
                    >
                        <ListItemIcon>
                            <AssignmentOutlined sx={{ 
                                color: currentView === 'tests' ? theme.palette.primary.main : theme.palette.text.secondary 
                            }} />
                        </ListItemIcon>
                        <ListItemText
                            primary={t('sidebar.tests')}
                            primaryTypographyProps={{
                                fontWeight: currentView === 'tests' ? 600 : 400,
                                color: currentView === 'tests' ? theme.palette.primary.main : 'inherit'
                            }}
                        />
                    </MenuItemButton>

                    {/* Conditionally render Manager button only for admin users */}
                    {isAdmin && (
                        <MenuItemButton
                            onClick={() => navigate('/manager')}
                        >
                            <ListItemIcon>
                                <AssignmentOutlined sx={{ 
                                    color: currentView === 'manager' ? theme.palette.primary.main : theme.palette.text.secondary 
                                }} />
                            </ListItemIcon>
                            <ListItemText
                                primary={t('Менеджер')}
                                primaryTypographyProps={{
                                    fontWeight: currentView === 'manager' ? 600 : 400,
                                    color: currentView === 'manager' ? theme.palette.primary.main : 'inherit'
                                }}
                            />
                        </MenuItemButton>
                    )}
                </List>
            </Paper>

            <InfoCard user={user} />

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ p: 2, textAlign: 'center' }}>
                <LogoutButton
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onLogout}
                >
                    <LogoutOutlined style={{ marginRight: 8 }} />
                    {t('sidebar.logout')}
                </LogoutButton>
            </Box>
        </Box>
    );

    return (
        <>
            {/* Toggle Drawer Button */}
            <ToggleButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDrawerToggle}
            >
                {open ? <ChevronLeftOutlined /> : <MenuOutlined />}
            </ToggleButton>

            {/* Drawer */}
            <AnimatePresence>
                {isMobile ? (
                    <StyledSwipeableDrawer
                        variant="temporary"
                        open={open}
                        onClose={onDrawerToggle}
                        onOpen={onDrawerToggle}
                        disableBackdropTransition={!iOS}
                        disableDiscovery={iOS}
                        ModalProps={{
                            keepMounted: true, // Better mobile performance
                        }}
                    >
                        {drawerContent}
                    </StyledSwipeableDrawer>
                ) : (
                    <StyledDrawer
                        variant="permanent"
                        open={open}
                    >
                        {drawerContent}
                    </StyledDrawer>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
