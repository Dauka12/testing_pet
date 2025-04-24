import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { motion } from 'framer-motion';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks.ts';
import { deleteExamThunk } from '../../store/slices/examSlice.ts';
import { ExamResponse } from '../../types/exam.ts';

interface ExamListProps {
    onEditExam: (exam: ExamResponse) => void;
    onViewExam: (exam: ExamResponse) => void;
}

const ExamList: React.FC<ExamListProps> = ({ onEditExam, onViewExam }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    const { exams, loading } = useAppSelector((state) => state.exam);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [examToDelete, setExamToDelete] = React.useState<number | null>(null);

    const confirmDelete = (examId: number, event: React.MouseEvent) => {
        event.stopPropagation();
        setExamToDelete(examId);
        setDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (examToDelete) {
            dispatch(deleteExamThunk(examToDelete));
        }
        setDeleteDialogOpen(false);
        setExamToDelete(null);
    };

    const cancelDelete = () => {
        setDeleteDialogOpen(false);
        setExamToDelete(null);
    };

    if (exams.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Экзамены не найдены
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                        Создайте новый экзамен, используя кнопку ниже
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => {
                            // You'll need to add a prop for this navigation
                            // For now, we'll leave it as a placeholder
                        }}
                    >
                        Создать экзамен
                    </Button>
                </motion.div>
            </Box>
        );
    }

    return (
        <>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                Список экзаменов
            </Typography>

            {/* Mobile Card View */}
            {isMobile ? (
                <Grid container spacing={2}>
                    {exams.map((exam, index) => (
                        <Grid item xs={12} key={exam.id}>
                            <Card 
                                component={motion.div}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                sx={{ mb: 2 }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {exam.nameRus}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            ID: {exam.id}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Тип: {exam.typeRus}
                                    </Typography>
                                    
                                    <Grid container spacing={2} sx={{ mt: 1 }}>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Время начала:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exam.startTime && format(new Date(exam.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="caption" color="text.secondary">
                                                Длительность:
                                            </Typography>
                                            <Typography variant="body2">
                                                {exam.durationInMinutes} мин.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    
                                    <Box sx={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 2,
                                        pt: 2,
                                        borderTop: '1px solid',
                                        borderColor: 'divider'
                                    }}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                py: 0.5,
                                                px: 1.5,
                                                borderRadius: 10
                                            }}
                                        >
                                            {exam.questions?.length || 0} вопросов
                                        </Typography>
                                        
                                        <Box>
                                            <IconButton onClick={(e) => {
                                                e.stopPropagation();
                                                onViewExam(exam);
                                            }}>
                                                <VisibilityIcon color="primary" />
                                            </IconButton>
                                            
                                            <IconButton onClick={(e) => {
                                                e.stopPropagation();
                                                onEditExam(exam);
                                            }}>
                                                <EditIcon color="secondary" />
                                            </IconButton>
                                            
                                            <IconButton onClick={(e) => confirmDelete(exam.id, e)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // Desktop Table View
                <TableContainer 
                    component={Paper} 
                    sx={{ 
                        borderRadius: 2, 
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                    }}
                >
                    <Table>
                        <TableHead sx={{ bgcolor: 'primary.main' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Название</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Тип</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Время начала</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Длительность</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Вопросы</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exams.map((exam) => (
                                <TableRow
                                    key={exam.id}
                                    hover
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{exam.id}</TableCell>
                                    <TableCell>{exam.nameRus}</TableCell>
                                    <TableCell>{exam.typeRus}</TableCell>
                                    <TableCell>
                                        {exam.startTime && format(new Date(exam.startTime), 'dd MMM yyyy, HH:mm', { locale: ru })}
                                    </TableCell>
                                    <TableCell>{exam.durationInMinutes} мин.</TableCell>
                                    <TableCell>{exam.questions?.length || 0}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex' }}>
                                            <Tooltip title="Просмотреть тест">
                                                <IconButton
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onViewExam(exam);
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Управление вопросами">
                                                <IconButton
                                                    color="secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditExam(exam);
                                                    }}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Удалить">
                                                <IconButton
                                                    color="error"
                                                    onClick={(e) => confirmDelete(exam.id, e)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDelete}
                PaperProps={{
                    sx: { borderRadius: 2, p: 1 }
                }}
            >
                <DialogTitle>Удаление экзамена</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить этот экзамен? Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDelete} color="error">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ExamList;