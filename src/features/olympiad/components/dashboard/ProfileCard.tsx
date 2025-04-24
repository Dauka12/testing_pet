import { AccountCircleOutlined } from '@mui/icons-material';
import { styled, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const StyledProfileCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.08)',
    marginBottom: theme.spacing(4),
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
        width: 100,
        height: 100
    }
}));

interface ProfileCardProps {
    fullName: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ fullName }) => {
    const theme = useTheme();
    
    return (
        <StyledProfileCard
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
                type: 'spring',
                stiffness: 70,
                delay: 0.2
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
                <AccountCircleOutlined sx={{ fontSize: 100, color: theme.palette.primary.main }} />
            </StyledAvatar>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                    }}
                >
                    {fullName}
                </Typography>
            </motion.div>
        </StyledProfileCard>
    );
};

export default ProfileCard;
