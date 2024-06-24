import React from 'react';
import Typography from '@mui/material/Typography';
import logo from './components/landing-page/assets/logo.png'
import networkIcon from './assets/stars.png'
import './Demo.css'

const Demo = () => {
  return (
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
            fontSize: 'clamp(3.5rem, 10vw, 4rem)',
            fontWeight:'600',
            fontSize:'35px',
            fontFamily:  'Inter, sans-serif'
          }}
        >
          Voltera&nbsp;
          <Typography
            component="span"
            variant="h1"
            sx={{
              fontSize: 'clamp(3rem, 10vw, 4rem)',
              fontSize:'35px',

              color: (theme) =>
                theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                fontFamily:  'Inter, sans-serif'
                
            }}
          >
            SAM
          </Typography>
        </Typography>
      </div>
      <div className="right-content">
        <button className="button">Segment <img src={networkIcon} alt="Network Icon" className="icon" /></button>
      </div>
    </div>
  );
};

export default Demo;
