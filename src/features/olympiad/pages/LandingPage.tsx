import DescriptionIcon from '@mui/icons-material/Description';
import EmailIcon from '@mui/icons-material/Email';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EventIcon from '@mui/icons-material/Event';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';

import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  StepIcon,
  Typography,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

// Import the image
import { useTranslation } from 'react-i18next';
import olympImage from '../assets/images/olymp.jpg';
import { instructionText, provisionText, regulationText } from '../assets/texts/LandingPageTexts.ts';

// Import floating components
import { useNavigate } from 'react-router';
import { DocumentDialog } from '../components/DocumentDialog.tsx';
import FloatingRegistrationButton from '../components/FloatingRegistrationButton.tsx';
import LanguageToggle from '../components/LanguageToggle.tsx';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionImg = motion.img;
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionButton = motion(Button);

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [regulationOpen, setRegulationOpen] = useState(false);
  const [provisionOpen, setProvisionOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'ru');
  const navigate = useNavigate();

  // Update current language when i18n language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <MotionPaper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          background: 'transparent'
        }}
      >
        <Box sx={{
          textAlign: 'center',
          pt: 3,
          pb: 2,
          position: 'relative'
        }}>
          <MotionTypography
            variant="h3"
            component="h1"
            fontWeight="bold"
            sx={{
              mb: 7,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #1A2751 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textAlign: 'center'
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            {t('olympiad.title')}
          </MotionTypography>

          {/* Image */}
          <MotionBox
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            sx={{
              height: 400,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              mt: 2,
              overflow: 'hidden',
            }}
          >
            <MotionImg
              src={olympImage}
              alt={t('olympiad.title')}
              style={{
                height: '100%',
                objectFit: 'cover'
              }}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
          </MotionBox>
        </Box>

        <Card
          elevation={2}
          sx={{
            mb: 5,
            mx: 2,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', lineHeight: 1.7 }}>
              {t('olympiad.description.organizers')}
            </Typography>

            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', lineHeight: 1.7 }}>
              {t('olympiad.description.purpose')}
            </Typography>

            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', lineHeight: 1.7 }}>
              {t('olympiad.description.eligibility')}
            </Typography>

            <Typography variant="body1" paragraph fontWeight="medium" color="primary.dark" sx={{ textAlign: 'justify', lineHeight: 1.7 }}>
              {t('olympiad.description.registration')} <b style={{ fontWeight: '600', cursor: 'pointer', color: 'blue' }} onClick={() => navigate('/olympiad/registration')}>{t('olympiad.register')}</b>.
            </Typography>

            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', lineHeight: 1.7 }}>
              {t('olympiad.description.format')}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
              {t('olympiad.stages.title')}
            </Typography>

            <Box sx={{ pl: 2 }}>
              <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ mr: 1 }}>1.</Box>
                {t('olympiad.stages.first')}
              </Typography>

              <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ mr: 1 }}>2.</Box>
                {t('olympiad.stages.second')}
              </Typography>

              <Typography variant="body1" paragraph sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ mr: 1 }}>3.</Box>
                {t('olympiad.stages.third')}
              </Typography>
            </Box>

            <Typography variant="body1" paragraph sx={{ textAlign: 'justify', lineHeight: 1.7, mt: 2 }}>
              {t('olympiad.description.winners')}
            </Typography>
          </CardContent>
        </Card>

        {/* Registration timeline */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#1A2751'
            }}
          >
            {t('olympiad.dates.title')}
          </Typography>

          <Timeline position="alternate">
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">20 {t('olympiad.months.march')} - 4 {t('olympiad.months.april')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.registration')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">5 {t('olympiad.months.april')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.firstStage')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">7 {t('olympiad.months.april')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.firstResults')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">10 {t('olympiad.months.april')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.secondStage')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">18 {t('olympiad.months.april')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.secondResults')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">19 {t('olympiad.months.april')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.appeal')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EventIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">5 {t('olympiad.months.may')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.thirdStage')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <EmojiEventsIcon />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={2} sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="subtitle2" component="span" color="primary">6 {t('olympiad.months.may')} 2025</Typography>
                  <Typography>{t('olympiad.timeline.results')}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              mb: 2,
              mx: 5,
              fontWeight: 'medium'
            }}
          >
            {t('olympiad.dates.registration')}
          </Typography>

          {/* Add the buttons here */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 4,
              mb: 4
            }}
          >
            <MotionButton
              variant="contained"
              color="primary"
              size="large"
              startIcon={<DescriptionIcon />}
              onClick={() => setInstructionOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: 2,
                px: 3,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              {t('olympiad.instruction')}
            </MotionButton>
            <MotionButton
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GavelIcon />}
              onClick={() => setRegulationOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: 2,
                px: 3,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              {t('olympiad.regulation')}
            </MotionButton>
            <MotionButton
              variant="contained"
              color="primary"
              size="large"
              startIcon={<StepIcon />}
              onClick={() => setProvisionOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              sx={{
                borderRadius: 2,
                px: 3,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
              }}
            >
              {t('olympiad.provision')}
            </MotionButton>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 3,
              mt: 5,
              fontWeight: 'bold',
              color: '#1A2751'
            }}
          >
            {t('olympiad.additionalInfo.title')}
          </Typography>

          <Typography variant="body1" paragraph sx={{ textAlign: 'center', mb: 3 }}>
            {t('olympiad.additionalInfo.content')}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Chip
              label="sodrujestvo.org/ru"
              component="a"
              href="https://sodrujestvo.org/ru"
              target="_blank"
              clickable
              color="primary"
              variant="outlined"
            />
            <Chip
              label="rosfinolymp.ru"
              component="a"
              href="https://rosfinolymp.ru"
              target="_blank"
              clickable
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 5 }} />

        {/* Contact Information - Enhanced section */}
        <Box sx={{ mb: 4, mx: 2 }}>
          <MotionTypography
            variant="h5"
            component="h2"
            gutterBottom
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#1A2751'
            }}
          >
            {t('olympiad.contacts.title')}
          </MotionTypography>

          <MotionTypography
            variant="body1"
            sx={{ mb: 3, fontWeight: 500, textAlign: 'center' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {t('olympiad.contacts.responsiblePersons')}
          </MotionTypography>

          <MotionGrid
            container
            spacing={3}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                title: t('olympiad.contacts.organizations.lawEnforcementAcademy'),
                name: "Муратжан Зарина Какимжановна",
                position: t('olympiad.contacts.positions.seniorLecturer'),
                phone: "+7 777 022 2251",
                email: "7340208@prokuror.gov.kz"
              },
              {
                title: t('olympiad.contacts.organizations.karagandaUniversity'),
                name: "Кусаинова Лариса Канатовна",
                position: t('olympiad.contacts.positions.headCriminalLaw'),
                phone: "+7 702 779 7673",
                email: "klarisa_777@mail.ru"
              },
              {
                title: t('olympiad.contacts.organizations.turanUniversity'),
                name: "Селезнева Ирина Владимировна",
                position: t('olympiad.contacts.positions.headFinance'),
                phone: "+7 701 555 6067",
                email: "i.selezneva@turan-edu.kz"
              },
              {
                title: t('olympiad.contacts.organizations.amlAcademy'),
                name: "Кусаинов Дархан Шыныбекович",
                position: t('olympiad.contacts.positions.leadingExpert'),
                phone: "+7 701 512 6680",
                email: "kussainovd@mail.ru"
              }
            ].map((contact, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <MotionCard
                  elevation={3}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)'
                  }}
                  sx={{
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: `linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(249,249,249,1) 100%)`
                  }}
                >
                  <CardContent sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3
                  }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          mr: 1.5,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <PersonIcon />
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                          color: theme.palette.primary.dark,
                          lineHeight: 1.2,
                          fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}
                      >
                        {contact.title}
                      </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, mb: 2 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          mb: 0.5
                        }}
                      >
                        {contact.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}
                      >
                        {contact.position}
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                        '&:hover': { color: theme.palette.primary.main }
                      }}>
                        <PhoneIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            color: theme.palette.primary.main,
                            fontSize: '1rem'
                          }}
                        />
                        <Typography
                          variant="body2"
                          component="a"
                          href={`tel:${contact.phone}`}
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            '&:hover': { color: theme.palette.primary.main }
                          }}
                        >
                          {contact.phone}
                        </Typography>
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        '&:hover': { color: theme.palette.primary.main }
                      }}>
                        <EmailIcon
                          fontSize="small"
                          sx={{
                            mr: 1,
                            color: theme.palette.primary.main,
                            fontSize: '1rem'
                          }}
                        />
                        <Typography
                          variant="body2"
                          component="a"
                          href={`mailto:${contact.email}`}
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            '&:hover': { color: theme.palette.primary.main }
                          }}
                        >
                          {contact.email}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </MotionGrid>
        </Box>

        {/* Dialog components */}
        <DocumentDialog
          open={instructionOpen}
          onClose={() => setInstructionOpen(false)}
          title="Инструкция"
          content={instructionText}
          downloadFilename="Инструкция_Олимпиада"
        />

        <DocumentDialog
          open={regulationOpen}
          onClose={() => setRegulationOpen(false)}
          title="Регламент"
          content={regulationText}
          downloadFilename="Регламент_Эссе"
        />

        <DocumentDialog
          open={provisionOpen}
          onClose={() => setProvisionOpen(false)}
          title="Положение"
          content={provisionText}
          downloadFilename="Положение"
        />

        {/* Floating components */}
        <FloatingRegistrationButton />
        <LanguageToggle />
      </MotionPaper>
    </Container>
  );
};

export default LandingPage;