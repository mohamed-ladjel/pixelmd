import React from "react";
import { useRef, useEffect } from "react";
import { Niivue } from "@niivue/niivue";

export const NiiVue = ({ imageUrl }) => {
  const canvas = useRef();
  useEffect(() => {
    const volumeList = [
      {
        url: imageUrl,
        volume: { hdr: null, img: null },
        colorMap: "gray",
        opacity: 1,
        visible: true
      }
    ];
    const nv = new Niivue();
    nv.attachToCanvas(canvas.current);
    nv.loadVolumes(volumeList); // press the "v" key to cycle through volumes
  }, [imageUrl]);

  return <canvas ref={canvas} height={480} width={640} />;
};
