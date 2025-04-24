import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React from 'react';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    answeredCount: number;
    totalQuestions: number;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    answeredCount,
    totalQuestions
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    boxShadow: '0 24px 38px rgba(0, 0, 0, 0.14)'
                }
            }}
        >
            <DialogTitle>Завершить тест?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Вы уверены, что хотите завершить тест? Вы ответили на {answeredCount} из {totalQuestions} вопросов.
                    После завершения вы не сможете изменить свои ответы.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ pb: 3, pr: 3 }}>
                <Button
                    onClick={onClose}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                >
                    Отмена
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="primary"
                    autoFocus
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
                >
                    Завершить тест
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
