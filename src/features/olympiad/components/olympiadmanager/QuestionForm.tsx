import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { RootState } from '../../store';
import { createQuestionThunk, deleteQuestionThunk, updateQuestionThunk } from '../../store/slices/examSlice.ts';
import { ExamQuestionRequest, ExamQuestionResponse } from '../../types/exam.ts';
import AIComparisonView from './question-form/AIComparisonView';
import OptionsForm from './question-form/OptionsForm';
import QuestionList from './question-form/QuestionList';
import QuestionViewer from './question-form/QuestionViewer';

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

    const validateForm = (): boolean => {
        if (!formData.questionRus.trim()) {
            setError('Сұрақ мәтінін енгізіңіз (Орыс)');
            return false;
        }
        if (!formData.questionKaz.trim()) {
            setError('Сұрақ мәтінін енгізіңіз (Қаз)');
            return false;
        }
        if (formData.options.some(opt => !opt.nameRus.trim() || !opt.nameKaz.trim())) {
            setError('Барлық жауап нұсқалары толтырылуы керек');
            return false;
        }
        if (formData.correctOptionId === undefined || formData.correctOptionId === null) {
            setError('Дұрыс жауап нұсқасын таңдаңыз');
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
                // Find the index of the correct option in the current options array
                let correctIndex = -1;
                
                if (editingQuestion.options) {
                    // Find the option in the original question that matches the selected correctOptionId
                    const correctOption = editingQuestion.options.find(opt => opt.id === formData.correctOptionId);
                    
                    // Find the index of the matching option in the current options array
                    if (correctOption) {
                        correctIndex = formData.options.findIndex((opt, idx) => {
                            // If we're comparing with original option that has same content
                            return opt.nameRus === correctOption.nameRus && opt.nameKaz === correctOption.nameKaz;
                        });
                    }
                    
                    // If we couldn't find by content, try to find by position
                    if (correctIndex === -1) {
                        // Find the position of the option with this ID in the original options
                        const originalIndex = editingQuestion.options.findIndex(opt => opt.id === formData.correctOptionId);
                        // If we found a valid index and it's within bounds of new options, use it
                        if (originalIndex !== -1 && originalIndex < formData.options.length) {
                            correctIndex = originalIndex;
                        }
                    }
                }
                
                // If we still couldn't determine the index, default to 0
                if (correctIndex === -1) {
                    correctIndex = 0;
                    console.warn("Couldn't determine correct option index, defaulting to first option");
                }
                
                // Create a new object with correctOptionIndex for the API
                const questionDataForUpdate = {
                    ...formData,
                    correctOptionIndex: correctIndex,
                };

                await dispatch(updateQuestionThunk({
                    questionData: questionDataForUpdate,
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
            setError('Сұрақты сақтау кезінде қате орын алды');
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        if (window.confirm('Бұл сұрақты жойғыңыз келетініне сенімдісіз бе?')) {
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

    return (
        <Box>
            {/* Question List Section */}
            {currentExam && currentExam.questions && currentExam.questions.length > 0 && (
                <QuestionList 
                    questions={currentExam.questions}
                    onView={handleViewQuestion}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    editingQuestionId={editingQuestion?.id}
                />
            )}

            {/* Question Viewer */}
            {viewingQuestion && (
                <QuestionViewer
                    question={viewingQuestion}
                    onClose={() => setViewingQuestion(null)}
                    onEdit={handleEditQuestion}
                />
            )}

            {/* Question Form */}
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    {editingQuestion ? 'Сұрақты өңдеу' : 'Жаңа сұрақ қосу'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* AI Comparison View */}
                {showComparisonView && originalQuestion && enhancedQuestion && (
                    <AIComparisonView
                        originalQuestion={originalQuestion}
                        enhancedQuestion={enhancedQuestion}
                        onAccept={() => {
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
                        }}
                        onCancel={() => {
                            setShowComparisonView(false);
                            setAiPrompt('');
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
                        }}
                    />
                )}

                {/* Regular question form */}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Сұрақ (Қаз)"
                                name="questionKaz"
                                value={formData.questionKaz}
                                onChange={handleQuestionChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Сұрақ (Орыс)"
                                name="questionRus"
                                value={formData.questionRus}
                                onChange={handleQuestionChange}
                                multiline
                                rows={3}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle1" gutterBottom>
                                Жауап нұсқалары
                            </Typography>

                            <OptionsForm
                                options={formData.options}
                                correctOptionId={formData.correctOptionId}
                                editingQuestion={editingQuestion}
                                onOptionChange={(index, field, value) => {
                                    const newOptions = [...formData.options];
                                    newOptions[index][field] = value;
                                    setFormData(prev => ({ ...prev, options: newOptions }));
                                }}
                                onCorrectOptionChange={(index) => {
                                    let correctId = index;
                                    if (editingQuestion && editingQuestion.options && editingQuestion.options[index]) {
                                        correctId = editingQuestion.options[index].id;
                                    }
                                    setFormData(prev => ({ ...prev, correctOptionId: correctId }));
                                }}
                                onAddOption={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        options: [...prev.options, { nameRus: '', nameKaz: '' }]
                                    }));
                                }}
                                onRemoveOption={(index) => {
                                    if (formData.options.length <= 2) {
                                        setError('Кемінде 2 жауап нұсқасы болуы керек');
                                        return;
                                    }

                                    const newOptions = formData.options.filter((_, i) => i !== index);
                                    setFormData(prev => ({
                                        ...prev,
                                        options: newOptions,
                                        correctOptionId: prev.correctOptionId === index ? 0 : prev.correctOptionId > index ? prev.correctOptionId - 1 : prev.correctOptionId
                                    }));
                                }}
                            />
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
                                        Бас тарту
                                    </Button>
                                )}
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    {editingQuestion ? 'Өзгерістерді сақтау' : 'Сұрақ қосу'}
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