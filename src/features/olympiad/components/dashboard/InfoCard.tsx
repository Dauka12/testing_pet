import { Box, styled, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const StyledInfoCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(4),
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
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
    
    return (
        <StyledInfoCard
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
                    mb: 3,
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                    fontSize: '1.2rem'
                }}
            >
                Контактная информация
            </Typography>

            <InfoItem>
                <Typography
                    variant="subtitle2"
                    sx={{
                        width: 90,
                        color: theme.palette.text.secondary,
                        fontSize: '0.9rem'
                    }}
                >
                    Телефон
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 500,
                        fontSize: '0.95rem'
                    }}
                >
                    {user.phone}
                </Typography>
            </InfoItem>
        </StyledInfoCard>
    );
};

export default InfoCard;
