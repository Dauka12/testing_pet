import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Radio,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { ExamResponse } from '../types/exam';

interface ExamViewerProps {
    exam: ExamResponse;
    isMobile?: boolean;
}

const ExamViewer: React.FC<ExamViewerProps> = ({ exam, isMobile }) => {
    const theme = useTheme();
    // If isMobile prop isn't passed, detect it with useMediaQuery
    const isMobileView = isMobile !== undefined ? isMobile : useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box>
            <Paper elevation={3} sx={{
                p: isMobileView ? 2 : 4,
                borderRadius: isMobileView ? 2 : 2,
                mb: isMobileView ? 2 : 4
            }}>
                <Typography
                    variant={isMobileView ? "h6" : "h5"}
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: 'primary.main'
                    }}
                >
                    {exam.nameRus}
                </Typography>
                <Typography
                    variant={isMobileView ? "body2" : "subtitle1"}
                    color="text.secondary"
                    gutterBottom
                >
                    {exam.nameKaz}
                </Typography>

                <Grid container spacing={isMobileView ? 1 : 3} sx={{ mt: isMobileView ? 1 : 2 }}>
                    <Grid item xs={isMobileView ? 6 : 12} md={4}>
                        <Typography variant={isMobileView ? "caption" : "subtitle2"} color="text.secondary">
                            Тип экзамена:
                        </Typography>
                        <Typography variant={isMobileView ? "body2" : "body1"} sx={{ fontWeight: 'medium' }}>
                            {exam.typeRus} / {isMobileView ? "" : exam.typeKaz}
                        </Typography>
                    </Grid>

                    <Grid item xs={isMobileView ? 6 : 12} md={4}>
                        <Typography variant={isMobileView ? "caption" : "subtitle2"} color="text.secondary">
                            Время начала:
                        </Typography>
                        <Typography variant={isMobileView ? "body2" : "body1"} sx={{ fontWeight: 'medium' }}>
                            {exam.startTime ? (
                                format(new Date(exam.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })
                            ) : (
                                'Не указано'
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={isMobileView ? 12 : 12} md={4}>
                        <Typography variant={isMobileView ? "caption" : "subtitle2"} color="text.secondary">
                            Длительность:
                        </Typography>
                        <Typography variant={isMobileView ? "body2" : "body1"} sx={{ fontWeight: 'medium' }}>
                            {exam.durationInMinutes} мин
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{
                p: isMobileView ? 2 : 4,
                borderRadius: isMobileView ? 2 : 2
            }}>
                <Typography
                    variant={isMobileView ? "subtitle1" : "h6"}
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    Вопросы ({exam.questions?.length || 0})
                </Typography>
                <Divider sx={{ mb: isMobileView ? 2 : 3 }} />

                {exam.questions && exam.questions.length > 0 ? (
                    <Box>
                        {exam.questions.map((question, index) => (
                            <Accordion
                                key={question.id}
                                sx={{
                                    mb: isMobileView ? 1 : 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    '&:before': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box display="flex" alignItems="center" width="100%">
                                        <Typography
                                            sx={{
                                                fontWeight: 'medium',
                                                fontSize: isMobileView ? '0.9rem' : 'inherit'
                                            }}
                                        >
                                            Вопрос {index + 1}
                                        </Typography>
                                        <Chip
                                            label={`${question.options.length} вар.`}
                                            size="small"
                                            sx={{
                                                ml: 1,
                                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                fontSize: isMobileView ? '0.7rem' : '0.75rem',
                                                height: isMobileView ? 20 : 24
                                            }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: isMobileView ? 1.5 : 2 }}>
                                    {isMobileView ? (
                                        // Mobile view - stacked layout
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                Вопрос (Рус):
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 1.5 }}>
                                                {question.questionRus}
                                            </Typography>

                                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                Вопрос (Каз):
                                            </Typography>
                                            <Typography variant="body2" paragraph sx={{ mb: 1.5 }}>
                                                {question.questionKaz}
                                            </Typography>

                                            <Typography variant="subtitle2" sx={{ mt: 1.5, mb: 1, fontWeight: 'bold' }}>
                                                Варианты ответов:
                                            </Typography>

                                            <List dense disablePadding>
                                                {question.options.map((option, optIndex) => (
                                                    <ListItem
                                                        key={option.id}
                                                        sx={{
                                                            bgcolor: option.id === question.correctOptionId ?
                                                                'rgba(76, 175, 80, 0.08)' : 'inherit',
                                                            borderRadius: 1,
                                                            mb: 0.5,
                                                            border: '1px solid rgba(0,0,0,0.08)',
                                                            py: 0.5
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                                            <Radio
                                                                checked={option.id === question.correctOptionId}
                                                                disabled
                                                                size="small"
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    variant="body2"
                                                                    component="div"
                                                                    sx={{
                                                                        fontWeight: option.id === question.correctOptionId ? 600 : 400
                                                                    }}
                                                                >
                                                                    {option.nameRus}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    variant="caption"
                                                                    component="div"
                                                                    color="text.secondary"
                                                                >
                                                                    {option.nameKaz}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </>
                                    ) : (
                                        // Desktop view - grid layout
                                        <>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Вопрос (Рус):
                                                    </Typography>
                                                    <Typography variant="body1" paragraph>
                                                        {question.questionRus}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography variant="subtitle2" color="text.secondary">
                                                        Вопрос (Каз):
                                                    </Typography>
                                                    <Typography variant="body1" paragraph>
                                                        {question.questionKaz}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                                                Варианты ответов:
                                            </Typography>

                                            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ bgcolor: 'background.default' }}>
                                                            <TableCell width="5%">#</TableCell>
                                                            <TableCell width="45%">Текст (Рус)</TableCell>
                                                            <TableCell width="45%">Текст (Каз)</TableCell>
                                                            <TableCell width="5%">Верный</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {question.options.map((option, optIndex) => (
                                                            <TableRow key={option.id} sx={{
                                                                bgcolor: option.id === question.correctOptionId ?
                                                                    'rgba(76, 175, 80, 0.08)' : 'inherit'
                                                            }}>
                                                                <TableCell>{optIndex + 1}</TableCell>
                                                                <TableCell>{option.nameRus}</TableCell>
                                                                <TableCell>{option.nameKaz}</TableCell>
                                                                <TableCell align="center">
                                                                    {option.id === question.correctOptionId && '✓'}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: isMobileView ? 3 : 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            Для этого экзамена еще не созданы вопросы.
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default ExamViewer;