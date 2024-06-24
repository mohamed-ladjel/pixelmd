import React, { useState } from 'react';

import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FileUpload from './FileUpload';
import Card from '../../card/Card';
import Pridector from '../../../pridector';
import bone from '../assets/bone.nii.gz'
import Testimonials from './Testimonials';
import AutomaticFileUpload from '../../card/automatic';
export default function Hero() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mode, setMode] = React.useState('light');
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  return (
    <Box
      id="Home"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat',
        fontFamily:  'Inter, sans-serif'

      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
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
              fontFamily:  'Inter, sans-serif'

            }}
          >
            Pixel&nbsp;
            <Typography
              component="span"
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 4rem)',
                color: (theme) =>
                  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                  fontFamily:  'Inter, sans-serif'

              }}
            >
              MD
            </Typography>
          </Typography>
          <Typography
            textAlign="center"
            color="text.secondary"
            sx={{fontWeight:"bold", fontSize :'20px' ,alignSelf: 'center', width: { sm: '100%', md: '100%' } }}
          >
            Revolutionize healthcare with our AI-powered lesion detection and segmentation tool.
            Instant, accurate results for swift patient care. Experience precision at its finest
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignSelf="center"
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
          >
            <FileUpload onFileSelect={handleFileSelect} />


          </Stack>
          <Typography textAlign="center" component="h2" variant="h4" color="text.primary">
          Or choose from the examples below
        </Typography>
        <Typography textAlign="center" variant="body3" color="text.secondary">
        Discover different lesion categories prevalent in abdominal and thoracic imaging. From tumors to cysts, select the lesion type you wish to segment and analyze with precision.
        </Typography>

        </Stack>
        <Box
          id="Examples"
          sx={(theme) => ({ 
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 300, sm: 700 },
            maxHeight:{ xs: 300, sm: 700 },
            width: '105%',
            maxWidth: '105%',
            // maxHeight:'120%',
            // height: '120%',
            backgroundColor:'white',
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
          {/* <Testimonials/> */}
      <Card imageUrl={bone} />
      {/* <AutomaticFileUpload/> */}
          {/* <Pridector/> */}
          </Box>
      </Container>
    </Box>
  );
}
