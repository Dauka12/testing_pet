import {
    AssignmentOutlined,
    CalendarToday,
    PlayArrowRounded,
    TimerOutlined
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Divider,
    styled,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentExamSessionResponses } from '../types/testSession';
import { formatDate } from '../utils/dateUtils.ts';

const StyledCard = styled(motion.div)(({ theme }) => ({
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden', 
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.08)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 16px 32px rgba(0, 0, 0, 0.12)'
    }
}));

const SessionButton = styled(Button)(({ theme }) => ({
    borderRadius: 14,
    padding: theme.spacing(1.2, 2),
    fontWeight: 600,
    textTransform: 'none',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    '&:hover': {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.16)',
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
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
    const navigate = useNavigate();

    // Check if the session is still active (not completed or time remaining)
    const isActive = () => {
        if (!session.endTime) return false;

        const endTimeDate = new Date(session.endTime);
        const now = new Date();

        return endTimeDate > now;
    };

    const handleViewSession = () => {
        const path = isActive()
            ? `/olympiad/test/${session.id}`
            : `/olympiad/test-results/${session.id}`;

        navigate(path);
    };

    const active = isActive();

    return (
        <StyledCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Card sx={{ boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader
                    title={session.examData.nameRus}
                    subheader={session.examData.typeRus}
                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                    subheaderTypographyProps={{ sx: { color: 'text.secondary' } }}
                />

                <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    <Box sx={{ mb: 2 }}>
                        <InfoItem>
                            <CalendarToday fontSize="small" color="action" sx={{ mr: 1.5, opacity: 0.7 }} />
                            <Typography variant="body2" color="text.secondary">
                                Начало: {formatDate(session.startTime)}
                            </Typography>
                        </InfoItem>

                        <InfoItem>
                            <TimerOutlined fontSize="small" color="action" sx={{ mr: 1.5, opacity: 0.7 }} />
                            <Typography variant="body2" color="text.secondary">
                                Продолжительность: {session.examData.durationInMinutes} минут
                            </Typography>
                        </InfoItem>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Статус:
                    </Typography>
                    <Box sx={{ 
                        display: 'inline-block', 
                        py: 0.5, 
                        px: 1.5, 
                        borderRadius: 2, 
                        bgcolor: active ? 'primary.light' : 'success.light',
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                    }}>
                        {active ? 'В процессе' : 'Завершен'}
                    </Box>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                    <SessionButton
                        fullWidth
                        variant="contained"
                        color={active ? "primary" : "secondary"}
                        startIcon={active ? <PlayArrowRounded /> : <AssignmentOutlined />}
                        onClick={handleViewSession}
                    >
                        {active ? 'Продолжить тест' : 'Просмотреть результаты'}
                    </SessionButton>
                </CardActions>
            </Card>
        </StyledCard>
    );
};

export default SessionCard;