import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Grid,
    IconButton,
    Radio,
    TextField
} from '@mui/material';
import React from 'react';
import { ExamQuestionResponse, Option } from '../../../types/exam.ts';

interface OptionsFormProps {
    options: Option[];
    correctOptionId: number;
    editingQuestion: ExamQuestionResponse | null;
    onOptionChange: (index: number, field: 'nameRus' | 'nameKaz', value: string) => void;
    onCorrectOptionChange: (index: number) => void;
    onAddOption: () => void;
    onRemoveOption: (index: number) => void;
}

const OptionsForm: React.FC<OptionsFormProps> = ({
    options,
    correctOptionId,
    editingQuestion,
    onOptionChange,
    onCorrectOptionChange,
    onAddOption,
    onRemoveOption
}) => {
    return (
        <Box>
            {options.map((option, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Radio
                        checked={correctOptionId === (editingQuestion?.options?.[index]?.id || index)}
                        onChange={() => onCorrectOptionChange(index)}
                        size="small"
                    />
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={`Вариант ${index + 1} (Рус)`}
                                value={option.nameRus}
                                onChange={(e) => onOptionChange(index, 'nameRus', e.target.value)}
                                size="small"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={`Вариант ${index + 1} (Каз)`}
                                value={option.nameKaz}
                                onChange={(e) => onOptionChange(index, 'nameKaz', e.target.value)}
                                size="small"
                                required
                            />
                        </Grid>
                    </Grid>
                    <IconButton
                        color="error"
                        onClick={() => onRemoveOption(index)}
                        disabled={options.length <= 2}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button
                startIcon={<AddIcon />}
                onClick={onAddOption}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
            >
                Добавить вариант
            </Button>
        </Box>
    );
};

export default OptionsForm;
