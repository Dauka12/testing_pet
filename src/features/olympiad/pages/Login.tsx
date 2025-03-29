import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { Provider } from 'react-redux';
import LanguageToggle from '../components/LanguageToggle.tsx'; // Add import
import LoginForm from '../components/LoginForm.tsx';
import { olympiadStore } from '../store/index.ts';

const Login: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Provider store={olympiadStore}>
            <Container maxWidth={false} disableGutters>
                <Box
                    sx={{
                        width: '100%',
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        py: 5,
                        backgroundImage: 'linear-gradient(135deg, #1A2751 0%, #13203f 100%)',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle, transparent 20%, #1A2751 80%)',
                            opacity: 0.6,
                        }}
                    />
                    
                    {/* Add LanguageToggle */}
                    <LanguageToggle />
                    
                    <LoginForm />
                </Box>
            </Container>
        </Provider>
    );
};

export default Login;