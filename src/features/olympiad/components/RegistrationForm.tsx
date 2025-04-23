import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
    Box,
    Button,
    CircularProgress,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOlympiadDispatch, useOlympiadSelector } from '../hooks/useOlympiadStore.ts';
import { registerStudentThunk } from '../store/slices/registrationSlice.ts';
import { RegisterStudentRequest } from '../types/student.ts';
import { ConfirmationModal } from './ConfirmationModal.tsx';

const MotionPaper = motion(Paper);

interface FormErrors {
    firstname?: string;
    lastname?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
}

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useOlympiadDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();
    const { isLoading, success, error } = useOlympiadSelector((state) => state.registration);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const [formData, setFormData] = useState<RegisterStudentRequest & { confirmPassword: string }>({
        firstname: '',
        lastname: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (success) {
            // Simulate API response delay for better UX
            const timer = setTimeout(() => {
                navigate('/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstname.trim()) newErrors.firstname = t('registration.errors.firstnameRequired');
        if (!formData.lastname.trim()) newErrors.lastname = t('registration.errors.lastnameRequired');

        if (!formData.phone.trim()) newErrors.phone = t('registration.errors.phoneRequired');
        else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, '')))
            newErrors.phone = t('registration.errors.phoneFormat');

        if (!formData.password) newErrors.password = t('registration.errors.passwordRequired');
        else if (formData.password.length < 6)
            newErrors.password = t('registration.errors.passwordLength');

        if (!formData.confirmPassword) newErrors.confirmPassword = t('registration.errors.confirmPasswordRequired');
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = t('registration.errors.passwordsMatch');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: undefined,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Show confirmation modal instead of dispatching immediately
            setConfirmModalOpen(true);
        }
    };

    const handleConfirmSubmit = () => {
        // Create a request object that only includes the fields expected by the API
        const requestBody = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            phone: formData.phone,
            password: formData.password
        };

        // Pass only the fields required by the API
        dispatch(registerStudentThunk(requestBody));
    };

    return (
        <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={3}
            sx={{
                p: isMobile ? 3 : 4,
                maxWidth: 800,
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                mx: isMobile ? 2 : 0,
            }}
        >
            <Box display="flex" flexDirection="column" alignItems="center" mb={isMobile ? 3 : 4}>
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <EmojiEventsIcon sx={{
                        fontSize: isMobile ? 50 : 60,
                        color: '#f5b207',
                        mb: 2
                    }} />
                </motion.div>
                <Typography
                    component="h1"
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                        fontWeight: 700,
                        color: '#1A2751',
                        textAlign: 'center',
                        mb: 1
                    }}
                >
                    {t('registration.title')}
                </Typography>
                <Typography
                    variant={isMobile ? "body2" : "subtitle1"}
                    sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                        maxWidth: '95%'
                    }}
                >
                    {t('registration.subtitle')}
                </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.lastname')}
                            name="lastname"
                            variant="outlined"
                            value={formData.lastname}
                            onChange={handleChange}
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.firstname')}
                            name="firstname"
                            variant="outlined"
                            value={formData.firstname}
                            onChange={handleChange}
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.phone')}
                            name="phone"
                            variant="outlined"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            disabled={isLoading}
                            placeholder="+7 (XXX) XXX-XX-XX"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.password')}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            helperText={errors.password}
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.confirmPassword')}
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            variant="outlined"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            disabled={isLoading}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>

                {error && (
                    <Box mt={2}>
                        <FormHelperText error>{error}</FormHelperText>
                    </Box>
                )}

                <Box
                    mt={4}
                    display="flex"
                    justifyContent="space-between"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={2}
                >
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                        sx={{
                            borderColor: '#1A2751',
                            color: '#1A2751',
                            '&:hover': {
                                borderColor: '#1A2751',
                                backgroundColor: 'rgba(26, 39, 81, 0.04)',
                            },
                            px: 4,
                            py: 1,
                        }}
                    >
                        {t('registration.buttons.haveAccount')}
                    </Button>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{
                                bgcolor: '#1A2751',
                                '&:hover': {
                                    bgcolor: '#13203f',
                                },
                                px: 4,
                                py: 1,
                            }}
                            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isLoading ? t('registration.buttons.registering') :
                                success ? t('registration.buttons.registerSuccess') :
                                    t('registration.buttons.register')}
                        </Button>
                    </motion.div>
                </Box>
            </form>

            <ConfirmationModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                formData={formData}
                loading={isLoading}
            />
        </MotionPaper>
    );
};

export default RegistrationForm;