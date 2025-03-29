import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { ExamResponse } from '../types/exam';

interface ExamViewerProps {
    exam: ExamResponse;
}

const ExamViewer: React.FC<ExamViewerProps> = ({ exam }) => {
    return (
        <Box>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {exam.nameRus}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {exam.nameKaz}
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Тип экзамена:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {exam.typeRus} / {exam.typeKaz}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Время начала:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {exam.startTime ? (
                                format(new Date(exam.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })
                            ) : (
                                'Не указано'
                            )}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Длительность:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {exam.durationInMinutes} мин
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Вопросы ({exam.questions?.length || 0})
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {exam.questions && exam.questions.length > 0 ? (
                    <Box>
                        {exam.questions.map((question, index) => (
                            <Accordion key={question.id} sx={{ mb: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Box display="flex" alignItems="center" width="100%">
                                        <Typography sx={{ fontWeight: 'medium' }}>
                                            Вопрос {index + 1}
                                        </Typography>
                                        <Chip
                                            label={`${question.options.length} вариантов ответа`}
                                            size="small"
                                            sx={{ ml: 2, bgcolor: 'rgba(25, 118, 210, 0.08)' }}
                                        />
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
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
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
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