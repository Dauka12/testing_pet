import { EmojiEvents as TrophyIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { clearAuthError, loginUser } from '../store/slices/authSlice.ts';

const MotionPaper = motion(Paper);

const LoginForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect on successful login
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when inputs change
  useEffect(() => {
    if (phone) setPhoneError('');
    if (password) setPasswordError('');
    if (error) dispatch(clearAuthError());
  }, [phone, password, dispatch, error]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validate phone
    if (!phone.trim()) {
      setPhoneError(t('login.errors.phoneRequired'));
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) {
      setPhoneError(t('login.errors.phoneFormat'));
      isValid = false;
    }

    // Validate password
    if (!password) {
      setPasswordError(t('login.errors.passwordRequired'));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(loginUser({ phone, password }));
    }
  };

  const handleGoToRegistration = () => {
    navigate('/registration');
  };

  return (
    <MotionPaper
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      elevation={3}
      sx={{
        p: isMobile ? 3 : 4,
        maxWidth: 450,
        width: '100%',
        borderRadius: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        mx: isMobile ? 2 : 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3
        }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TrophyIcon
            sx={{
              fontSize: isMobile ? 50 : 60,
              color: '#f5b207',
              mb: 2
            }}
          />
        </motion.div>
        <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          {t('login.title')}
        </Typography>
        <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" sx={{ textAlign: 'center' }}>
          {t('login.subtitle')}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box mb={2.5}>
          <TextField
            label={t('login.fields.phone')}
            variant="outlined"
            fullWidth
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={!!phoneError}
            helperText={phoneError}
            placeholder="+7 (XXX) XXX-XX-XX"
            disabled={loading}
            autoFocus
          />
        </Box>

        <Box mb={3}>
          <TextField
            label={t('login.fields.password')}
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            disabled={loading}
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
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2
          }}
        >
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGoToRegistration}
            disabled={loading}
            sx={{
              borderColor: '#1A2751',
              color: '#1A2751',
              '&:hover': {
                borderColor: '#1A2751',
                backgroundColor: 'rgba(26, 39, 81, 0.04)',
              },
              order: { xs: 2, sm: 1 }
            }}
          >
            {t('login.buttons.register')}
          </Button>

          <Box sx={{ order: { xs: 1, sm: 2 } }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: '#1A2751',
                  '&:hover': {
                    bgcolor: '#13203f',
                  },
                  minWidth: '120px',
                }}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? t('login.buttons.loggingIn') : t('login.buttons.login')}
              </Button>
            </motion.div>
          </Box>
        </Box>



      </form>
    </MotionPaper>
  );
};

export default LoginForm;