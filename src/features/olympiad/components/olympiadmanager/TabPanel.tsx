import { Box, CircularProgress } from '@mui/material';
import React from 'react';

interface TabPanelProps {
    children: React.ReactNode;
    index: number;
    value: number;
    loading?: boolean;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, loading = false }) => {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            sx={{ position: 'relative', minHeight: '400px' }}
        >
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10,
                        borderRadius: 2
                    }}
                >
                    <CircularProgress />
                </Box>
            )}
            {value === index && children}
        </Box>
    );
};

export default TabPanel;
