import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
    Box,
    Button,
    CircularProgress,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';

interface AIEnhancementProps {
    aiPrompt: string;
    isProcessingAi: boolean;
    onPromptChange: (value: string) => void;
    onEnhance: () => void;
}

const AIEnhancement: React.FC<AIEnhancementProps> = ({ 
    aiPrompt, 
    isProcessingAi, 
    onPromptChange, 
    onEnhance 
}) => {
    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'rgba(33, 150, 243, 0.05)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                    ЖИ көмегімен сұрақты жақсарту
                </Typography>
            </Box>
            
            <TextField
                fullWidth
                label="ЖИ үшін нұсқаулықты енгізіңіз"
                placeholder="Мысалы: Сұрақты күрделірек етіңіз, көбірек контекст қосыңыз, жауаптарды жақсартыңыз..."
                value={aiPrompt}
                onChange={(e) => onPromptChange(e.target.value)}
                multiline
                rows={2}
                sx={{ mb: 2 }}
                disabled={isProcessingAi}
            />
            
            <Button
                variant="contained"
                color="primary"
                startIcon={isProcessingAi ? <CircularProgress size={20} color="inherit" /> : <SmartToyIcon />}
                onClick={onEnhance}
                disabled={!aiPrompt.trim() || isProcessingAi}
                sx={{ width: '100%' }}
            >
                {isProcessingAi ? 'ЖИ сұранысты өңдеуде...' : 'ЖИ қолдану'}
            </Button>
        </Paper>
    );
};

export default AIEnhancement;
