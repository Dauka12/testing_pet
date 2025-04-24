import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Radio,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { RootState } from '../../store';
import { createQuestionThunk, deleteQuestionThunk, updateQuestionThunk, updateQuestionWithAiThunk } from '../../store/slices/examSlice.ts';
import { ExamQuestionRequest, ExamQuestionResponse } from '../../types/exam.ts';

interface QuestionFormProps {
    testId: number;
    question?: ExamQuestionResponse;
    onSuccess: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ testId, question, onSuccess }) => {
    const dispatch = useAppDispatch();
    const { currentExam, loading } = useAppSelector((state: RootState) => state.exam);
    const [viewingQuestion, setViewingQuestion] = useState<ExamQuestionResponse | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<ExamQuestionResponse | null>(null);
    
    // AI enhancement related state
    const [aiPrompt, setAiPrompt] = useState<string>('');
    const [isProcessingAi, setIsProcessingAi] = useState<boolean>(false);
    const [originalQuestion, setOriginalQuestion] = useState<ExamQuestionResponse | null>(null);
    const [enhancedQuestion, setEnhancedQuestion] = useState<ExamQuestionResponse | null>(null);
    const [showComparisonView, setShowComparisonView] = useState<boolean>(false);

    const [formData, setFormData] = useState<ExamQuestionRequest>({
        questionRus: question?.questionRus || '',
        questionKaz: question?.questionKaz || '',
        options: question?.options?.map(opt => ({
            nameRus: opt.nameRus,
            nameKaz: opt.nameKaz
        })) || [{ nameRus: '', nameKaz: '' }, { nameRus: '', nameKaz: '' }],
        correctOptionId: question?.correctOptionId || 0
    });

    const [error, setError] = useState('');

    useEffect(() => {
        if (editingQuestion) {
            setFormData({
                questionRus: editingQuestion.questionRus || '',
                questionKaz: editingQuestion.questionKaz || '',
                options: editingQuestion.options?.map(opt => ({
                    nameRus: opt.nameRus,
                    nameKaz: opt.nameKaz
                })) || [{ nameRus: '', nameKaz: '' }, { nameRus: '', nameKaz: '' }],
                correctOptionId: editingQuestion.correctOptionId || 0
            });
            
            // Reset AI state when a new question is being edited
            setAiPrompt('');
            setShowComparisonView(false);
            setEnhancedQuestion(null);
        }
    }, [editingQuestion]);

    // If enhanced question is available, update the form data
    useEffect(() => {
        if (enhancedQuestion && !showComparisonView) {
            setFormData({
                questionRus: enhancedQuestion.questionRus || '',
                questionKaz: enhancedQuestion.questionKaz || '',
                options: enhancedQuestion.options?.map(opt => ({
                    nameRus: opt.nameRus,
                    nameKaz: opt.nameKaz
                })) || [{ nameRus: '', nameKaz: '' }],
                correctOptionId: enhancedQuestion.correctOptionId || 0
            });
        }
    }, [enhancedQuestion, showComparisonView]);

    const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index: number, field: 'nameRus' | 'nameKaz', value: string) => {
        const newOptions = [...formData.options];
        newOptions[index][field] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleCorrectOptionChange = (index: number) => {
        let correctId = index;
        if (editingQuestion && editingQuestion.options && editingQuestion.options[index]) {
            correctId = editingQuestion.options[index].id;
        }
        setFormData(prev => ({ ...prev, correctOptionId: correctId }));
    };

    const addOption = () => {
        setFormData(prev => ({
            ...prev,
            options: [...prev.options, { nameRus: '', nameKaz: '' }]
        }));
    };

    const removeOption = (index: number) => {
        if (formData.options.length <= 2) {
            setError('Должно быть минимум 2 варианта ответа');
            return;
        }

        const newOptions = formData.options.filter((_, i) => i !== index);
        setFormData(prev => ({
            ...prev,
            options: newOptions,
            correctOptionId: prev.correctOptionId === index ? 0 : prev.correctOptionId > index ? prev.correctOptionId - 1 : prev.correctOptionId
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.questionRus.trim()) {
            setError('Введите текст вопроса (Рус)');
            return false;
        }
        if (!formData.questionKaz.trim()) {
            setError('Введите текст вопроса (Каз)');
            return false;
        }
        if (formData.options.some(opt => !opt.nameRus.trim() || !opt.nameKaz.trim())) {
            setError('Все варианты ответов должны быть заполнены');
            return false;
        }
        if (formData.correctOptionId === undefined || formData.correctOptionId === null) {
            setError('Выберите правильный вариант ответа');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            if (editingQuestion?.id) {
                await dispatch(updateQuestionThunk({
                    questionData: formData,
                    id: editingQuestion.id
                }));
            } else {
                await dispatch(createQuestionThunk({
                    questionData: formData,
                    testId
                }));
            }
            // Reset form after successful submission
            setFormData({
                questionRus: '',
                questionKaz: '',
                options: [{ nameRus: '', nameKaz: '' }, { nameRus: '', nameKaz: '' }],
                correctOptionId: 0
            });
            setEditingQuestion(null);
            setShowComparisonView(false);
            setEnhancedQuestion(null);
            setOriginalQuestion(null);
            onSuccess();
        } catch (error) {
            console.error('Error submitting question:', error);
            setError('Произошла ошибка при сохранении вопроса');
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
            await dispatch(deleteQuestionThunk(questionId));
            if (editingQuestion?.id === questionId) {
                setEditingQuestion(null);
                setFormData({
                    questionRus: '',
                    questionKaz: '',
                    options: [{ nameRus: '', nameKaz: '' }, { nameRus: '', nameKaz: '' }],
                    correctOptionId: 0
                });
                setShowComparisonView(false);
                setEnhancedQuestion(null);
                setOriginalQuestion(null);
            }
            if (viewingQuestion?.id === questionId) {
                setViewingQuestion(null);
            }
            onSuccess();
        }
    };

    const handleEditQuestion = (question: ExamQuestionResponse) => {
        setEditingQuestion(question);
        setViewingQuestion(null);
        setShowComparisonView(false);
        setEnhancedQuestion(null);
        setOriginalQuestion(null);
    };

    const handleViewQuestion = (question: ExamQuestionResponse) => {
        setViewingQuestion(question);
        setEditingQuestion(null);
        setShowComparisonView(false);
        setEnhancedQuestion(null);
        setOriginalQuestion(null);
    };

    const handleCancelEdit = () => {
        setEditingQuestion(null);
        setFormData({
            questionRus: '',
            questionKaz: '',
            options: [{ nameRus: '', nameKaz: '' }, { nameRus: '', nameKaz: '' }],
            correctOptionId: 0
        });
        setShowComparisonView(false);
        setEnhancedQuestion(null);
        setOriginalQuestion(null);
    };

    // AI enhancement handlers
    const handleAiPromptChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAiPrompt(e.target.value);
    };

    const handleAiEnhancement = async () => {
        if (!editingQuestion?.id || !aiPrompt.trim()) {
            setError('Необходим текст промпта для улучшения вопроса с помощью ИИ');
            return;
        }

        setIsProcessingAi(true);
        setError('');
        setOriginalQuestion({ ...editingQuestion });

        try {
            const result = await dispatch(updateQuestionWithAiThunk({
                questionId: editingQuestion.id,
                prompt: aiPrompt
            })).unwrap();
            
            setEnhancedQuestion(result);
            setShowComparisonView(true);
        } catch (error) {
            console.error('Error enhancing question with AI:', error);
            setError('Произошла ошибка при обработке запроса ИИ');
        } finally {
            setIsProcessingAi(false);
        }
    };

    const acceptAiChanges = () => {
        if (enhancedQuestion) {
            setFormData({
                questionRus: enhancedQuestion.questionRus || '',
                questionKaz: enhancedQuestion.questionKaz || '',
                options: enhancedQuestion.options?.map(opt => ({
                    nameRus: opt.nameRus,
                    nameKaz: opt.nameKaz
                })) || [],
                correctOptionId: enhancedQuestion.correctOptionId || 0
            });
            setShowComparisonView(false);
        }
    };

    const cancelAiChanges = () => {
        setShowComparisonView(false);
        setAiPrompt('');
        // Restore original form data if cancelling
        if (originalQuestion) {
            setFormData({
                questionRus: originalQuestion.questionRus || '',
                questionKaz: originalQuestion.questionKaz || '',
                options: originalQuestion.options?.map(opt => ({
                    nameRus: opt.nameRus,
                    nameKaz: opt.nameKaz
                })) || [],
                correctOptionId: originalQuestion.correctOptionId || 0
            });
        }
    };

    return (
        <Box>
            {/* Question List Section */}
            {currentExam && currentExam.questions && currentExam.questions.length > 0 && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Вопросы экзамена ({currentExam.questions.length})
                    </Typography>
                    <List>
                        {currentExam.questions.map((q) => (
                            <ListItem
                                key={q.id}
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: editingQuestion?.id === q.id ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                                }}
                            >
                                <ListItemText
                                    primary={q.questionRus}
                                    secondary={`${q.options.length} вариантов ответа`}
                                />
                                <ListItemSecondaryAction>
                                    <Tooltip title="Просмотреть">
                                        <IconButton edge="end" onClick={() => handleViewQuestion(q)}>
                                            <VisibilityIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Редактировать">
                                        <IconButton edge="end" onClick={() => handleEditQuestion(q)}>
                                            <EditIcon color="secondary" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Удалить">
                                        <IconButton edge="end" onClick={() => handleDeleteQuestion(q.id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Tooltip>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {/* Question Viewer */}
            {viewingQuestion && (
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Просмотр вопроса
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => setViewingQuestion(null)}
                        >
                            Закрыть
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1">Вопрос (Рус):</Typography>
                            <Typography paragraph>{viewingQuestion.questionRus}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1">Вопрос (Каз):</Typography>
                            <Typography paragraph>{viewingQuestion.questionKaz}</Typography>
                        </Grid>
                    </Grid>

                    <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Варианты ответов:</Typography>
                    <List>
                        {viewingQuestion.options.map((option, index) => (
                            <ListItem
                                key={option.id}
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    mb: 1,
                                    bgcolor: option.id === viewingQuestion.correctOptionId ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
                                }}
                            >
                                <Radio
                                    checked={option.id === viewingQuestion.correctOptionId}
                                    disabled
                                    size="small"
                                />
                                <ListItemText
                                    primary={(
                                        <Box>
                                            <Typography component="span" fontWeight={option.id === viewingQuestion.correctOptionId ? 'bold' : 'normal'}>
                                                {option.nameRus}
                                            </Typography>
                                            {option.id === viewingQuestion.correctOptionId && (
                                                <Typography component="span" color="success.main" sx={{ ml: 1 }}>
                                                    (правильный ответ)
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                    secondary={option.nameKaz}
                                />
                            </ListItem>
                        ))}
                    </List>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setViewingQuestion(null);
                                handleEditQuestion(viewingQuestion);
                            }}
                        >
                            Редактировать этот вопрос
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Question Form */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editingQuestion ? 'Редактировать вопрос' : 'Добавить новый вопрос'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* AI Enhancement Section - only shown when editing a question */}
                {editingQuestion && !showComparisonView && (
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
                            onChange={handleAiPromptChange}
                            multiline
                            rows={2}
                            sx={{ mb: 2 }}
                            disabled={isProcessingAi}
                        />
                        
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={isProcessingAi ? <CircularProgress size={20} color="inherit" /> : <SmartToyIcon />}
                            onClick={handleAiEnhancement}
                            disabled={!aiPrompt.trim() || isProcessingAi}
                            sx={{ width: '100%' }}
                        >
                            {isProcessingAi ? 'ИИ обрабатывает запрос...' : 'Применить ИИ'}
                        </Button>
                    </Paper>
                )}

                {/* AI Comparison View */}
                <AnimatePresence>
                    {showComparisonView && originalQuestion && enhancedQuestion && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    mb: 2,
                                    p: 1,
                                    bgcolor: 'rgba(33, 150, 243, 0.1)',
                                    borderRadius: 1,
                                }}>
                                    <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="subtitle1" fontWeight="medium">
                                        Результат улучшения с помощью ИИ
                                    </Typography>
                                </Box>
                                
                                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                    Вопрос:
                                </Typography>
                                
                                <Grid container spacing={2} sx={{ mb: 3 }}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" color="text.secondary">Было:</Typography>
                                        <Paper 
                                            variant="outlined" 
                                            sx={{ p: 2, bgcolor: '#f5f5f5', height: '100%', minHeight: 100 }}
                                        >
                                            <Typography>{originalQuestion.questionRus}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="caption" color="text.secondary">Стало:</Typography>
                                        <Paper 
                                            variant="outlined" 
                                            sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.08)', height: '100%', minHeight: 100 }}
                                        >
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2, duration: 0.5 }}
                                            >
                                                <Typography>{enhancedQuestion.questionRus}</Typography>
                                            </motion.div>
                                        </Paper>
                                    </Grid>
                                </Grid>
                                
                                <Typography variant="subtitle2" gutterBottom>
                                    Варианты ответов:
                                </Typography>
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <List dense>
                                            {originalQuestion.options.map((option, i) => (
                                                <ListItem key={i} sx={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 1,
                                                    mb: 1,
                                                    bgcolor: option.id === originalQuestion.correctOptionId ? 'rgba(76, 175, 80, 0.08)' : 'transparent'
                                                }}>
                                                    <Radio
                                                        checked={option.id === originalQuestion.correctOptionId}
                                                        disabled
                                                        size="small"
                                                    />
                                                    <ListItemText 
                                                        primary={option.nameRus}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <List dense>
                                            {enhancedQuestion.options.map((option, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.1 * (i + 1) }}
                                                >
                                                    <ListItem sx={{
                                                        border: '1px solid #e0e0e0',
                                                        borderRadius: 1,
                                                        mb: 1,
                                                        bgcolor: option.id === enhancedQuestion.correctOptionId ? 'rgba(76, 175, 80, 0.08)' : 'transparent'
                                                    }}>
                                                        <Radio
                                                            checked={option.id === enhancedQuestion.correctOptionId}
                                                            disabled
                                                            size="small"
                                                        />
                                                        <ListItemText 
                                                            primary={option.nameRus}
                                                        />
                                                    </ListItem>
                                                </motion.div>
                                            ))}
                                        </List>
                                    </Grid>
                                </Grid>
                                
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                                    <Button 
                                        variant="outlined" 
                                        color="inherit" 
                                        onClick={cancelAiChanges}
                                        sx={{ mr: 2 }}
                                    >
                                        Отменить изменения
                                    </Button>
                                    
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={acceptAiChanges}
                                    >
                                        Принять изменения ИИ
                                    </Button>
                                </Box>
                            </Paper>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Regular question form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Вопрос (Рус)"
                                name="questionRus"
                                value={formData.questionRus}
                                onChange={handleQuestionChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Вопрос (Каз)"
                                name="questionKaz"
                                value={formData.questionKaz}
                                onChange={handleQuestionChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Варианты ответов
                            </Typography>

                            {formData.options.map((option, index) => (
                                <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    <Radio
                                        checked={formData.correctOptionId === (editingQuestion?.options?.[index]?.id || index)}
                                        onChange={() => handleCorrectOptionChange(index)}
                                        size="small"
                                    />
                                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={`Вариант ${index + 1} (Рус)`}
                                                value={option.nameRus}
                                                onChange={(e) => handleOptionChange(index, 'nameRus', e.target.value)}
                                                size="small"
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label={`Вариант ${index + 1} (Каз)`}
                                                value={option.nameKaz}
                                                onChange={(e) => handleOptionChange(index, 'nameKaz', e.target.value)}
                                                size="small"
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <IconButton
                                        color="error"
                                        onClick={() => removeOption(index)}
                                        disabled={formData.options.length <= 2}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}

                            <Button
                                startIcon={<AddIcon />}
                                onClick={addOption}
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1 }}
                            >
                                Добавить вариант
                            </Button>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                {editingQuestion && (
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="inherit"
                                        onClick={handleCancelEdit}
                                        sx={{ mr: 2 }}
                                    >
                                        Отмена
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    {editingQuestion ? 'Сохранить изменения' : 'Добавить вопрос'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default QuestionForm;