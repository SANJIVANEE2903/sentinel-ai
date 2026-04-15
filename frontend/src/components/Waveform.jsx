import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const Waveform = ({ audioUrl }) => {
  const waveformRef = useRef(null);

  useEffect(() => {
    if (!audioUrl) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#4F46E5",
      progressColor: "#22C55E",
      height: 80,
    });

    wavesurfer.load(audioUrl);

    return () => wavesurfer.destroy();
  }, [audioUrl]);

  return <div ref={waveformRef}></div>;
};

export default Waveform;