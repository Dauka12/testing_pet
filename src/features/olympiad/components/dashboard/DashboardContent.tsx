import { DashboardOutlined, QuizOutlined, TipsAndUpdatesOutlined } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Divider, Grid, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardContentProps {
    isMobile: boolean;
    onNavigateToTests: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ isMobile, onNavigateToTests }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    
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
                            width: 70,
                            height: 70,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.light + '15',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <DashboardOutlined sx={{ fontSize: 35, color: theme.palette.primary.main }} />
                        </Box>
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.primary.main
                            }}
                        >
                            {t('dashboard.title')}
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={7}>
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                {t('dashboard.welcome')}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ mb: 3, fontSize: '1.05rem', lineHeight: 1.6 }}
                            >
                                {t('dashboard.description')}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={onNavigateToTests}
                                sx={{ 
                                    borderRadius: 2, 
                                    textTransform: 'none', 
                                    fontWeight: 600,
                                    px: 4,
                                    py: 1.2,
                                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)'
                                }}
                            >
                                {t('dashboard.goToTests')}
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={5}>
                        </Grid>
                    </Grid>
                </Paper>
            </motion.div>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                background: '#ffffff',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.secondary.light + '15',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mr: 2
                                }}>
                                    <TipsAndUpdatesOutlined sx={{ fontSize: 24, color: theme.palette.secondary.main }} />
                                </Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {t('dashboard.tips')}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                                <Card 
                                    elevation={0}
                                    sx={{ 
                                        mb: 2, 
                                        borderRadius: 3,
                                        backgroundColor: theme.palette.grey[50],
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                                            {t('dashboard.tipTitle1')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('dashboard.tipDesc1')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                                
                                <Card 
                                    elevation={0}
                                    sx={{ 
                                        mb: 2, 
                                        borderRadius: 3,
                                        backgroundColor: theme.palette.grey[50],
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                                            {t('dashboard.tipTitle2')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('dashboard.tipDesc2')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
                
                <Grid item xs={12} md={5}>
                    <motion.div variants={itemVariants}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                background: '#ffffff',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.06)',
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Box sx={{
                                    width: 45,
                                    height: 45,
                                    borderRadius: '50%',
                                    backgroundColor: theme.palette.primary.light + '15',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mr: 2
                                }}>
                                    <QuizOutlined sx={{ fontSize: 24, color: theme.palette.primary.main }} />
                                </Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {t('dashboard.quickAccess')}
                                </Typography>
                            </Box>
                            
                            <Box sx={{ 
                                p: 3, 
                                textAlign: 'center',
                                borderRadius: 3,
                                backgroundColor: theme.palette.primary.light + '08',
                                border: '1px dashed',
                                borderColor: theme.palette.primary.light,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Typography variant="body1" fontWeight={500} gutterBottom>
                                    {t('dashboard.readyToStart')}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={onNavigateToTests}
                                    sx={{ 
                                        borderRadius: 2, 
                                        textTransform: 'none', 
                                        fontWeight: 600,
                                        px: 4
                                    }}
                                >
                                    {t('dashboard.goToTests')}
                                </Button>
                            </Box>
                        </Paper>
                    </motion.div>
                </Grid>
            </Grid>
        </motion.div>
    );
};

export default DashboardContent;
