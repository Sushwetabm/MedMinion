import React, { useEffect, useRef, useState } from 'react';
import { Box, Grid, styled, Typography, keyframes } from '@mui/material';
import Title from './Title'; // Assuming Title is another component you use for the headings
import imgDetail from '../../img/img.png';
import imgDetail2 from '../../img/img2.png';

// Keyframes for fade-in animation
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const GetStarted = () => {
  // State to track visibility of sections
  const [visible, setVisible] = useState({
    patientsSection: false,
    doctorsSection: false,
  });

  // Refs to observe sections
  const patientsRef = useRef(null);
  const doctorsRef = useRef(null);

  useEffect(() => {
    const options = {
      threshold: 0.1, // Trigger when 10% of the element is visible
    };

    const handleObserver = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-id');
          setVisible((prev) => ({ ...prev, [id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (patientsRef.current) observer.observe(patientsRef.current);
    if (doctorsRef.current) observer.observe(doctorsRef.current);

    // Clean up observer on component unmount
    return () => {
      if (patientsRef.current) observer.unobserve(patientsRef.current);
      if (doctorsRef.current) observer.unobserve(doctorsRef.current);
    };
  }, []);

  // Custom components with fade-in animation when visible
  const CustomGridItem = styled(Grid)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'beige',
  });

  const CustomTypography = styled(Typography)(({ visible }) => ({
    fontSize: '1.1rem',
    textAlign: 'start',
    lineHeight: '1.5',
    color: '#515151',
    marginTop: '1.5rem',
    opacity: visible ? 1 : 0,
    animation: visible ? `${fadeIn} 1.2s ease-in-out forwards` : 'none',
  }));

  const animatedTitleSx = (visible) => ({
    fontWeight: 700,
    fontSize: '2rem',
    color: '#000',
    opacity: visible ? 1 : 0,
    animation: visible ? `${fadeIn} 1.5s ease-in-out forwards` : 'none',
  });

  return (
    <Grid container spacing={{ xs: 4, sm: 4, md: 0 }} sx={{ py: 0.5, px: 1 }}>
      {/* Patients Section */}
      <CustomGridItem
        item
        xs={12}
        sm={8}
        md={6}
        ref={patientsRef}
        data-id="patientsSection"
      >
        <Box component="article" sx={{ px: 4 }}>
          <Title
            text="MedMinion for Patients"
            textAlign="start"
            sx={animatedTitleSx(visible.patientsSection)}
          />
          <CustomTypography visible={visible.patientsSection} sx={{ fontSize: '1.5rem' }} >
            <br />
            <strong>We help you manage your healthcare effortlessly by providing:</strong><br />
            <br /><br />
            <ul>
              <li>Booking an appointment made so easy, even your cat could do it! (Rescheduling and canceling too, just in case life happens.)</li>
              <br /><br />
              <li>Your appointments, organized and ready – so you can stop pretending you remember them!</li>
              <br /><br />
              <li>Get full access to your medical test results – no need to send a Minion on a top-secret mission to find them!</li>
              <br /><br />
              <li>A simple, user-friendly interface – because if Minions can navigate it, so can you!</li>
              <br /><br />
              <li>A streamlined experience that saves time and reduces hassle.</li>
            </ul>

          </CustomTypography>
        </Box>
      </CustomGridItem>

      <Grid item xs={12} sm={4} md={6}>
        <img
          src={imgDetail}
          alt=""
          style={{
            marginTop: 0,
            width: '100%',
            opacity: visible.patientsSection ? 1 : 0,
            animation: visible.patientsSection
              ? `${fadeIn} 1.5s ease-in-out forwards`
              : 'none',
          }}
        />
      </Grid>

      {/* Doctors Section */}
      <Grid
        item
        xs={12}
        sm={4}
        md={6}
        ref={doctorsRef}
        data-id="doctorsSection"
        sx={{
          order: { xs: 4, sm: 4, md: 3 },
        }}
      >
        <img
          src={imgDetail2}
          alt=""
          style={{
            width: '100%',
            marginTop: 0,
            opacity: visible.doctorsSection ? 1 : 0,
            animation: visible.doctorsSection
              ? `${fadeIn} 1.5s ease-in-out forwards`
              : 'none',
          }}
        />
      </Grid>

      <CustomGridItem
        item
        xs={12}
        sm={8}
        md={6}
        sx={{
          order: { xs: 3, sm: 3, md: 4 },
        }}
      >
        <Box component="article" sx={{ py: 2, px: 4 }}>
          <Title
            text="MedMinion for Doctors"
            textAlign="start"
            sx={animatedTitleSx(visible.doctorsSection)}
          />
          <CustomTypography visible={visible.doctorsSection} sx={{ fontSize: '1.5rem' }}>
            <br/><br/>
            <strong>Our platform offers a comprehensive solution that allows you to:</strong><br /><br/>
            <ul>
              <li>View and organize your appointments in real-time – no more lost sticky notes or crumpled appointment cards!<br /><br /><br /></li>
              <li>Automate prescription management, so you don’t have to write the same medications for different patients repeatedly.<br /><br /><br /></li>
              <li>Upload and organize patients' test results effortlessly – no need for Minion-level chaos or confusion!<br /><br /><br /></li>
            </ul>

          </CustomTypography>
        </Box>
      </CustomGridItem>
    </Grid>
  );
};

export default GetStarted;
