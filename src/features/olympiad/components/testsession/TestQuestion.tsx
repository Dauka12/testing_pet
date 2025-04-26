import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Card, CardContent, FormControlLabel, IconButton, Radio, RadioGroup, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SessionExamQuestionResponse } from '../../types/testSession';

interface TestQuestionProps {
    question: SessionExamQuestionResponse;
    selectedOptionId: number | null;
    onSelectOption: (questionId: number, optionId: number) => void;
    onClearAnswer: (questionId: number) => void;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
    question,
    selectedOptionId,
    onSelectOption,
    onClearAnswer
}) => {
    const { t, i18n } = useTranslation();
    const[language, setLanguage] = useState(i18n.language); 

    useEffect(() => {
        console.log('question: ', question);
        setLanguage(i18n.language);
        
    },[i18n.language])
    
    return (
        <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" gutterBottom fontWeight={500}>
                    {language === 'ru' ? question.questionRus : question.questionKaz }
                    </Typography>
                    
                    {selectedOptionId && (
                        <Tooltip title="Очистить ответ">
                            <IconButton 
                                onClick={() => onClearAnswer(question.id)}
                                color="error"
                                size="small"
                                sx={{ 
                                    borderRadius: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(211, 47, 47, 0.08)'
                                    }
                                }}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <RadioGroup
                    value={selectedOptionId || ''}
                    onChange={(e) => onSelectOption(question.id, Number(e.target.value))}
                >
                    {question.options.map((option) => (
                        <FormControlLabel
                            key={option.id}
                            value={option.id}
                            control={<Radio />}
                            label={language === 'ru' ? option.nameRus : option.nameKaz }
                            sx={{
                                my: 1,
                                p: 1,
                                borderRadius: 2,
                                width: '100%',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    backgroundColor: 'rgba(26, 39, 81, 0.04)',
                                },
                                ...(selectedOptionId === option.id && {
                                    backgroundColor: 'rgba(26, 39, 81, 0.08)',
                                })
                            }}
                        />
                    ))}
                </RadioGroup>

                {!selectedOptionId && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Выберите один из вариантов ответа
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TestQuestion;