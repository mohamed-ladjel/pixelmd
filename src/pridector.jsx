import React, { useState, useEffect } from 'react';
import { Niivue } from "@niivue/niivue";
import './pridector.css';
import label from './assets/bone_label.nii.gz';

function Pridector({ startAnimation, fileUrl, maskUrl, animationMode }) {
  const [nv1, setNv1] = useState(null);
  const [nv2, setNv2] = useState(null);
  const [nv3, setNv3] = useState(null);
  const [nv4, setNv4] = useState(null);
  const [clipPlanePosition, setClipPlanePosition] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [volumesLoaded, setVolumesLoaded] = useState(false);
  const [opacity, setOpacity] = useState(1); // State for opacity

  useEffect(() => {
    const initNiivue = async () => {
      const nv1Instance = new Niivue({ show3Dcrosshair: true, backColor: [1,1,1,1] });
      const nv2Instance = new Niivue({ show3Dcrosshair: true, backColor: [1,1,1,1] });
      const nv3Instance = new Niivue({ show3Dcrosshair: true, backColor: [1,1,1,1] });
      const nv4Instance = new Niivue({ show3Dcrosshair: false, backColor: [1,1,1,1] });

      const volumeList1 = [{ url: fileUrl, cal_min: -1000, cal_max: +1000 , opacity:1}];
      const volumeList2 = [{url: fileUrl, cal_min: -1000, cal_max: +1000, opacity: 1},{ url: maskUrl, colormap:"red" ,opacity:1}];

      nv1Instance.attachTo("gl1");
      nv2Instance.attachTo("gl2");
      nv3Instance.attachTo("gl3");
      nv4Instance.attachTo("gl4");

      nv1Instance.setSliceType(nv2Instance.sliceTypeSagittal);
      nv2Instance.setSliceType(nv2Instance.sliceTypeAxial);
      nv3Instance.setSliceType(nv2Instance.sliceTypeCoronal);
      nv4Instance.setSliceType(nv2Instance.sliceTypeRender);
      nv4Instance.setRenderAzimuthElevation(45,45);
      
      let loadPromises;
      if (maskUrl) {
        loadPromises = [
          nv1Instance.loadVolumes(volumeList2),
          nv2Instance.loadVolumes(volumeList2),
          nv3Instance.loadVolumes(volumeList2),
          nv4Instance.loadVolumes(volumeList2)
        ];
      } else {
        loadPromises = [
          nv1Instance.loadVolumes(volumeList1),
          nv2Instance.loadVolumes(volumeList1),
          nv3Instance.loadVolumes(volumeList1),
          nv4Instance.loadVolumes(volumeList1)
        ];
      }

      await Promise.all(loadPromises);

      nv1Instance.broadcastTo([nv2Instance, nv3Instance], { "3d": true, "2d": true });
      nv2Instance.broadcastTo([nv1Instance, nv3Instance], { "3d": true, "2d": true });
      nv3Instance.broadcastTo([nv1Instance, nv2Instance], { "3d": true, "2d": true });

      nv4Instance.setClipPlaneColor([1, 0, 0, 1]);
      setClipPlanePosition(0.4);

      setNv1(nv1Instance);
      setNv2(nv2Instance);
      setNv3(nv3Instance);
      setNv4(nv4Instance);
      setVolumesLoaded(true);
    };

    initNiivue();
  }, [fileUrl, maskUrl]);

  useEffect(() => {
    if (nv4 && volumesLoaded && startAnimation) {
      setIsAnimating(true);
    }
  }, [nv4, volumesLoaded, startAnimation]);

  useEffect(() => {
    if (isAnimating && animationMode === 2) {
      const animationDuration = 2000;
      const clipPlaneStartPosition = 0.4;
      const clipPlaneEndPosition = -0.44;
      const animationSteps = 60;
      const animationInterval = animationDuration / animationSteps;
  
      let step = 0;
      let direction = 1; // 1 for forward, -1 for backward
      let currentPosition = clipPlaneStartPosition;
  
      const animationLoop = setInterval(() => {
        const t = step / animationSteps;
        currentPosition += direction * (clipPlaneEndPosition - clipPlaneStartPosition) / animationSteps;
        setClipPlanePosition(currentPosition);
        updateClipPlane(nv4, currentPosition);
  
        step += 1;
        if (step === animationSteps || step === 0) {
          direction *= -1; // Change direction
          if (step === animationSteps) {
            step = 0; // Reset step to start from the beginning
          }
        }
      }, animationInterval);
  
      return () => clearInterval(animationLoop);
    } else if (isAnimating && animationMode === 3) {
      const animationDuration = 3000;
      const clipPlaneStartPosition = 0.4;
      const clipPlaneEndPosition = -0.33;
      const animationSteps = 60;
      const animationInterval = animationDuration / animationSteps;
  
      let step = 0;
  
      const animationLoop = setInterval(() => {
        const t = step / animationSteps;
        const newPosition = clipPlaneStartPosition + t * (clipPlaneEndPosition - clipPlaneStartPosition);
        setClipPlanePosition(newPosition);
        updateClipPlane(nv4, newPosition);
  
        step += 1;
        if (step === animationSteps) {
          clearInterval(animationLoop);
          setAnimationMode(1); // Set mode back to not animating after completing the animation
        }
      }, animationInterval);
  
      return () => clearInterval(animationLoop);
    }
  }, [nv4, isAnimating, animationMode]);
  
  const updateClipPlane = (instance, position) => {
    instance.setClipPlane([position, 0, 0]);
  };

  const handleOpacityChange = (value) => {
    setOpacity(value);
    if (nv1 && nv2 && nv3 && nv4) {
      nv1.setOpacity(1, value/255);
      nv2.setOpacity(1, value/255);
      nv3.setOpacity(1, value/255);
      nv4.setOpacity(1, value/255);
    }
  };


  return (
<>      <input
        type="range"
        min="0"
        max="255"
        step="1"
        value={opacity}
        onChange={(e) => handleOpacityChange(parseInt(e.target.value))}
      />
    <div className="parent-container">
      <div className='conteneur'>
        <canvas id="gl1" className='box'></canvas>
        <canvas id="gl2" className='box'></canvas>
        <canvas id="gl3" className='box'></canvas>
        <canvas id="gl4" className='box'></canvas>
      </div>
    </div>
    </>
  );
}

export default Pridector;
