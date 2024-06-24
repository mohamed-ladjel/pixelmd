import React, { useState, useEffect } from 'react';
import { Niivue } from "@niivue/niivue";
import bone from './assets/bone.nii.gz'
import './nii.css'
function NiivueComponent() {
  const [layout, setLayout] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(512);

  const handleLayoutChange = (event) => {
    const newLayout = parseInt(event.target.value);
    setLayout(newLayout);
    [nv1, nv2, nv3].forEach(nv => nv.setMultiplanarLayout(newLayout));
  };

  const handleCanvasHeightChange = (event) => {
    const newHeight = parseInt(event.target.value);
    setCanvasHeight(newHeight);
    [gl1, gl2, gl3].forEach(canvas => canvas.height = newHeight);
    [nv1, nv2, nv3].forEach(nv => nv.resizeListener());
  };

  const handleIntensityChange = (data) => {
    document.getElementById("intensity").innerHTML =
      "&nbsp;&nbsp;" + data.string;
  };

  const handleIntensityChange2 = (data) => {
    document.getElementById("intensity2").innerHTML =
      "&nbsp;&nbsp;" + data.string;
  };

  const handleIntensityChange3 = (data) => {
    document.getElementById("intensity3").innerHTML =
      "&nbsp;&nbsp;" + data.string;
  };

  useEffect(() => {
    const nv1 = new Niivue({
      show3Dcrosshair: true,
      onLocationChange: handleIntensityChange,
      backColor: [1, 1, 1, 1],
    });

    const nv2 = new Niivue({
      show3Dcrosshair: true,
      onLocationChange: handleIntensityChange2,
      backColor: [1, 1, 1, 1],
    });

    const nv3 = new Niivue({
      show3Dcrosshair: true,
      onLocationChange: handleIntensityChange3,
      backColor: [1, 1, 1, 1],
    });

    const volumeList1 = [{ url:bone  ,cal_min: -500, cal_max: +2000}];
    const volumeList2 = [{ url:bone  ,cal_min: -500, cal_max: +2000}];
    const volumeList3 = [{ url:bone  ,cal_min: -500, cal_max: +2000}];

    nv1.attachTo("gl1");
    nv2.attachTo("gl2");
    nv3.attachTo("gl3");
    nv1.setSliceType(nv2.sliceTypeSagittal);
    nv2.setSliceType(nv2.sliceTypeAxial);
    nv3.setSliceType(nv2.sliceTypeRender);
    nv3.setClipPlane([0, 0, 0]);

    

    Promise.all([nv1.loadVolumes(volumeList1), nv2.loadVolumes(volumeList2), nv3.loadVolumes(volumeList3)])
      .then(() => {
        // make sure all views can control each other
        nv1.broadcastTo([nv2, nv3], { "3d": true, "2d": true });
        nv2.broadcastTo([nv1, nv3], { "3d": true, "2d": true });
        nv3.broadcastTo([nv1, nv2], { "3d": true, "2d": true });
      });
  }, []);

  return (
    <div>
      <header>
        <label htmlFor="layout">Layout</label>
        <select id="layout" value={layout} onChange={handleLayoutChange}>
          <option value="0">Auto</option>
          <option value="1">Column</option>
          <option value="2">Grid</option>
          <option value="3">Row</option>
        </select>
        <label htmlFor="canvasHeight">Height</label>
        <select id="canvasHeight" value={canvasHeight} onChange={handleCanvasHeightChange}>
          <option value="256">256</option>
          <option value="512">512</option>
          <option value="768">768</option>
        </select>
      </header>
      <main>
        <div className='page-wrapper'>
          <div className='row'>
            <div className='column'>
              <div>
                <canvas id="gl1" height={canvasHeight}></canvas>
              </div>
            </div>
            <div className='column'>
              <div>
                <canvas id="gl2" height={canvasHeight}></canvas>
              </div>
            </div>
            <div className='column'>
              <div>
                <canvas id="gl3" height={canvasHeight}></canvas>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default NiivueComponent;
