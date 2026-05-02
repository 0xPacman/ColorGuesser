import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { rgbToHex, hsvToRgb, rgbToHsv } from '@/utils/color';
import type { RGB } from '@/types';

interface ColorPickerProps {
  onColorSelect: (color: RGB) => void;
  disabled?: boolean;
  size?: number;
  showValueSlider?: boolean;
  initialColor?: RGB;
}

export function ColorPicker({ onColorSelect, disabled = false, size = 280, showValueSlider = true, initialColor }: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedHsv, setSelectedHsv] = useState({ h: 0, s: 0, v: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [drawn, setDrawn] = useState(false);

  const radius = size / 2 - 4;
  const center = size / 2;

  useEffect(() => {
    if (initialColor) {
      const hsv = rgbToHsv(initialColor);
      setSelectedHsv(hsv);
      const angle = (hsv.h * Math.PI) / 180;
      const dist = hsv.s * radius;
      setCursorPos({
        x: center + Math.cos(angle) * dist,
        y: center + Math.sin(angle) * dist,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const idx = (y * size + x) * 4;

        if (distance <= radius) {
          let hue = Math.atan2(dy, dx) * (180 / Math.PI);
          if (hue < 0) hue += 360;
          const sat = distance / radius;
          const rgb = hsvToRgb(hue, sat, selectedHsv.v);
          data[idx] = rgb.r;
          data[idx + 1] = rgb.g;
          data[idx + 2] = rgb.b;
          data[idx + 3] = 255;
        } else {
          data[idx + 3] = 0;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setDrawn(true);
  }, [size, selectedHsv.v, center, radius]);

  const getHsvFromPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left - center;
    const y = clientY - rect.top - center;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > radius) return null;

    let hue = Math.atan2(y, x) * (180 / Math.PI);
    if (hue < 0) hue += 360;

    return {
      h: hue,
      s: distance / radius,
      v: selectedHsv.v,
    };
  }, [center, radius, selectedHsv.v]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);

    const hsv = getHsvFromPos(e.clientX, e.clientY);
    if (hsv) {
      setSelectedHsv(hsv);
      setCursorPos({ x: e.clientX - (canvasRef.current?.getBoundingClientRect().left ?? 0), y: e.clientY - (canvasRef.current?.getBoundingClientRect().top ?? 0) });
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      onColorSelect(rgb);
    }
  }, [disabled, getHsvFromPos, onColorSelect]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || disabled) return;
    e.preventDefault();

    const hsv = getHsvFromPos(e.clientX, e.clientY);
    if (hsv) {
      setSelectedHsv(hsv);
      setCursorPos({ x: e.clientX - (canvasRef.current?.getBoundingClientRect().left ?? 0), y: e.clientY - (canvasRef.current?.getBoundingClientRect().top ?? 0) });
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      onColorSelect(rgb);
    }
  }, [isDragging, disabled, getHsvFromPos, onColorSelect]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const previewColor = hsvToRgb(selectedHsv.h, selectedHsv.s, selectedHsv.v);
  const previewHex = rgbToHex(previewColor);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`rounded-full touch-none select-none transition-opacity duration-300 ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-crosshair'} ${drawn ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'transparent' }}
        />
        {!disabled && cursorPos.x !== 0 && cursorPos.y !== 0 && (
          <motion.div
            className="absolute pointer-events-none"
            animate={{ left: cursorPos.x - 10, top: cursorPos.y - 10 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <div
              className="w-5 h-5 rounded-full border-[3px] border-white shadow-lg"
              style={{ backgroundColor: previewHex }}
            />
          </motion.div>
        )}
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <span className="text-white/60 text-sm font-medium">Select to play</span>
          </div>
        )}
      </div>

      {showValueSlider && (
        <div className="w-full max-w-[280px] space-y-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-white/20 shadow-md shrink-0"
              style={{ backgroundColor: previewHex }}
            />
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={selectedHsv.v * 100}
                onChange={(e) => {
                  const v = parseInt(e.target.value) / 100;
                  const newHsv = { ...selectedHsv, v };
                  setSelectedHsv(newHsv);
                  const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
                  onColorSelect(rgb);
                }}
                disabled={disabled}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #000, ${previewHex})`,
                }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-white/40 font-mono">
            <span>{previewHex.toUpperCase()}</span>
            <span>RGB({previewColor.r}, {previewColor.g}, {previewColor.b})</span>
          </div>
        </div>
      )}
    </div>
  );
}
