import {
    Alert,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Skeleton,
    Slider,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { generateAiTest, getExamById } from '../../api/examApi';
import { ExamResponse } from '../../types/exam';

interface AiTestGeneratorProps {
    onSuccess?: (examId: number) => void;
}

const AiTestGenerator: React.FC<AiTestGeneratorProps> = ({ onSuccess }) => {
    const theme = useTheme();
    const [subject, setSubject] = useState('');
    const [numQuestions, setNumQuestions] = useState<number>(5);
    const [difficulty, setDifficulty] = useState('medium');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [examId, setExamId] = useState<number | null>(null);
    const [generatedExam, setGeneratedExam] = useState<ExamResponse | null>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Animation variables
    const [showResult, setShowResult] = useState(false);
    const [animationComplete, setAnimationComplete] = useState(false);

    useEffect(() => {
        // Simulate progress loading during generation
        let timer: NodeJS.Timeout;
        if (isGenerating && !examId) {
            timer = setInterval(() => {
                setLoadingProgress((prevProgress) => {
                    const newProgress = prevProgress + (100 - prevProgress) * 0.1;
                    return newProgress >= 98 ? 98 : newProgress;
                });
            }, 500);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isGenerating, examId]);

    useEffect(() => {
        // When we get an examId, fetch the exam details
        if (examId) {
            const fetchExamDetails = async () => {
                try {
                    setIsLoading(true);
                    setLoadingProgress(99);
                    const exam = await getExamById(examId);
                    setGeneratedExam(exam);
                    setLoadingProgress(100);
                    
                    // Wait a moment before showing the result to complete the animation
                    setTimeout(() => {
                        setIsGenerating(false);
                        setShowResult(true);
                        setIsLoading(false);
                        if (onSuccess) onSuccess(examId);
                    }, 1000);
                } catch (err) {
                    setError('Не удалось загрузить сгенерированный тест');
                    setIsGenerating(false);
                    setIsLoading(false);
                }
            };

            fetchExamDetails();
        }
    }, [examId, onSuccess]);

    useEffect(() => {
        // Animate questions appearing one by one
        if (showResult && generatedExam?.questions && currentQuestionIndex < generatedExam.questions.length - 1) {
            const timer = setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 600); // Show each question after 600ms delay
            
            return () => clearTimeout(timer);
        }
        
        if (showResult && generatedExam?.questions && currentQuestionIndex === generatedExam.questions.length - 1) {
            // All questions have been displayed
            setTimeout(() => {
                setAnimationComplete(true);
            }, 500);
        }
    }, [showResult, currentQuestionIndex, generatedExam]);

    const handleGenerate = async () => {
        if (!subject.trim()) {
            setError('Тақырыпты көрсетіңіз');
            return;
        }

        setError(null);
        setIsGenerating(true);
        setLoadingProgress(0);
        setGeneratedExam(null);
        setExamId(null);
        setCurrentQuestionIndex(-1);
        setShowResult(false);
        setAnimationComplete(false);

        try {
            const generatedExamId = await generateAiTest({
                subject,
                numQuestions,
                difficulty
            });
            
            setExamId(generatedExamId);
        } catch (err) {
            console.error(err);
            setError('Ошибка при генерации теста. Пожалуйста, попробуйте еще раз.');
            setIsGenerating(false);
        }
    };

    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4, position: 'relative' }}>
                <Typography variant="h5" component="h2" gutterBottom color="primary" fontWeight="bold">
                    Жасанды интеллект көмегімен тест құру
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                    Тест құру үшін тақырып, сұрақтар саны мен күрделілік деңгейін көрсетіңіз.
                    Біздің ЖИ автоматты түрде сіз үшін сұрақтар мен жауап нұсқаларын құрады.
                </Typography>

                <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Тест тақырыбы"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={isGenerating}
                                required
                                helperText="Мысалы: Ақпараттық технологиялар, Математика, Бағдарламалау"
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography id="questions-slider" gutterBottom>
                                Сұрақтар саны: {numQuestions}
                            </Typography>
                            <Slider
                                value={numQuestions}
                                onChange={(_, value) => setNumQuestions(value as number)}
                                min={3}
                                max={20}
                                step={1}
                                valueLabelDisplay="auto"
                                aria-labelledby="questions-slider"
                                disabled={isGenerating}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth disabled={isGenerating}>
                                <InputLabel id="difficulty-label">Күрделілігі</InputLabel>
                                <Select
                                    labelId="difficulty-label"
                                    value={difficulty}
                                    label="Күрделілігі"
                                    onChange={(e) => setDifficulty(e.target.value)}
                                >
                                    <MenuItem value="easy">Жеңіл</MenuItem>
                                    <MenuItem value="medium">Орташа</MenuItem>
                                    <MenuItem value="hard">Күрделі</MenuItem>
                                </Select>
                                <FormHelperText>Тест күрделілік деңгейін таңдаңыз</FormHelperText>
                            </FormControl>
                        </Grid>
                        
                        {error && (
                            <Grid item xs={12}>
                                <Alert severity="error">{error}</Alert>
                            </Grid>
                        )}
                        
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                disabled={isGenerating || !subject.trim()}
                                type="submit"
                                sx={{ py: 1.5 }}
                            >
                                {isGenerating ? 'Жасалуда...' : 'Тест жасау'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {/* Generation animation overlay */}
                {isGenerating && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            borderRadius: 2,
                            p: 4
                        }}
                    >
                        <Box sx={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CircularProgress
                                    variant="determinate"
                                    value={loadingProgress}
                                    size={100}
                                    thickness={4}
                                    sx={{ mb: 3 }}
                                />
                                
                                <Typography variant="h6" gutterBottom>
                                    {loadingProgress < 40
                                        ? 'Тақырыпты талдау...'
                                        : loadingProgress < 70
                                        ? 'Сұрақтарды жасау...'
                                        : loadingProgress < 90
                                        ? 'Жауап нұсқаларын құру...'
                                        : 'Тесті аяқтау...'}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary">
                                    {Math.round(loadingProgress)}% аяқталды
                                </Typography>

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                            opacity: [0.7, 1, 0.7]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Typography variant="body2" fontStyle="italic" color="text.secondary">
                                            Бұл біраз уақыт алуы мүмкін...
                                        </Typography>
                                    </motion.div>
                                </Box>
                            </motion.div>
                        </Box>
                    </Box>
                )}
            </Paper>

            {/* Generated Test Results */}
            {showResult && generatedExam && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
                            Жасалған тест: {generatedExam.nameKaz || generatedExam.nameRus}
                        </Typography>
                        
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1">
                                <strong>Түрі:</strong> {generatedExam.typeKaz || generatedExam.typeRus}
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Ұзақтығы:</strong> {generatedExam.durationInMinutes} минут
                            </Typography>
                            <Typography variant="subtitle1">
                                <strong>Сұрақтар саны:</strong> {generatedExam.questions?.length || 0}
                            </Typography>
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
                            Тест сұрақтары:
                        </Typography>
                        
                        {generatedExam.questions?.map((question, index) => (
                            index <= currentQuestionIndex && (
                                <motion.div
                                    key={question.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Paper 
                                        variant="outlined" 
                                        sx={{ 
                                            p: 2, 
                                            mb: 2, 
                                            borderColor: theme.palette.divider,
                                            bgcolor: 'background.paper'
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Сұрақ {index + 1}: {question.questionKaz || question.questionRus}
                                        </Typography>
                                        
                                        <Box sx={{ pl: 2 }}>
                                            {question.options.map((option, optIndex) => (
                                                <Typography 
                                                    key={option.id} 
                                                    variant="body2" 
                                                    sx={{ 
                                                        mb: 0.5,
                                                        color: option.id === question.correctOptionId ? 'success.main' : 'text.primary',
                                                        fontWeight: option.id === question.correctOptionId ? 'bold' : 'normal'
                                                    }}
                                                >
                                                    {optIndex + 1}. {option.nameKaz || option.nameRus}
                                                    {option.id === question.correctOptionId && ' ✓'}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Paper>
                                </motion.div>
                            )
                        ))}
                        
                        {!animationComplete && currentQuestionIndex < (generatedExam.questions?.length || 0) - 1 && (
                            <Box sx={{ my: 2 }}>
                                <Skeleton variant="rectangular" height={100} animation="wave" />
                            </Box>
                        )}
                        
                        {animationComplete && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Box sx={{ mt: 3, textAlign: 'center' }}>
                                    <Typography variant="body1" color="success.main" gutterBottom>
                                        Тест сәтті жасалды және сақталды!
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => {
                                            handleGenerate();
                                        }}
                                        sx={{ mr: 2 }}
                                    >
                                        Жаңа тест жасау
                                    </Button>
                                </Box>
                            </motion.div>
                        )}
                    </Paper>
                </motion.div>
            )}
        </Box>
    );
};

export default AiTestGenerator;
