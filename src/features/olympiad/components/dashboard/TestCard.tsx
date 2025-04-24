import {
    AccessTimeOutlined,
    CalendarToday,
    MenuBookOutlined,
    PlayArrowRounded
} from '@mui/icons-material';
import {
    Box,
    Button,
    CardActions,
    CardContent,
    Chip,
    Divider,
    LinearProgress,
    Paper,
    Typography,
    styled,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/hooks.ts';
import { startExamSessionThunk } from '../../store/slices/testSessionSlice.ts';
import { ExamResponse } from '../../types/exam.ts';
import { formatDate } from '../../utils/dateUtils.ts';

const StyledCard = styled(motion.div)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const TestButton = styled(Button)(({ theme }) => ({
    borderRadius: 10,
    padding: theme.spacing(1.2, 2),
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    '&:hover': {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    }
}));

const InfoItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
    '&:last-child': {
        marginBottom: 0
    }
}));

interface TestCardProps {
    exam: ExamResponse;
}

const TestCard: React.FC<TestCardProps> = ({ exam }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const [isStarting, setIsStarting] = useState(false);

    const handleStartExam = async () => {
        try {
            setIsStarting(true);
            const result = await dispatch(startExamSessionThunk({ examTestId: exam.id }));
            
            // Check if the action was successful and navigate
            if (startExamSessionThunk.fulfilled.match(result)) {
                navigate(`/test/${result.payload.id}`);
            }
        } catch (error) {
            console.error('Failed to start exam:', error);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <StyledCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Paper
                elevation={0}
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                        transform: 'translateY(-4px)',
                    }
                }}
            >
                <Box sx={{ 
                    p: 2, 
                    bgcolor: theme.palette.primary.main + '08',
                    borderBottom: '1px solid',
                    borderColor: theme.palette.divider
                }}>
                    <Typography variant="h6" fontWeight={600} noWrap>
                        {exam.nameRus}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {exam.typeRus}
                    </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    <Box sx={{ mb: 2 }}>
                        <InfoItem>
                            <CalendarToday 
                                fontSize="small" 
                                sx={{ mr: 1.5, color: theme.palette.primary.main, opacity: 0.8 }} 
                            />
                            <Typography variant="body2">
                                Начало: {formatDate(exam.startTime)}
                            </Typography>
                        </InfoItem>

                        <InfoItem>
                            <AccessTimeOutlined 
                                fontSize="small" 
                                sx={{ mr: 1.5, color: theme.palette.primary.main, opacity: 0.8 }} 
                            />
                            <Typography variant="body2">
                                Продолжительность: {exam.durationInMinutes} минут
                            </Typography>
                        </InfoItem>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <InfoItem>
                        <MenuBookOutlined 
                            fontSize="small" 
                            sx={{ mr: 1.5, color: theme.palette.primary.main, opacity: 0.8 }} 
                        />
                        <Typography variant="body2">
                            Количество вопросов: {exam.questions?.length || 'Загрузка...'}
                        </Typography>
                    </InfoItem>

                    <Box mt={2.5}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem', color: 'text.secondary' }}>
                            Статус:
                        </Typography>
                        <Chip
                            label="Доступен"
                            size="small"
                            sx={{
                                bgcolor: theme.palette.info.light,
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                borderRadius: '6px',
                            }}
                        />
                    </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                    <TestButton
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={isStarting ? null : <PlayArrowRounded />}
                        disabled={isStarting}
                        onClick={handleStartExam}
                        disableElevation
                    >
                        {isStarting ? (
                            <>
                                <LinearProgress
                                    color="inherit"
                                    sx={{ width: 20, mr: 1 }}
                                />
                                Загрузка...
                            </>
                        ) : (
                            'Начать тест'
                        )}
                    </TestButton>
                </CardActions>
            </Paper>
        </StyledCard>
    );
};

export default TestCard;