import { DashboardOutlined, QuizOutlined } from '@mui/icons-material';
import { Box, Button, Divider, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

interface DashboardContentProps {
    isMobile: boolean;
    onNavigateToTests: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ isMobile, onNavigateToTests }) => {
    const theme = useTheme();
    
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
                        p: isMobile ? 3 : 5,
                        borderRadius: isMobile ? 4 : 6,
                        background: 'rgba(255, 255, 255, 0.97)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                        mb: 4
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <DashboardOutlined sx={{ fontSize: 42, mr: 2.5, color: theme.palette.primary.main }} />
                        <Typography
                            variant="h3"
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

                    <Divider sx={{ mb: 4 }} />

                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                        Добро пожаловать в систему олимпиады!
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, fontSize: '1.1rem' }}
                    >
                        Здесь вы сможете отслеживать свой прогресс, управлять профилем и проходить тесты олимпиады.
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
                                p: isMobile ? 3 : 5,
                                borderRadius: isMobile ? 4 : 6,
                                background: 'rgba(255, 255, 255, 0.97)',
                                backdropFilter: 'blur(15px)',
                                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                                mb: 4
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <QuizOutlined sx={{ fontSize: 24, mr: 2, color: theme.palette.primary.main, mt: 0.5 }} />
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                        Тесты олимпиады
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.05rem' }}
                                    >
                                        Перейдите в раздел "Тесты" в боковом меню, чтобы просмотреть доступные тесты и начать их прохождение.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                        onClick={onNavigateToTests}
                                    >
                                        Перейти к тестам
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </motion.div>
                </Paper>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Paper
                    elevation={0}
                    sx={{
                        p: isMobile ? 3 : 5,
                        borderRadius: isMobile ? 4 : 6,
                        background: 'rgba(255, 255, 255, 0.97)',
                        backdropFilter: 'blur(15px)',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                        mb: 4
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            mb: 4,
                            fontWeight: 600,
                            color: theme.palette.primary.main
                        }}
                    >
                        Предстоящие события
                    </Typography>

                    <Box sx={{ p: 5, textAlign: 'center' }}>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ fontSize: '1.1rem' }}
                        >
                            Информация о предстоящих событиях будет отображаться здесь
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </motion.div>
    );
};

export default DashboardContent;
