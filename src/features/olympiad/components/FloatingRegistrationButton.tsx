import HowToRegIcon from '@mui/icons-material/HowToReg';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const MotionButton = motion(Button);

const FloatingRegistrationButton: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 1000,
            }}
        >
            <MotionButton
                variant="contained"
                color="primary"
                size="large"
                startIcon={<HowToRegIcon />}
                onClick={() => navigate('/olympiad/registration')}
                whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                    }
                }}
                sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                    background: 'linear-gradient(45deg, #1565C0 0%, #0D47A1 100%)'
                }}
            >
                {t('olympiad.register')}
            </MotionButton>
        </Box>
    );
};

export default FloatingRegistrationButton;