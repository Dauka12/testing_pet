import {
    Box,
    FormControl,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    Typography
} from '@mui/material';
import React from 'react';
import { SessionExamQuestionResponse } from '../types/testSession';

interface TestQuestionProps {
    question: SessionExamQuestionResponse;
    selectedOptionId: number | null;
    onSelectOption: (questionId: number, optionId: number) => void;
}

const TestQuestion: React.FC<TestQuestionProps> = ({
    question,
    selectedOptionId,
    onSelectOption
}) => {
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSelectOption(question.id, parseInt(event.target.value));
    };

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
                <Typography variant="h6" gutterBottom>
                    {question.questionRus}
                </Typography>
            </Paper>

            <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
                <RadioGroup
                    value={selectedOptionId?.toString() || ""}
                    onChange={handleOptionChange}
                >
                    {question.options.map((option) => (
                        <Paper 
                            key={option.id} 
                            elevation={0} 
                            sx={{ 
                                mb: 2, 
                                p: 2, 
                                border: '1px solid',
                                borderColor: selectedOptionId === option.id ? 'primary.main' : 'divider',
                                borderRadius: 2,
                                bgcolor: selectedOptionId === option.id ? 'primary.light' : 'white',
                                transition: 'all 0.2s'
                            }}
                        >
                            <FormControlLabel
                                value={option.id.toString()}
                                control={<Radio color="primary" />}
                                label={
                                    <Typography 
                                        variant="body1" 
                                        sx={{ 
                                            fontWeight: selectedOptionId === option.id ? 600 : 400,
                                            color: selectedOptionId === option.id ? 'primary.dark' : 'text.primary' 
                                        }}
                                    >
                                        {option.nameRus}
                                    </Typography>
                                }
                                sx={{ width: '100%' }}
                            />
                        </Paper>
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default TestQuestion;