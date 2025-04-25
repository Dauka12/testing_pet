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
                    Улучшить вопрос с помощью ИИ
                </Typography>
            </Box>
            
            <TextField
                fullWidth
                label="Введите инструкцию для ИИ"
                placeholder="Например: Сделай вопрос более сложным, добавь больше контекста, улучши варианты ответов..."
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
                {isProcessingAi ? 'ИИ обрабатывает запрос...' : 'Применить ИИ'}
            </Button>
        </Paper>
    );
};

export default AIEnhancement;
