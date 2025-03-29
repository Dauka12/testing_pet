import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useMediaQuery, useTheme } from "@mui/material";
import React from 'react';
import { useTranslation } from "react-i18next";

export const ConfirmationModal = ({
    open,
    onClose,
    onConfirm,
    formData,
    loading,
    categoryName
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation(); // Add translation hook

    const InfoRow = ({ label, value }) => (
        <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            mb: 2,
            '&:last-child': { mb: 0 }
        }}>
            <Typography
                variant="subtitle2"
                sx={{
                    width: isMobile ? '100%' : '30%',
                    color: 'text.secondary',
                    mb: isMobile ? 0.5 : 0
                }}
            >
                {label}
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    fontWeight: 500,
                    flexGrow: 1
                }}
            >
                {value || '—'}
            </Typography>
        </Box>
    );

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: theme.shape.borderRadius * 2,
                    px: isMobile ? 1 : 2
                }
            }}
            fullScreen={isMobile}
        >
            <DialogTitle sx={{
                pb: 1,
                pt: 3,
                fontSize: '1.5rem',
                fontWeight: 600,
                textAlign: 'center',
                color: '#1A2751'
            }}>
                {t('registration.confirmation.title')}
            </DialogTitle>

            <DialogContent sx={{ px: isMobile ? 2 : 4 }}>
                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 3,
                        textAlign: 'center',
                        fontSize: '0.95rem'
                    }}
                >
                    {t('registration.confirmation.subtitle')}
                </Typography>

                <Box sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    p: 3,
                    borderRadius: 2,
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('registration.confirmation.personalData')}
                    </Typography>

                    <InfoRow label={t('registration.fields.lastname')} value={formData.lastname} />
                    <InfoRow label={t('registration.fields.firstname')} value={formData.firstname} />
                    <InfoRow label={t('registration.fields.middlename')} value={formData.middlename} />
                    <InfoRow label={t('registration.fields.iin')} value={formData.iin} />
                    <InfoRow label={t('registration.fields.studyYear')} value={formData.studyYear} />
                </Box>

                <Box sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    p: 3,
                    borderRadius: 2,
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('registration.confirmation.contactInfo')}
                    </Typography>

                    <InfoRow label={t('registration.fields.email')} value={formData.email} />
                    <InfoRow label={t('registration.fields.phone')} value={formData.phone} />
                    <InfoRow label={t('registration.fields.university')} value={formData.university} />
                </Box>

                <Box sx={{
                    bgcolor: 'rgba(0, 0, 0, 0.02)',
                    p: 3,
                    borderRadius: 2
                }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {t('registration.confirmation.participationInfo')}
                    </Typography>

                    <InfoRow label={t('registration.fields.category')} value={categoryName} />
                </Box>
            </DialogContent>

            <DialogActions sx={{
                justifyContent: 'center',
                p: 3,
                gap: 2,
                flexDirection: isMobile ? 'column' : 'row'
            }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    variant="outlined"
                    sx={{
                        borderColor: '#1A2751',
                        color: '#1A2751',
                        '&:hover': {
                            borderColor: '#1A2751',
                            backgroundColor: 'rgba(26, 39, 81, 0.04)',
                        },
                        px: 4,
                        py: 1,
                        width: isMobile ? '100%' : 'auto'
                    }}
                >
                    {t('registration.confirmation.backButton')}
                </Button>

                <Button
                    onClick={onConfirm}
                    disabled={loading}
                    variant="contained"
                    sx={{
                        bgcolor: '#1A2751',
                        '&:hover': {
                            bgcolor: '#13203f',
                        },
                        px: 4,
                        py: 1,
                        width: isMobile ? '100%' : 'auto'
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {loading ? t('registration.confirmation.submitting') : t('registration.confirmation.confirmButton')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
