import { Box, Paper, styled, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';

const StyledInfoCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    border: '1px solid',
    borderColor: theme.palette.divider,
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
    }
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 0),
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    '&:last-child': {
        borderBottom: 'none',
        paddingBottom: 0
    },
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: theme.spacing(0.5)
    }
}));

interface InfoCardProps {
    user: {
        phone: string;
        [key: string]: any;
    };
}

const InfoCard: React.FC<InfoCardProps> = ({ user }) => {
    const theme = useTheme();
    const { t } = useTranslation();
    
    return (
        <StyledInfoCard
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 70,
                delay: 0.3
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    fontSize: '0.95rem'
                }}
            >
                {t('profile.contactInfo')}
            </Typography>

            <Paper 
                elevation={0}
                sx={{ 
                    bgcolor: theme.palette.grey[50], 
                    p: 2, 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: theme.palette.divider
                }}
            >
                <InfoItem>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            minWidth: 80,
                            color: theme.palette.text.secondary,
                            fontSize: '0.85rem'
                        }}
                    >
                        {t('profile.phone')}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 500,
                            fontSize: '0.9rem'
                        }}
                    >
                        {user.phone}
                    </Typography>
                </InfoItem>
            </Paper>
        </StyledInfoCard>
    );
};

export default InfoCard;
