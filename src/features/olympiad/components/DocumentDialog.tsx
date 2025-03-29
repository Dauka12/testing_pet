import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { saveAs } from 'file-saver';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const DocumentDialog = ({
    open,
    onClose,
    title,
    content,
    downloadFilename
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string;
    downloadFilename: string;
}) => {
    const theme = useTheme();
    const { t } = useTranslation();
    const renderFormattedContent = (text: string) => {
        const lines = text.split('\n');

        return lines.map((line, index) => {
            // Handle headings (lines that are all uppercase or start with number followed by dot)
            if (line.toUpperCase() === line && line.trim().length > 0 && !/^\d+\./.test(line)) {
                return (
                    <Typography
                        key={index}
                        variant="h6"
                        gutterBottom
                        sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.main,
                            mt: index > 0 ? 3 : 0
                        }}
                    >
                        {line}
                    </Typography>
                );
            }

            // Handle list items (lines starting with number + dot or dash)
            else if (/^\d+\./.test(line)) {
                return (
                    <Box key={index} sx={{ display: 'flex', mb: 1, pl: 2 }}>
                        <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                            {line.split('.')[0]}.
                        </Typography>
                        <Typography>{line.substring(line.indexOf('.') + 1)}</Typography>
                    </Box>
                );
            }
            else if (/^-\s/.test(line)) {
                return (
                    <Typography
                        key={index}
                        paragraph
                        sx={{ pl: 3, display: 'flex', alignItems: 'center' }}
                    >
                        <Box
                            component="span"
                            sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: theme.palette.primary.main,
                                mr: 1,
                                display: 'inline-block'
                            }}
                        />
                        {line.substring(1)}
                    </Typography>
                );
            }

            // Regular paragraphs
            else if (line.trim() !== '') {
                return (
                    <Typography
                        key={index}
                        paragraph
                        sx={{
                            mb: 2,
                            textAlign: 'justify',
                            lineHeight: 1.6
                        }}
                    >
                        {line}
                    </Typography>
                );
            }

            // Empty lines become small spacers
            return <Box key={index} sx={{ height: '0.5rem' }} />;
        });
    };

    // Download the Word document from assets
    const handleDownload = () => {
        try {
            const filePath = `${window.location.origin}/assets/files/${downloadFilename}.docx`;
            console.log(filePath);


            // First try to download the file from the server
            fetch(filePath)
                .then(response => {
                    if (response.ok) {
                        // File exists, proceed with download
                        const link = document.createElement('a');
                        link.href = filePath;
                        link.download = `${downloadFilename}.docx`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        // If file not found, fall back to creating it from text content
                        console.log("File not found, creating from text content");
                        const blob = new Blob([content], { type: 'application/msword' });
                        saveAs(blob, `${downloadFilename}.docx`);
                    }
                })
                .catch(error => {
                    console.error("Error downloading file:", error);
                    // Fall back to creating from text content
                    const blob = new Blob([content], { type: 'application/msword' });
                    saveAs(blob, `${downloadFilename}.docx`);
                });
        } catch (error) {
            console.error("Error in download handler:", error);
            const blob = new Blob([content], { type: 'application/msword' });
            saveAs(blob, `${downloadFilename}.docx`);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            PaperProps={{
                elevation: 5,
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: theme.palette.primary.main,
                color: 'white',
                py: 2
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <IconButton
                    edge="end"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ px: 4, py: 3, bgcolor: '#fcfcfc' }}>
                <Box sx={{ maxWidth: '850px', mx: 'auto' }}>
                    {renderFormattedContent(content)}
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2, bgcolor: '#f9f9f9' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FileDownloadIcon />}
                    onClick={handleDownload}
                    sx={{
                        borderRadius: 1.5,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                    }}
                >
                    {t('olympiad.downloadDocument')}
                </Button>
                <Button onClick={onClose} color="primary">
                    {t('olympiad.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};