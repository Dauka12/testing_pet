import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MotionBox = motion(Box);

const LanguageToggle: React.FC = () => {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'ru');

    useEffect(() => {
        setCurrentLanguage(i18n.language);
    }, [i18n.language]);

    const handleLanguageChange = (
        _event: React.MouseEvent<HTMLElement>,
        newLanguage: string | null
    ) => {
        if (newLanguage) {
            i18n.changeLanguage(newLanguage);
            setCurrentLanguage(newLanguage);
        }
    };

    return (
        <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
                position: 'fixed',
                top: 20,
                right: 30,
                zIndex: 1000,
            }}
        >
            <Tooltip title="Сменить язык / Тілді ауыстыру" arrow>
                <ToggleButtonGroup
                    value={currentLanguage}
                    exclusive
                    onChange={handleLanguageChange}
                    aria-label="language selector"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                        '& .MuiToggleButton-root': {
                            px: 2,
                            py: 0.7,
                            fontWeight: 'bold',
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            }
                        }
                    }}
                >
                    <ToggleButton value="ru" aria-label="Russian language">RU</ToggleButton>
                    <ToggleButton value="kz" aria-label="Kazakh language">KZ</ToggleButton>
                </ToggleButtonGroup>
            </Tooltip>
        </MotionBox>
    );
};

export default LanguageToggle;