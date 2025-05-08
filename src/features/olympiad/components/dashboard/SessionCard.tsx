import {
    AssignmentOutlined,
    CalendarToday,
    PersonOutlined,
    PlayArrowRounded,
    ScoreboardOutlined,
    TimerOutlined
} from '@mui/icons-material';
import {
    Box,
    Button,
    CardContent,
    Chip,
    Divider,
    Paper,
    Typography,
    styled,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { StudentExamSessionResponses } from '../../types/testSession';
import { formatDate } from '../../utils/dateUtils.ts';

const StyledCard = styled(motion.div)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

const SessionButton = styled(Button)(({ theme }) => ({
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

interface SessionCardProps {
    session: StudentExamSessionResponses;
    isTeacher?: boolean;
}

const SessionCard: React.FC<SessionCardProps> = ({ session, isTeacher = false }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { t, i18n } = useTranslation();
    
    // Check if the session is still active (not completed or time remaining)
    const isActive = () => {
        if (!session.endTime) return false;

        const endTimeDate = new Date(session.endTime);
        const now = new Date();

        return endTimeDate > now;
    };

    const handleViewSession = () => {
        const path = isActive()
            ? `/test/${session.id}`
            : `/test-results/${session.id}`;

        navigate(path);
    };

    const active = isActive();
    const isCompleted = session.completed !== undefined ? session.completed : !active;

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
                    bgcolor: active ? 
                        theme.palette.primary.main + '08' :
                        theme.palette.success.main + '08',
                    borderBottom: '1px solid',
                    borderColor: theme.palette.divider
                }}>
                    <Typography variant="h6" fontWeight={600} noWrap>
                        {i18n.language === 'ru' ? session.examData.nameRus : session.examData.nameKaz}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {i18n.language === 'ru' ? session.examData.typeRus : session.examData.typeKaz}
                    </Typography>
                </Box>

                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                    {/* Teacher view - show student information */}
                    {isTeacher && session.firstName && session.lastName && (
                        <Box sx={{ mb: 2 }}>
                            <InfoItem>
                                <PersonOutlined 
                                    fontSize="small" 
                                    sx={{ 
                                        mr: 1.5, 
                                        color: theme.palette.info.main,
                                        opacity: 0.8
                                    }} 
                                />
                                <Typography variant="body2" fontWeight={500}>
                                    {session.lastName} {session.firstName}
                                </Typography>
                            </InfoItem>
                        </Box>
                    )}

                    <Box sx={{ mb: 2 }}>
                        <InfoItem>
                            <CalendarToday 
                                fontSize="small" 
                                sx={{ 
                                    mr: 1.5, 
                                    color: active ? theme.palette.primary.main : theme.palette.success.main,
                                    opacity: 0.8
                                }} 
                            />
                            <Typography variant="body2">
                                {t('testCard.start')}{formatDate(session.startTime)}
                            </Typography>
                        </InfoItem>

                        <InfoItem>
                            <TimerOutlined 
                                fontSize="small" 
                                sx={{ 
                                    mr: 1.5, 
                                    color: active ? theme.palette.primary.main : theme.palette.success.main,
                                    opacity: 0.8
                                }} 
                            />
                            <Typography variant="body2">
                                {t('testCard.duration')}{session.examData.durationInMinutes} {t('testCard.minutes')}
                            </Typography>
                        </InfoItem>
                        
                        {/* Score information - display for teachers or completed sessions */}
                        {(isTeacher || isCompleted) && session.score !== undefined && (
                            <InfoItem>
                                <ScoreboardOutlined 
                                    fontSize="small" 
                                    sx={{ 
                                        mr: 1.5, 
                                        color: theme.palette.success.main,
                                        opacity: 0.8
                                    }} 
                                />
                                <Typography variant="body2" fontWeight={500}>
                                    {t('Score')}: {session.score}
                                </Typography>
                            </InfoItem>
                        )}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box mt={2}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.85rem', color: 'text.secondary' }}>
                            {t('testCard.status')}
                        </Typography>
                        <Chip
                            label={isCompleted ? t('sessionCard.completed') : t('sessionCard.inProgress')}
                            size="small"
                            sx={{
                                bgcolor: isCompleted ? theme.palette.success.main : theme.palette.primary.main,
                                color: '#fff',
                                fontWeight: 500,
                                fontSize: '0.75rem',
                                borderRadius: '6px',
                            }}
                        />
                    </Box>
                </CardContent>

                <Box sx={{ px: 2, pb: 2, mt: 'auto' }}>
                    <SessionButton
                        fullWidth
                        variant="contained"
                        color={isCompleted ? "success" : "primary"}
                        startIcon={isCompleted ? <AssignmentOutlined /> : <PlayArrowRounded />}
                        onClick={handleViewSession}
                        disableElevation
                    >
                        {isCompleted ? t('sessionCard.viewResults') : t('sessionCard.continueTest')}
                    </SessionButton>
                </Box>
            </Paper>
        </StyledCard>
    );
};

export default SessionCard;