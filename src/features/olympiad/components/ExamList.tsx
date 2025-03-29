import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from '@mui/material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { deleteExamThunk } from '../store/slices/examSlice.ts';
import { ExamResponse } from '../types/exam.ts';

interface ExamListProps {
    onEditExam: (exam: ExamResponse) => void;
    onViewExam: (exam: ExamResponse) => void;
}

const ExamList: React.FC<ExamListProps> = ({ onEditExam, onViewExam }) => {
    const dispatch = useDispatch();
    const { exams, loading } = useSelector((state: RootState) => state.exam);
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
                <Typography variant="h6" color="text.secondary">
                    Экзамены не найдены
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Создайте новый экзамен, используя форму выше
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
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