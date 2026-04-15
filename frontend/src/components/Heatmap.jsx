import React, { useEffect, useRef } from "react";

const Heatmap = ({ spectrogram }) => {
  const canvasRef = useRef();

  useEffect(() => {
    if (!spectrogram) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const height = spectrogram.length;
    const width = spectrogram[0].length;

    canvas.width = width;
    canvas.height = height;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const value = spectrogram[i][j];
        const color = Math.floor((value + 80) * 3); // normalize

        ctx.fillStyle = `rgb(${color}, 0, ${255 - color})`;
        ctx.fillRect(j, i, 1, 1);
      }
    }
  }, [spectrogram]);

  return <canvas ref={canvasRef} style={{ width: "100%" }} />;
};

export default Heatmap;