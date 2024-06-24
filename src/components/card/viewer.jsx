import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import { Niivue } from "@niivue/niivue";

// Import your image files
import kidney from '../../assets/kidney.nii.gz';
import bone from '../../assets/bone.nii.gz';
import lidcidri from '../../assets/lidcidri.nii.gz';
import deep from '../../assets/deep.nii.gz';
import ABD_LYMPH from '../../assets/ABD_LYMPH.nii.gz';
import colon from '../../assets/colon.nii.gz';
import liver from '../../assets/liver.nii.gz';
import lung from '../../assets/lung.nii.gz';
import MED_LYMPH from '../../assets/MED_LYMPH.nii.gz';
import ex1 from "../../assets/example1.nii.gz"
import ex2 from "../../assets/example2.nii.gz"
import ex3 from "../../assets/example3.nii.gz"
import infoIcon from "../../assets/info.png"
function NiiVueComponent() {
  const history = useHistory();
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrls = [kidney, bone, lidcidri, ex1, ABD_LYMPH, colon, ex2, liver, ex3, lung, MED_LYMPH, deep]; 
  const imagesInfo = ["kidney", "bone", "lidcidri", "ex1", "ABD_LYMPH", "colon", "ex2", "liver", "ex3", "lung", "MED_LYMPH", "deep"]; 

  const [selectedCanvasIndex, setSelectedCanvasIndex] = useState(null);

  const handleInfoButtonClick = (index) => {
    setSelectedCanvasIndex(index);
  };

  useEffect(() => {
    async function initializeNiiVue() {
      const defaults = {
        logging: false,
        dragAndDropEnabled: false,
        show3Dcrosshair: false,
        backColor: [1, 1, 1, 1]
      };

      const nvInstances = [];

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          const canvasId = `gl${row}${col}`;
          const nv = new Niivue(defaults);
          nv.setRadiologicalConvention(false);
          nv.attachTo(canvasId);
          nvInstances.push(nv);
        }
      }

      for (let i = 0; i < nvInstances.length; i++) {
        const nv = nvInstances[i];
        const imageUrl = imageUrls[i % imageUrls.length]; // Corrected line
        const volumeList = [
          {
            url: imageUrl,
            cal_min: -1000,
            cal_max: +2000,
          },
        ];
        await nv.loadVolumes(volumeList);
        nv.opts.multiplanarForceRender = true;
        nv.graph.autoSizeMultiplanar = true;

        const cmap = {
          R: [0, 0, 185, 185, 252, 0, 103, 216, 127, 127, 0, 222],
          G: [0, 20, 102, 102, 0, 255, 76, 132, 0, 127, 255, 154],
          B: [0, 152, 83, 83, 0, 0, 71, 105, 127, 0, 255, 132],
          A: [0, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255],
          labels: [
            "background",
            "1spleen",
          ],
        };
        nv.setDrawColormap(cmap);
        nv.setRadiologicalConvention(true);
        nv.setSliceType(nv.sliceTypeRender);
      }
    }
    initializeNiiVue();
  }, [imageIndex]);

  const canvasGrid = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
      const canvasId = `gl${row}${col}`;
      const selectedFile = imageUrls[row * 1 + col];
      const index = row * 4 + col;
      canvasGrid.push(
        <div key={`card${row}${col}`} style={{ position: 'relative', width: '100%', height: '100%', border: '2px solid #ccc', borderRadius: '8px', padding: '0px', boxSizing: 'border-box' }}>
          <canvas 
            id={canvasId} 
            style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0)' }}
          ></canvas>
          {selectedCanvasIndex === index && (
            <div style={{ 
  backgroundColor: 'rgba(240, 240, 240, 0.7)', // Transparent white background for glassmorphism effect
  padding: '20px', 
  position: 'absolute', 
  top: 0, 
  right: 0, 
  left: 0, 
  textAlign: 'center', 
  zIndex: 999,
  backdropFilter: 'blur(10px)', // Blur effect for glassmorphism
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Box shadow for glassmorphism
  borderRadius: '8px', // Rounded corners for glassmorphism
}}>
  <p>{imagesInfo[index]}</p>
  <button onClick={() => setSelectedCanvasIndex(null)}>Close</button>
</div>

          )}
<button 
  style={{ 
    position: 'absolute', 
    top: '5px', 
    right: '5px', 
    padding: '5px', 
    background: 'transparent', 
    border: 'none', 
    cursor: 'pointer', 
    zIndex: 1000 
  }}
  onClick={() => handleInfoButtonClick(index)}
>
  <img src={infoIcon} alt="Info" style={{ width: '20px', height: '20px', filter: 'grayscale(100%)' }} />
</button>


<div style={{ position: 'absolute', bottom: '25%', left: '50%', transform: 'translateX(-50%)', width: '50%', height: '1px', backgroundColor: '#ccc', zIndex: 1000 }}></div>
<button 
  style={{ 
    position: 'absolute', 
    bottom: '10px', // Adjust the top position as needed
    left: '50%', 
    transform: 'translateX(-50%)', 
    padding: '10px', 
    background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background for contrast
    color: '#fff', // White text for visibility
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    zIndex: 1000 
  }}

  onClick={() => {
    const fileName = selectedFile.split('/').pop(); // Extracting the file name from the file path
    const fileUrl = `http://197.116.29.77:5000/uploads/${fileName}`;
    console.log("File URL:", fileUrl);
    history.push('/vue', { fileUrl });
    window.location.reload(); // Refresh the page to re-render the new page
  }}
>
  Try it
</button>

        </div>
      );
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', width: '100%', height: '700px' }}>
      {canvasGrid}
    </div>
  );
}

export default NiiVueComponent;
