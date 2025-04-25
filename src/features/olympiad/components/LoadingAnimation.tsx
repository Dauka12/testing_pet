import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import React from 'react';

const pulse = keyframes`
    0% {
        opacity: 0.6;
        transform: scale(0.98);
    }
    50% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0.6;
        transform: scale(0.98);
    }
`;

const LoadingAnimation: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: 'background.default',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: 4,
                    animation: `${pulse} 2s infinite ease-in-out`,
                    width: { xs: '80%', sm: 400 },
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: 'primary.main',
                        mb: 3
                    }}
                />

                <Typography
                    variant="h5"
                    component="div"
                    color="primary.main"
                    fontWeight="bold"
                    sx={{ mb: 1 }}
                >
                    Загрузка...
                </Typography>
            </Paper>
        </Box>
    );
};

export default LoadingAnimation;
