import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks.ts';
import { fetchQuestionById, updateQuestionWithAiThunk } from '../../store/slices/examSlice.ts';
import { ExamQuestionResponse, ExamResponse } from '../../types/exam';

interface ExamViewerProps {
    exam: ExamResponse;
    onEdit?: () => void;  // Keep this optional for backward compatibility
    onEditQuestion?: (questionId: number) => void; // New prop for editing individual questions
}

const ExamViewer: React.FC<ExamViewerProps> = ({ exam, onEdit, onEditQuestion }) => {
    const dispatch = useAppDispatch();
    
    // State for AI prompt dialog
    const [aiDialogOpen, setAiDialogOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestionResponse | null>(null);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [originalQuestion, setOriginalQuestion] = useState<ExamQuestionResponse | null>(null);
    const [updatedQuestion, setUpdatedQuestion] = useState<ExamQuestionResponse | null>(null);
    const [showComparisonView, setShowComparisonView] = useState(false);
    const [showProcessingAnimation, setShowProcessingAnimation] = useState(false);
    
    // Add new states for animated AI generation
    const [displayedText, setDisplayedText] = useState<string>('');
    const [currentCharIndex, setCurrentCharIndex] = useState<number>(0);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [optionsToAnimate, setOptionsToAnimate] = useState<number[]>([]);
    const [showOptions, setShowOptions] = useState<boolean>(true);
    const typingSpeed = 20; // ms per character

    const openAiPromptDialog = (question: ExamQuestionResponse) => {
        setSelectedQuestion(question);
        setOriginalQuestion({ ...question });
        setAiPrompt('');
        setAiDialogOpen(true);
        setShowComparisonView(false);
    };

    const closeAiPromptDialog = () => {
        setAiDialogOpen(false);
        setSelectedQuestion(null);
        setAiPrompt('');
        setShowComparisonView(false);
    };

    const handleAiPromptSubmit = async () => {
        if (!selectedQuestion || !aiPrompt.trim()) return;
        
        setIsProcessing(true);
        setShowProcessingAnimation(true);
        
        try {
            // First, update the question with AI
            await dispatch(updateQuestionWithAiThunk({
                questionId: selectedQuestion.id,
                prompt: aiPrompt
            })).unwrap();
            
            // Then fetch the updated question to get the latest data
            const result = await dispatch(fetchQuestionById(selectedQuestion.id)).unwrap();
            
            setUpdatedQuestion(result);
            setTimeout(() => {
                setShowProcessingAnimation(false);
                setShowComparisonView(true);
            }, 500); // Slight delay for smoother transition
        } catch (error) {
            console.error('Error updating question with AI:', error);
            setShowProcessingAnimation(false);
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Effect to handle the typewriter animation for AI-generated content
    useEffect(() => {
        if (showComparisonView && updatedQuestion && !isTyping) {
            setDisplayedText('');
            setCurrentCharIndex(0);
            setIsTyping(true);
            
            // Prepare option indices to animate sequentially
            setOptionsToAnimate([]);
        }
    }, [showComparisonView, updatedQuestion]);

    // Typewriter effect for the AI-generated question text
    useEffect(() => {
        if (isTyping && updatedQuestion && currentCharIndex < updatedQuestion.questionRus.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + updatedQuestion.questionRus[currentCharIndex]);
                setCurrentCharIndex(prev => prev + 1);
            }, typingSpeed);
            
            return () => clearTimeout(timer);
        } else if (isTyping && updatedQuestion && currentCharIndex >= updatedQuestion.questionRus.length) {
            setIsTyping(false);
            
            // After typing the question, prepare to animate options
            const optionIndices = updatedQuestion.options.map((_, index) => index);
            setOptionsToAnimate(optionIndices);
        }
    }, [isTyping, currentCharIndex, updatedQuestion]);

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 0 }}>
                            {exam.nameKaz || exam.nameRus}
                        </Typography>
                        {onEdit && (
                            <Tooltip title="Атауын өңдеу">
                                <IconButton
                                    color="primary"
                                    onClick={onEdit}
                                    size="small"
                                    sx={{ ml: 1 }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    
                    {/* Show the main edit button only if onEdit function is provided */}
                    <Tooltip title="Емтиханды өңдеу">
                        <IconButton
                            color="primary"
                            onClick={onEdit}
                            size="large"
                            sx={{ 
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {exam.nameRus}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Емтихан түрі:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {exam.typeKaz} / {exam.typeRus}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Басталу уақыты:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {exam.startTime ? (
                                format(new Date(exam.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })
                            ) : (
                                'Көрсетілмеген'
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Ұзақтығы:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {exam.durationInMinutes} мин
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Сұрақтар ({exam.questions?.length || 0})
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {exam.questions && exam.questions.length > 0 ? (
                    <Box>
                        {exam.questions.map((question, index) => (
                            <Accordion key={question.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box display="flex" alignItems="center" width="100%">
                                        <Typography sx={{ fontWeight: 'medium' }}>
                                            Сұрақ {index + 1}
                                        </Typography>
                                        <Chip
                                            label={`${question.options.length} жауап нұсқалары`}
                                            size="small"
                                            sx={{ ml: 2, bgcolor: 'rgba(25, 118, 210, 0.08)' }}
                                        />
                                        <Box sx={{ ml: 'auto' }}>
                                            <Tooltip title="ЖИ көмегімен жетілдіру">
                                                <IconButton 
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openAiPromptDialog(question);
                                                    }}
                                                    sx={{ mr: 1 }}
                                                >
                                                    <SmartToyIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {onEditQuestion && (
                                                <Tooltip title="Сұрақты өңдеу">
                                                    <IconButton 
                                                        color="secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditQuestion(question.id);
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Сұрақ (Қаз):
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                {question.questionKaz}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Сұрақ (Орыс):
                                            </Typography>
                                            <Typography variant="body1" paragraph>
                                                {question.questionRus}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                        Жауап нұсқалары:
                                    </Typography>

                                    <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: 'background.default' }}>
                                                    <TableCell width="5%">#</TableCell>
                                                    <TableCell width="45%">Мәтін (Қаз)</TableCell>
                                                    <TableCell width="45%">Мәтін (Орыс)</TableCell>
                                                    <TableCell width="5%">Дұрыс</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {question.options.map((option, optIndex) => (
                                                    <TableRow key={option.id} sx={{
                                                        bgcolor: option.id === question.correctOptionId ?
                                                            'rgba(76, 175, 80, 0.08)' : 'inherit'
                                                    }}>
                                                        <TableCell>{optIndex + 1}</TableCell>
                                                        <TableCell>{option.nameKaz}</TableCell>
                                                        <TableCell>{option.nameRus}</TableCell>
                                                        <TableCell align="center">
                                                            {option.id === question.correctOptionId && '✓'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Бұл емтиханға әлі сұрақтар құрылмаған.
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* AI Prompt Dialog */}
            <Dialog 
                open={aiDialogOpen} 
                onClose={closeAiPromptDialog}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    background: 'linear-gradient(90deg, #2196f3, #0d47a1)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    <SmartToyIcon /> 
                    <Typography variant="h6" component="span">
                        Жасанды интеллект көмегімен сұрақты жетілдіру
                    </Typography>
                </DialogTitle>
                
                <DialogContent sx={{ py: 3 }}>
                    <AnimatePresence mode="wait">
                        {!showComparisonView && !showProcessingAnimation ? (
                            <motion.div
                                key="prompt-form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Қазіргі сұрақ:
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
                                        <Typography>
                                            {selectedQuestion?.questionKaz || selectedQuestion?.questionRus}
                                        </Typography>
                                    </Paper>
                                    
                                    <Typography gutterBottom sx={{ mt: 3, fontWeight: 'medium' }}>
                                        ЖИ-ге сұрақты қалай жетілдіру керектігі туралы нұсқаулық енгізіңіз:
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Мысалы: Сұрақты күрделірек етіңіз, көбірек контекст қосыңыз, жауап нұсқаларын жақсартыңыз..."
                                        disabled={isProcessing}
                                        variant="outlined"
                                        sx={{ mt: 1 }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        ЖИ сіздің нұсқауларыңызға сәйкес тұжырымдамаларды өзгертуге немесе сұрақты жақсартуға көмектеседі.
                                    </Typography>
                                </Box>
                            </motion.div>
                        ) : showProcessingAnimation ? (
                            <motion.div
                                key="processing-animation"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 8,
                                    textAlign: 'center'
                                }}>
                                    <Box sx={{ position: 'relative', mb: 4, height: 100, width: 100 }}>
                                        {/* Circular pulsing animation */}
                                        <motion.div
                                            animate={{ 
                                                scale: [1, 1.2, 1],
                                                opacity: [0.7, 0.9, 0.7]
                                            }}
                                            transition={{ 
                                                repeat: Infinity, 
                                                duration: 2,
                                                ease: "easeInOut"
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                borderRadius: '50%',
                                                background: 'radial-gradient(circle, rgba(33,150,243,0.4) 0%, rgba(33,150,243,0) 70%)',
                                            }}
                                        />
                                        
                                        {/* Rotating dots around the brain */}
                                        <Box sx={{ 
                                            position: 'absolute',
                                            top: 0, 
                                            left: 0, 
                                            width: '100%', 
                                            height: '100%' 
                                        }}>
                                            {[...Array(8)].map((_, i) => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ rotate: 360 }}
                                                    transition={{ 
                                                        repeat: Infinity, 
                                                        duration: 8,
                                                        ease: "linear"
                                                    }}
                                                    style={{
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        transform: `rotate(${i * 45}deg)`,
                                                    }}
                                                >
                                                    <motion.div
                                                        animate={{ 
                                                            scale: [0.8, 1, 0.8],
                                                            opacity: [0.6, 1, 0.6]
                                                        }}
                                                        transition={{ 
                                                            repeat: Infinity, 
                                                            duration: 2,
                                                            delay: i * 0.2
                                                        }}
                                                        style={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            background: i % 3 === 0 ? '#4285F4' : 
                                                                      i % 3 === 1 ? '#EA4335' : '#34A853',
                                                            position: 'absolute',
                                                            top: 0,
                                                        }}
                                                    />
                                                </motion.div>
                                            ))}
                                        </Box>
                                        
                                        {/* Central brain icon */}
                                        <Box sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <motion.div
                                                animate={{ 
                                                    scale: [0.9, 1, 0.9],
                                                    rotate: [-2, 2, -2]
                                                }}
                                                transition={{ 
                                                    repeat: Infinity, 
                                                    duration: 3,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <SmartToyIcon 
                                                    sx={{ 
                                                        fontSize: 50,
                                                        color: 'primary.main'
                                                    }} 
                                                />
                                            </motion.div>
                                        </Box>
                                    </Box>

                                    <Typography variant="h6" color="primary.main" fontWeight="medium" gutterBottom>
                                        Жасанды интеллект сіздің сұранысыңызбен жұмыс жасауда
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '80%', mx: 'auto' }}>
                                        ЖИ сіздің сұрағыңызды талдап, нұсқауыңыз негізінде жетілдірілген нұсқасын жасауда...
                                    </Typography>
                                    
                                    {/* Animated text that shows what's happening */}
                                    <Box sx={{ mt: 4, height: 24 }}>
                                        <motion.div
                                            animate={{ opacity: [0, 1, 0] }}
                                            transition={{ repeat: Infinity, duration: 3, times: [0, 0.1, 1] }}
                                        >
                                            <Typography variant="caption" color="primary.dark">
                                                {
                                                   [
                                                    "Қазіргі сұрақты талдау",
                                                    "Контекстік жақсартуларды қолдану",
                                                    "Оңтайлы жауап нұсқаларын құру",
                                                    "Деректердің дұрыстығын тексеру",
                                                    "Тұжырымдамаларды соңғы оңтайландыру"
                                                   ]
                                                [Math.floor((Date.now() / 3000) % 5)]}
                                            </Typography>
                                        </motion.div>
                                    </Box>

                                    {/* Progress waves */}
                                    <Box sx={{ 
                                        mt: 2,
                                        position: 'relative', 
                                        width: '50%', 
                                        height: 4,
                                        bgcolor: 'background.paper',
                                        borderRadius: 2,
                                        overflow: 'hidden'
                                    }}>
                                        <motion.div
                                            animate={{ 
                                                x: ['-100%', '100%'],
                                            }}
                                            transition={{ 
                                                repeat: Infinity,
                                                duration: 1.5,
                                                ease: "easeInOut" 
                                            }}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '50%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, rgba(33,150,243,0) 0%, rgba(33,150,243,1) 50%, rgba(33,150,243,0) 100%)',
                                                borderRadius: 8,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="comparison-view"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Box sx={{ mb: 4 }}>
                                    <Box sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        mb: 2,
                                        p: 2,
                                        bgcolor: 'rgba(33, 150, 243, 0.1)',
                                        borderRadius: 1,
                                    }}>
                                        <SmartToyIcon color="primary" sx={{ mr: 1 }} />
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            ЖИ жұмысының нәтижесі
                                        </Typography>
                                        <Chip 
                                            label="ЖИ жақсартылған" 
                                            size="small" 
                                            color="primary" 
                                            sx={{ ml: 'auto', mr: 1 }}
                                        />
                                        <Tooltip title={showOptions ? "Жауап нұсқаларды жасыру" : "Жауап нұсқаларды көрсету"}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => setShowOptions(prev => !prev)}
                                                color="primary"
                                            >
                                                {showOptions ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                                Болды:
                                            </Typography>
                                            <Paper 
                                                variant="outlined" 
                                                sx={{ p: 2, bgcolor: '#f5f5f5', height: '100%', minHeight: 100 }}
                                            >
                                                <Typography>{originalQuestion?.questionKaz || originalQuestion?.questionRus}</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="subtitle2" gutterBottom color="text.secondary">
                                                Болды:
                                            </Typography>
                                            <Paper 
                                                variant="outlined" 
                                                sx={{ 
                                                    p: 2, 
                                                    bgcolor: 'rgba(76, 175, 80, 0.08)', 
                                                    height: '100%', 
                                                    minHeight: 100,
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {isTyping && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            p: 1,
                                                            bgcolor: 'rgba(33, 150, 243, 0.08)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderBottom: '1px solid rgba(0,0,0,0.1)',
                                                            zIndex: 2
                                                        }}
                                                    >
                                                        <Typography variant="caption" color="primary.dark" sx={{ fontStyle: 'italic' }}>
                                                            ЖИ жасауда
                                                        </Typography>
                                                        <Box sx={{ display: 'inline-flex', ml: 1, position: 'relative', height: 20, alignItems: 'center' }}>
                                                            {/* Gemini-style colored dots */}
                                                            {[0, 1, 2, 3].map((i) => (
                                                                <motion.span
                                                                    key={i}
                                                                    animate={{ 
                                                                        y: [0, -5, 0],
                                                                        opacity: [0.5, 1, 0.5],
                                                                        scale: [0.8, 1, 0.8]
                                                                    }}
                                                                    transition={{ 
                                                                        repeat: Infinity, 
                                                                        duration: 1.2, 
                                                                        delay: i * 0.2,
                                                                        ease: "easeInOut"
                                                                    }}
                                                                    style={{
                                                                        width: 5,
                                                                        height: 5,
                                                                        borderRadius: '50%',
                                                                        display: 'inline-block',
                                                                        margin: '0 2px',
                                                                        background: i === 0 ? '#4285F4' : 
                                                                                  i === 1 ? '#EA4335' : 
                                                                                  i === 2 ? '#FBBC05' : 
                                                                                  '#34A853'
                                                                    }}
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                )}
                                                <Typography sx={{ pt: isTyping ? 4 : 0 }}>
                                                    {isTyping ? (
                                                        <>
                                                            {displayedText}
                                                            <Box 
                                                                component="span" 
                                                                sx={{ 
                                                                    display: 'inline-block',
                                                                    width: '2px',
                                                                    height: '1.2em',
                                                                    bgcolor: 'primary.main',
                                                                    ml: 0.5,
                                                                    verticalAlign: 'middle'
                                                                }}
                                                            >
                                                                <motion.span 
                                                                    animate={{ opacity: [1, 0] }}
                                                                    transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                                                                />
                                                            </Box>
                                                        </>
                                                    ) : (
                                                        updatedQuestion?.questionKaz || updatedQuestion?.questionRus
                                                    )}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                    
                                    {showOptions && (
                                        <>
                                            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 4, mb: 2, display: 'flex', alignItems: 'center' }}>
                                                Варианты ответов
                                                <Chip 
                                                    label="Вы видите все варианты" 
                                                    size="small" 
                                                    color="secondary" 
                                                    sx={{ ml: 2, fontSize: '0.7rem' }}
                                                />
                                            </Typography>
                                            
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>Было:</Typography>
                                                    <List dense component={Paper} variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                                                        {originalQuestion?.options.map((option, idx) => (
                                                            <ListItem 
                                                                key={idx}
                                                                sx={{
                                                                    borderBottom: idx < originalQuestion.options.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                                                    bgcolor: option.id === originalQuestion.correctOptionId ? 'rgba(76, 175, 80, 0.15)' : 'transparent'
                                                                }}
                                                            >
                                                                <Radio
                                                                    checked={option.id === originalQuestion.correctOptionId}
                                                                    disabled
                                                                    size="small"
                                                                />
                                                                <ListItemText 
                                                                    primary={option.nameRus}
                                                                    primaryTypographyProps={{ 
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: option.id === originalQuestion.correctOptionId ? 'bold' : 'normal'
                                                                    }}
                                                                />
                                                                {option.id === originalQuestion.correctOptionId && (
                                                                    <Chip 
                                                                        label="✓ Правильный" 
                                                                        size="small" 
                                                                        color="success" 
                                                                        sx={{ ml: 1, height: 24 }}
                                                                    />
                                                                )}
                                                            </ListItem>
                                                        ))}
                                                    </List>
                                                </Grid>
                                                
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="caption" color="text.secondary" gutterBottom>Стало:</Typography>
                                                    <List dense component={Paper} variant="outlined" sx={{ bgcolor: 'rgba(76, 175, 80, 0.05)' }}>
                                                        {updatedQuestion?.options.map((option, idx) => (
                                                            <motion.div
                                                                key={idx}
                                                                initial={{ opacity: 0, x: 10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ 
                                                                    delay: 0.5 + (idx * 0.15), 
                                                                    duration: 0.4,
                                                                    ease: "easeOut" 
                                                                }}
                                                            >
                                                                <ListItem 
                                                                    sx={{
                                                                        borderBottom: idx < (updatedQuestion?.options.length || 0) - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                                                        bgcolor: option.id === updatedQuestion?.correctOptionId ? 'rgba(76, 175, 80, 0.15)' : 'transparent'
                                                                    }}
                                                                >
                                                                    <Radio
                                                                        checked={option.id === updatedQuestion?.correctOptionId}
                                                                        disabled
                                                                        size="small"
                                                                    />
                                                                    <ListItemText 
                                                                        primary={option.nameRus}
                                                                        primaryTypographyProps={{ 
                                                                            fontSize: '0.9rem',
                                                                            fontWeight: option.id === updatedQuestion?.correctOptionId ? 'bold' : 'normal'
                                                                        }}
                                                                    />
                                                                    {option.id === updatedQuestion?.correctOptionId && (
                                                                        <motion.div
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            transition={{ 
                                                                                delay: 1 + (idx * 0.1), 
                                                                                type: "spring", 
                                                                                stiffness: 200 
                                                                            }}
                                                                        >
                                                                            <Chip 
                                                                                label="✓ Правильный" 
                                                                                size="small" 
                                                                                color="success" 
                                                                                sx={{ ml: 1, height: 24 }}
                                                                            />
                                                                        </motion.div>
                                                                    )}
                                                                </ListItem>
                                                            </motion.div>
                                                        ))}
                                                    </List>
                                                </Grid>
                                            </Grid>
                                        </>
                                    )}
                                </Box>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    {!showComparisonView && !showProcessingAnimation ? (
                        <>
                            <Button onClick={closeAiPromptDialog} disabled={isProcessing}>
                                Бас тарту
                            </Button>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={handleAiPromptSubmit}
                                    disabled={!aiPrompt.trim() || isProcessing}
                                    startIcon={<SmartToyIcon />}
                                >
                                    {isProcessing ? 'ЖИ өңдеуде...' : 'ЖИ қолдану'}
                                </Button>
                            </motion.div>
                        </>
                    ) : showProcessingAnimation ? (
                        <Typography variant="caption" color="text.secondary" sx={{ mx: 'auto' }}>
                            ЖИ сіздің сұранысыңызбен жұмыс жасап жатқанда күте тұрыңыз...
                        </Typography>
                    ) : (
                        <>
                            <Button onClick={closeAiPromptDialog}>
                                Жабу
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                onClick={() => {
                                    setShowComparisonView(false);
                                    setAiPrompt('');
                                }}
                            >
                                Тағы бір жақсартуды жасау
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ExamViewer;