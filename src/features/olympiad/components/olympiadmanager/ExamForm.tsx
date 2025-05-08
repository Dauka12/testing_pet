import {
    Alert,
    Box,
    Button,
    Checkbox,
    Chip,
    FormControl,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ru } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../api/examApi.ts';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { createExamThunk, fetchAllExams } from '../../store/slices/examSlice.ts';
import { ExamCreateRequest } from '../../types/exam.ts';
import { TestCategory } from '../../types/testCategory.ts';

const ExamForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.exam);
    const [submitted, setSubmitted] = useState(false);
    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const [formData, setFormData] = useState<ExamCreateRequest>(() => {
        // Format current date without timezone conversion
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Create ISO-like string without the Z
        const localTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
    
        return {
            nameRus: '',
            nameKaz: '',
            typeRus: '',
            typeKaz: '',
            startTime: localTimeString,
            durationInMinutes: 60,
            questions: [],
            categories: []
        };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            // Format the date to preserve local time exactly as displayed to the user
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            
            // Create ISO-like string but WITHOUT the Z at the end
            // This indicates it's local time, not UTC
            const localTimeString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000`;
            console.log('localTimeString:', localTimeString);
             
            
            setFormData(prev => ({ 
                ...prev, 
                startTime: localTimeString
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // After successful form submission
            await dispatch(createExamThunk(formData));
            
            // Refresh the exam list
            dispatch(fetchAllExams());
            
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit the form:', error);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoriesChange = (event: SelectChangeEvent<number[]>) => {
        const selectedCategoryIds = event.target.value as number[];
        setFormData(prev => ({ ...prev, categories: selectedCategoryIds }));
    };


    useEffect(() => {
        if (submitted && !loading && !error) {
            setFormData({
                nameRus: '',
                nameKaz: '',
                typeRus: '',
                typeKaz: '',
                startTime: new Date().toISOString(),
                durationInMinutes: 60,
                questions: [],
                categories: []
            });
            setSubmitted(false);
        }
    }, [loading, error, submitted]);

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Емтихан құру
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Атауы (Қаз)"
                            name="nameKaz"
                            value={formData.nameKaz}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Атауы (Орыс)"
                            name="nameRus"
                            value={formData.nameRus}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="type-kaz-label">Түрі (Қаз)</InputLabel>
                            <Select
                                labelId="type-kaz-label"
                                name="typeKaz"
                                value={formData.typeKaz}
                                onChange={handleTypeChange}
                                label="Түрі (Қаз)"
                                required
                            >
                                <MenuItem value="Тест">Тест</MenuItem>
                                <MenuItem value="Емтихан">Емтихан</MenuItem>
                                <MenuItem value="Аралық бақылау">Аралық бақылау</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel id="type-rus-label">Түрі (Орыс)</InputLabel>
                            <Select
                                labelId="type-rus-label"
                                name="typeRus"
                                value={formData.typeRus}
                                onChange={handleTypeChange}
                                label="Түрі (Орыс)"
                                required
                            >
                                <MenuItem value="Тест">Тест</MenuItem>
                                <MenuItem value="Экзамен">Экзамен</MenuItem>
                                <MenuItem value="Промежуточный контроль">Промежуточный контроль</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                            <DateTimePicker
                                label="Басталу уақыты"
                                value={new Date(formData.startTime || '')}
                                onChange={handleDateChange}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true,
                                        variant: "outlined"
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={12}>
                        <TextField
                            label="Ұзақтығы (мин)"
                            name="durationInMinutes"
                            value={formData.durationInMinutes}
                            onChange={(e) => setFormData(prev => ({ ...prev, durationInMinutes: parseInt(e.target.value) || 0 }))}
                            fullWidth
                            required
                            variant="outlined"
                            type="number"
                            inputProps={{ min: 1 }}
                        />

                        <FormControl fullWidth margin="normal" disabled={loading || loadingCategories}>
                            <InputLabel id="categories-label">Санаттар</InputLabel>
                            <Select
                                labelId="categories-label"
                                id="categories"
                                multiple
                                value={formData.categories}
                                onChange={handleCategoriesChange}
                                input={<OutlinedInput label="Санаттар" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {(selected as number[]).map((categoryId) => {
                                            const category = categories.find(cat => cat.id === categoryId);
                                            return (
                                                <Chip
                                                    key={categoryId}
                                                    label={category ? (category.nameKaz || category.nameRus) : 'Жүктелуде...'}
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
                            >
                                {loadingCategories ? (
                                    <MenuItem disabled>Санаттар жүктелуде...</MenuItem>
                                ) : (
                                    categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            <Checkbox checked={formData.categories.indexOf(category.id) > -1} />
                                            <ListItemText primary={category.nameKaz || category.nameRus} />
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>


                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Құрылуда...' : 'Емтихан құру'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default ExamForm;