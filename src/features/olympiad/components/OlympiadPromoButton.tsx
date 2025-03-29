import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Typography,
    Zoom
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Styled components for custom styling
const StyledFab = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: 30,
    right: 30,
    backgroundColor: '#f5b207',
    color: '#fff',
    zIndex: 9999,
    '&:hover': {
        backgroundColor: '#fca311',
        transform: 'scale(1.05)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
    },
    transition: 'all 0.3s ease-in-out',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
}));

const PulsatingFab = styled(StyledFab)({
    '@keyframes pulse': {
        '0%': {
            boxShadow: '0 0 0 0 rgba(245, 178, 7, 0.7)',
        },
        '70%': {
            boxShadow: '0 0 0 15px rgba(245, 178, 7, 0)',
        },
        '100%': {
            boxShadow: '0 0 0 0 rgba(245, 178, 7, 0)',
        },
    },
    animation: 'pulse 2s infinite',
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 16,
        padding: theme.spacing(1),
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
}));

interface OlympiadPromoButtonProps {
    // Add props here if needed in the future
}

const OlympiadPromoButton: React.FC<OlympiadPromoButtonProps> = () => {
    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleClickOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    const handleYes = (): void => {
        navigate('/olympiad');
        setOpen(false);
    };

    return (
        <>
            <Zoom in={true} timeout={1000}>
                <PulsatingFab
                    color="primary"
                    aria-label="olympiad"
                    onClick={handleClickOpen}
                >
                    <EmojiEventsIcon fontSize="medium" />
                </PulsatingFab>
            </Zoom>

            <StyledDialog
                open={open}
                onClose={handleClose}
                aria-labelledby="olympiad-dialog-title"
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle id="olympiad-dialog-title" sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <EmojiEventsIcon sx={{ fontSize: 40, color: '#f5b207' }} />
                    </Box>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        Олимпиада AFM Academy
                    </Typography>
                </DialogTitle>

                <DialogContent>
                    <Typography align="center" variant="body1" sx={{ mb: 2 }}>
                        Хотели бы вы принять участие в нашей олимпиаде?
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ justifyContent: 'center', pb: 3, pt: 1 }}>
                    <Button
                        onClick={handleYes}
                        variant="contained"
                        sx={{
                            bgcolor: '#f5b207',
                            '&:hover': { bgcolor: '#fca311' },
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Да
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        sx={{
                            color: '#666',
                            borderColor: '#ddd',
                            '&:hover': { borderColor: '#999' },
                            borderRadius: 2,
                            px: 3
                        }}
                    >
                        Нет
                    </Button>
                </DialogActions>
            </StyledDialog>
        </>
    );
};

export default OlympiadPromoButton;