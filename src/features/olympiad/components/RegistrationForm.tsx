import { Visibility, VisibilityOff } from '@mui/icons-material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAllCategories } from '../api/examApi.ts';
import { useOlympiadDispatch, useOlympiadSelector } from '../hooks/useOlympiadStore.ts';
import { registerStudentThunk } from '../store/slices/registrationSlice.ts';
import { RegisterStudentRequest } from '../types/student.ts';
import { TestCategory } from '../types/testCategory.ts';
import { ConfirmationModal } from './ConfirmationModal.tsx';

const MotionPaper = motion(Paper);

interface FormErrors {
    firstname?: string;
    lastname?: string;
    middlename?: string;
    iin?: string;
    phone?: string;
    university?: string;
    email?: string;
    password?: string;
    studyYear?: number;
    confirmPassword?: string;
    categoryId?: string;
}

const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useOlympiadDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { t, i18n } = useTranslation(); // Add translation hook
    const { isLoading, success, error } = useOlympiadSelector((state) => state.registration);

    const [categories, setCategories] = useState<TestCategory[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const [formData, setFormData] = useState<RegisterStudentRequest & { confirmPassword: string }>({
        firstname: '',
        lastname: '',
        middlename: '',
        iin: '',
        phone: '',
        studyYear: 1,
        university: '',
        email: '',
        password: '',
        confirmPassword: '',
        categoryId: 0
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (success) {
            // Simulate API response delay for better UX
            const timer = setTimeout(() => {
                navigate('/olympiad/login');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const fetchedCategories = await getAllCategories();
                setCategories(fetchedCategories);
                // Set default category if available
                if (fetchedCategories.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        categoryId: fetchedCategories[0].id
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [t]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstname.trim()) newErrors.firstname = t('registration.errors.firstnameRequired');
        if (!formData.lastname.trim()) newErrors.lastname = t('registration.errors.lastnameRequired');
        if (!formData.iin.trim()) newErrors.iin = t('registration.errors.iinRequired');
        else if (!/^\d{12}$/.test(formData.iin)) newErrors.iin = t('registration.errors.iinFormat');

        if (!formData.phone.trim()) newErrors.phone = t('registration.errors.phoneRequired');
        else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, '')))
            newErrors.phone = t('registration.errors.phoneFormat');

        if (!formData.university.trim()) newErrors.university = t('registration.errors.universityRequired');

        if (!formData.email.trim()) newErrors.email = t('registration.errors.emailRequired');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = t('registration.errors.emailFormat');

        if (!formData.password) newErrors.password = t('registration.errors.passwordRequired');
        else if (formData.password.length < 6)
            newErrors.password = t('registration.errors.passwordLength');

        if (!formData.confirmPassword) newErrors.confirmPassword = t('registration.errors.confirmPasswordRequired');
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = t('registration.errors.passwordsMatch');

        if (!formData.categoryId) newErrors.categoryId = t('registration.errors.categoryRequired');

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

    const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (name) {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Update the handleSubmit function to show modal instead of submitting right away
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Show confirmation modal instead of dispatching immediately
            setConfirmModalOpen(true);
        }
    };

    // Add a new function to handle the final submission
    const handleConfirmSubmit = () => {
        const { confirmPassword, ...registerData } = formData;
        dispatch(registerStudentThunk(registerData));
        // Modal will stay open until redirect to login page 
        // (since success state will trigger the useEffect that navigates)
    };

    // Find the category name for the selected category
    const selectedCategoryName = categories.find(cat => cat.id === formData.categoryId)
        ? i18n.language === 'kz'
            ? categories.find(cat => cat.id === formData.categoryId)?.nameKaz
            : categories.find(cat => cat.id === formData.categoryId)?.nameRus
        : '';

    return (
        <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={3}
            sx={{
                p: isMobile ? 3 : 4, // Adjust padding for mobile
                maxWidth: 800,
                width: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                mx: isMobile ? 2 : 0, // Add margin on mobile
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.middlename')}
                            name="middlename"
                            variant="outlined"
                            value={formData.middlename}
                            onChange={handleChange}
                            error={!!errors.middlename}
                            helperText={errors.middlename}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.iin')}
                            name="iin"
                            variant="outlined"
                            value={formData.iin}
                            onChange={handleChange}
                            error={!!errors.iin}
                            helperText={errors.iin}
                            disabled={isLoading}
                            inputProps={{ maxLength: 12 }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                        <FormControl fullWidth error={!!errors.studyYear} disabled={isLoading}>
                            <InputLabel id="studyYear-label">{t('registration.fields.studyYear')}</InputLabel>
                            <Select
                                labelId="studyYear-label"
                                id="studyYear"
                                name="studyYear"
                                value={formData.studyYear}
                                onChange={handleSelectChange}
                                label={t('registration.fields.studyYear')}
                            >
                                {[1, 2, 3, 4].map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.studyYear && (
                                <FormHelperText>{errors.studyYear}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.university')}
                            name="university"
                            variant="outlined"
                            value={formData.university}
                            onChange={handleChange}
                            error={!!errors.university}
                            helperText={errors.university}
                            disabled={isLoading}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={t('registration.fields.email')}
                            name="email"
                            type="email"
                            variant="outlined"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            disabled={isLoading}
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
                    <Grid item xs={12}>
                        <FormControl fullWidth error={!!errors.categoryId} disabled={isLoading || loadingCategories}>
                            <InputLabel id="category-label">{t('registration.fields.category')}</InputLabel>
                            <Select
                                labelId="category-label"
                                id="category"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleSelectChange}
                                label={t('registration.fields.category')}
                            >
                                {loadingCategories ? (
                                    <MenuItem value={0} disabled>{t('registration.loading')}</MenuItem>
                                ) : (
                                    categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {i18n.language === 'kz' ? category.nameRus : category.nameKaz}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                            {errors.categoryId && (
                                <FormHelperText>{errors.categoryId}</FormHelperText>
                            )}
                        </FormControl>
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
                        onClick={() => navigate('/olympiad/login')}
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

            {/* Add confirmation modal */}
            <ConfirmationModal
                open={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                formData={formData}
                loading={isLoading}
                categoryName={selectedCategoryName}
            />
        </MotionPaper>
    );
};

export default RegistrationForm;