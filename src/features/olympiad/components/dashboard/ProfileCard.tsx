import { Avatar, styled, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';

const StyledProfileCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: theme.spacing(4, 3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    marginBottom: theme.spacing(4),
    border: '1px solid',
    borderColor: theme.palette.divider,
}));

const StyledAvatar = styled(motion.div)(({ theme }) => ({
    width: 100,
    height: 100,
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.light + '15',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '4px solid white',
    [theme.breakpoints.down('sm')]: {
        width: 80,
        height: 80
    }
}));

interface ProfileCardProps {
    fullName: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ fullName }) => {
    const theme = useTheme();
    const initials = fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
    
    return (
        <StyledProfileCard
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
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
                <Avatar 
                    sx={{ 
                        width: '100%', 
                        height: '100%',
                        bgcolor: theme.palette.primary.main,
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}
                >
                    {initials}
                </Avatar>
            </StyledAvatar>

            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        mb: 0.5
                    }}
                >
                    {fullName}
                </Typography>
                
                <Typography
                    variant="body2"
                    sx={{
                        textAlign: 'center',
                        color: theme.palette.text.secondary,
                    }}
                >
                    Студент
                </Typography>
            </motion.div>
        </StyledProfileCard>
    );
};

export default ProfileCard;
