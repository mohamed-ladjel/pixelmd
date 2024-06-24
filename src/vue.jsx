import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Pridector from './pridector';
import { alpha } from '@mui/material';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom'; // Import useLocation hook
import axios from 'axios'; // Import axios for making HTTP requests
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from './components/landing-page/getLPTheme';
import Typography from '@mui/material/Typography';
import logo from './components/landing-page/assets/logo.png'
import networkIcon from './assets/stars.png'
import './vue.css'
import RunnerCard from './RunnerCard';

function Vue() {
  const [startAnimation, setStartAnimation] = useState(false);
  const [maskUrl, setMaskUrl] = useState(null); // State to store the mask URL
  const [buttonClicked, setButtonClicked] = useState(false); // State to track button click
  const [showRunnerCard, setShowRunnerCard] = useState(false); // State to control RunnerCard visibility
  const location = useLocation(); // Use useLocation hook to access the location object
  const [mode, setMode] = useState('light'); // State for theme mode
  const LPtheme = createTheme(getLPTheme(mode)); // Create LP theme
  const defaultTheme = createTheme({ palette: { mode } }); // Create default theme
  const [animationMode, setAnimationMode] = useState(1); // 1: Not animating, 2: Animating in loop, 3: Animating once


  useEffect(() => {
    // Effect to change theme mode based on mode state
    const toggleColorMode = () => {
      setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };
    toggleColorMode(); // Initial theme mode
  }, []);

  const handleButtonClick = async () => {
    setShowRunnerCard(true); // Show RunnerCard immediately
    setButtonClicked(true);
    setStartAnimation(true);
    handleLoopAnimation()

  
    try {
      // Make a request to the server to get the mask URL
      const response = await axios.get('http://localhost:5000/mask', {
        params: { file_path: location.state.fileUrl }
      });
      const maskUrl = response.data.mask_url;
      console.log('Uploaded File URL:', location.state.fileUrl);
      console.log('Mask URL:', maskUrl);
      setMaskUrl(maskUrl);
      setStartAnimation(true);
      setShowRunnerCard(false); // Show RunnerCard immediately
      handleStartAnimation();

    } catch (error) {
      console.error('Error fetching mask URL:', error);
    }
  };
    const handleCancel = () => {
    setStartAnimation(false);
    setButtonClicked(false);
    setShowRunnerCard(false); // Hide RunnerCard pop-up
  };

  const handleStartAnimation = () => {
    setAnimationMode(3);
  };

  const handleLoopAnimation = () => {
    setAnimationMode(2);
  };

  // Extract the file URL from the location state
  const fileUrl = location.state?.fileUrl;
  console.log('Uploaded File URL:', fileUrl);

  return (
    <ThemeProvider theme={LPtheme}>
      <div className="topbar">
        <div className="left-content">
          <img src={logo} alt="Logo" className="logo" style={{ width: '80px', height: 'auto' }} />
          <Typography
            variant="h1"
            fontFamily='Inter, sans-serif'
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignSelf: 'center',
              textAlign: 'center',
              fontWeight:'600',
              fontSize:'35px',
              fontFamily:  'Inter, sans-serif'
            }}
          >
            Pixel&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize:'35px',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                  fontFamily:  'Inter, sans-serif'
              }}
            >
              MD
            </Typography>
          </Typography>
        </div>
        <div className="right-content">
          <button className="button" onClick={handleButtonClick}> Segment <img src={networkIcon} alt="Network Icon" className="icon" /></button>
        </div>
      </div>
      {showRunnerCard && <RunnerCard onCancel={handleCancel} />}
      <Box sx={{ textAlign: 'center' }}>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 0, sm: 0 },
            alignSelf: 'center',
            height: { xs: 300, sm: 610 },
            maxHeight: { xs: 300, sm: 700 },
            width: '80%',
            maxWidth: '105%',
            margin: 'auto',
            backgroundImage:
              theme.palette.mode === 'light'
                ? 'url("/static/images/templates/templates-images/hero-light.png")'
                : 'url("/static/images/templates/templates-images/hero-dark.png")',
            backgroundSize: 'cover',
            backgroundColor: 'white',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor:
              theme.palette.mode === 'light'
                ? alpha('#BFCCD9', 0.5)
                : alpha('#9CCCFC', 0.1),
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 12px 8px ${alpha('#9CCCFC', 0.5)}`
                : `0 0 24px 12px ${alpha('#033363', 0.5)}`,
          })}
        >
          {/* Conditional rendering based on whether the button is clicked */}
          {maskUrl ? (
            <Pridector startAnimation={startAnimation}  fileUrl={fileUrl} maskUrl={maskUrl} animationMode={animationMode}/>
          ) : (
            <Pridector startAnimation={startAnimation} fileUrl={fileUrl} animationMode={animationMode} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Vue;
