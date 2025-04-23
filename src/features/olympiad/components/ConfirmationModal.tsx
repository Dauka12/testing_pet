import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from 'react';
import { useTranslation } from "react-i18next";

interface ConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    formData: {
        firstname: string;
        lastname: string;
        phone: string;
        password: string;
        confirmPassword: string;
    };
    loading: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    open,
    onClose,
    onConfirm,
    formData,
    loading
}) => {
    const { t } = useTranslation();
    
    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t('registration.confirm.title')}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    {t('registration.confirm.message')}
                </Typography>
                
                <Box mt={2}>
                    <Typography variant="subtitle2">
                        {t('registration.fields.firstname')}: <b>{formData.firstname}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                        {t('registration.fields.lastname')}: <b>{formData.lastname}</b>
                    </Typography>
                    <Typography variant="subtitle2">
                        {t('registration.fields.phone')}: <b>{formData.phone}</b>
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={loading}>
                    {t('registration.confirm.cancel')}
                </Button>
                <LoadingButton 
                    onClick={onConfirm} 
                    color="primary" 
                    variant="contained" 
                    loading={loading}
                >
                    {t('registration.confirm.submit')}
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
};
