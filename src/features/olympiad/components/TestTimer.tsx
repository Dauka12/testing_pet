import { TimerOutlined } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

interface TestTimerProps {
    remainingSeconds: number;
    onTimeExpired?: () => void;
}

const TestTimer: React.FC<TestTimerProps> = ({ remainingSeconds: initialSeconds, onTimeExpired }) => {
    const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

    useEffect(() => {
        setRemainingSeconds(initialSeconds);

        // Update the timer every second
        const timer = setInterval(() => {
            setRemainingSeconds(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    if (onTimeExpired) {
                        onTimeExpired();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [initialSeconds, onTimeExpired]);

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const getColorByTime = () => {
        if (remainingSeconds <= 60) return 'error';
        if (remainingSeconds <= 300) return 'warning';
        return 'inherit';
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="flex-end">
            <TimerOutlined sx={{ mr: 1, color: getColorByTime() }} />
            <Typography variant="h6" component="div" color={getColorByTime()}>
                {formatTime(remainingSeconds)}
            </Typography>
        </Box>
    );
};

export default TestTimer;