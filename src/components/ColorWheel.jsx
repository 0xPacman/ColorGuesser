import React, { useRef, useEffect, useState } from 'react';
import { hsvToRgb, coordsToHsv } from '../utils/colorUtils.js';

const ColorWheel = ({ onColorSelect, disabled = false, size = 200 }) => {
  const canvasRef = useRef(null);
  const [isDrawn, setIsDrawn] = useState(false);

  useEffect(() => {
    drawColorWheel();
  }, [size]);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 2; // Small margin

    // Create ImageData for pixel-level manipulation
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          // Calculate hue from angle
          let hue = Math.atan2(dy, dx) * (180 / Math.PI);
          if (hue < 0) hue += 360;

          // Calculate saturation from distance to center
          const saturation = distance / radius;

          // Value is always 1 for maximum brightness
          const value = 1;

          // Convert HSV to RGB
          const rgb = hsvToRgb(hue, saturation, value);

          // Set pixel color
          const index = (y * size + x) * 4;
          data[index] = rgb.r;     // Red
          data[index + 1] = rgb.g; // Green
          data[index + 2] = rgb.b; // Blue
          data[index + 3] = 255;   // Alpha
        } else {
          // Transparent outside the circle
          const index = (y * size + x) * 4;
          data[index + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setIsDrawn(true);
  };

  const handleCanvasClick = (event) => {
    if (disabled || !onColorSelect) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const hsv = coordsToHsv(x, y, size / 2 - 2);
    
    if (hsv) {
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      onColorSelect(rgb);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onClick={handleCanvasClick}
        className={`
          rounded-full border-2 border-white/50 shadow-lg transition-all duration-200
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-crosshair hover:scale-105 hover:shadow-xl'
          }
          ${isDrawn ? 'animate-fade-in' : ''}
        `}
        style={{
          background: disabled ? 'rgba(0,0,0,0.1)' : 'transparent'
        }}
      />
      
      {disabled && (
        <p className="glass-text-muted text-sm text-center">
          Join as a player to start guessing colors!
        </p>
      )}
    </div>
  );
};

export default ColorWheel;
