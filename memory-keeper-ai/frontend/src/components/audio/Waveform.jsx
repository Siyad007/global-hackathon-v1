import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Waveform = ({ isRecording = false, audioData = null }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bars = 40;

    // Function to draw animated bars
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8; // random bar height
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        // Gradient color for bars
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#00c6ff');
        gradient.addColorStop(0.5, '#0072ff');
        gradient.addColorStop(1, '#00c6ff');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 2, height);
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00c6ff';
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isRecording) {
      draw();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationRef.current);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [isRecording]);

  // Adjust canvas size
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <motion.div
      className="waveform-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: isRecording ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '120px',
          background: 'transparent',
        }}
      ></canvas>
    </motion.div>
  );
};

export default Waveform;