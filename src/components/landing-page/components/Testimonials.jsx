import Card from '../../card/Card';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import bone from '../assets/bone.nii.gz';
import bone2 from '../assets/bone_label.nii.gz';

const images = [
  {
    imageUrl: bone,
  },
  {
    imageUrl: bone2,
  },
  // Add more images as needed
];

function Testimonials() {
  return (
    <>
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Card imageUrl={bone} />
      </div>
    </div>

    </>

    
  );
}

export default Testimonials;
