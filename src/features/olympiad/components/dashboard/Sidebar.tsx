import {
    AssignmentOutlined,
    ChevronLeftOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuOutlined
} from '@mui/icons-material';
import {
    Box,
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    styled,
    useTheme
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
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
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        background: 'rgba(255, 255, 255, 0.97)',
        borderRight: 'none',
        borderTopRightRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
        overflowX: 'hidden',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: theme.transitions.create(['width', 'transform'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        })
    },
}));

const ToggleButton = styled(motion.button)(({ theme }) => ({
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 1300,
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
    border: 'none',
    borderRadius: '50%',
    width: 56,
    height: 56,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.primary.dark,
    },
    [theme.breakpoints.down('sm')]: {
        top: 10,
        left: 10,
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
    }
}));

const LogoutButton = styled(motion.button)(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(1.6, 2.5),
    fontSize: '0.98rem',
    fontWeight: 600,
    backgroundColor: theme.palette.error.main,
    color: 'white',
    border: 'none',
    borderRadius: 14,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'none',
    boxShadow: '0 6px 16px rgba(211, 47, 47, 0.25)',
    '&:hover': {
        boxShadow: '0 8px 20px rgba(211, 47, 47, 0.35)',
        backgroundColor: theme.palette.error.dark,
    }
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
    
    return (
        <>
            {/* Toggle Drawer Button */}
            <ToggleButton
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDrawerToggle}
            >
                {open ? <ChevronLeftOutlined /> : <MenuOutlined />}
            </ToggleButton>

            {/* Drawer */}
            <AnimatePresence>
                <StyledDrawer
                    variant={isMobile ? "temporary" : "permanent"}
                    open={open}
                    onClose={isMobile ? onDrawerToggle : undefined}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: open ? 1 : 0 }}>
                        <ProfileCard fullName={fullName} />

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
                                p: 3,
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.97)',
                                backdropFilter: 'blur(15px)',
                                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                                mb: 4
                            }}
                        >
                            <List component="nav" sx={{ p: 1 }}>
                                <MenuItemButton
                                    selected={currentView === 'dashboard'}
                                    onClick={() => onViewChange('dashboard')}
                                >
                                    <ListItemIcon>
                                        <DashboardOutlined sx={{ color: currentView === 'dashboard' ? theme.palette.primary.main : 'inherit' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Главная"
                                        primaryTypographyProps={{
                                            fontWeight: currentView === 'dashboard' ? 600 : 400,
                                            color: currentView === 'dashboard' ? theme.palette.primary.main : 'inherit'
                                        }}
                                    />
                                </MenuItemButton>

                                <MenuItemButton
                                    selected={currentView === 'tests'}
                                    onClick={() => onViewChange('tests')}
                                >
                                    <ListItemIcon>
                                        <AssignmentOutlined sx={{ color: currentView === 'tests' ? theme.palette.primary.main : 'inherit' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Тесты"
                                        primaryTypographyProps={{
                                            fontWeight: currentView === 'tests' ? 600 : 400,
                                            color: currentView === 'tests' ? theme.palette.primary.main : 'inherit'
                                        }}
                                    />
                                </MenuItemButton>
                            </List>
                        </Paper>

                        <InfoCard user={user} />

                        <Box sx={{ flexGrow: 1 }} />

                        <Box sx={{ p: 4 }}>
                            <LogoutButton
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={onLogout}
                            >
                                <LogoutOutlined style={{ marginRight: 8 }} />
                                Выйти из системы
                            </LogoutButton>
                        </Box>
                    </Box>
                </StyledDrawer>
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
