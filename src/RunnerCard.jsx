import React, { useState, useEffect } from 'react';
import scanner from './assets/scanning.gif';
import icn from './assets/icn-nn.svg';
import arrowIcon from './assets/arrow-icn.svg';
import stackIcon from './assets/stack.svg';

const RunnerCard = ({ onCancel }) => {
  const [phrases, setPhrases] = useState([
    "Extracting an embedding for the image...",
    "Analyzing image features...",
    "Processing neural network predictions...",
    "Generating contextual embeddings...",
    "Applying machine learning algorithms...",
    "Optimizing model parameters...",
    "Refining image representations...",
    "Evaluating neural network performance...",
  ]);
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) =>
        (prevIndex + 1) % phrases.length
      );
    }, 2000); // Change phrase every 2 seconds

    return () => clearInterval(timer);
  }, [phrases]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999,
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      width:'550px'
    }}>
      <div style={{
        padding:'10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <img src={scanner} style={{ width: '3.5rem', marginRight: '12px' }} />
        <img src={arrowIcon} style={{ marginRight: '12px' }} />
        <img src={icn} />
        <img src={arrowIcon} style={{ marginRight: '12px' }} />
        <img src={stackIcon} />
      </div>
      <p style={{
        fontSize: '20px',
        lineHeight: '21.6px',
        fontWeight: 500,
        paddingTop: '16px',
        paddingBottom: '16px',
        margin: '0px',
        textAlign: 'center',
      }}>{phrases[currentPhraseIndex]}</p>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: 'rgba(61, 68, 81, 0.2)',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '16px',
      }}>
        <div style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#3D4451',
          position: 'absolute',
          animation: 'progressAnimation 2s linear infinite',
        }}></div>
      </div>
      <button onClick={onCancel} style={{
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '21.6px',
        paddingTop: '32px',
        cursor: 'pointer',
        color: 'rgb(31, 41, 55)',
        margin: 'auto', // Center both vertically and horizontally
        padding: '32px 0px 0px',
        border: 'none',
        backgroundColor: 'transparent',
        display: 'flex', // Use flexbox
        justifyContent: 'center', // Center horizontally
        alignItems: 'center', // Center vertically
      }}>Cancel</button>

      <style>
        {`
          @keyframes progressAnimation {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>
    </div>
  );
}

export default RunnerCard;
