import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 297;

export const TucanScrollCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastRenderedIndexRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    // Helper to get frame source path
    const getFrameSrc = (idx: number) =>
      `/TUCAN/ezgif-frame-${String(idx + 1).padStart(3, '0')}.jpg`;

    // Nearest available loaded image lookup to avoid any flicker
    const getNearestLoadedImage = (index: number): HTMLImageElement | null => {
      const imgs = imagesRef.current;
      if (imgs[index] && imgs[index]!.complete && imgs[index]!.naturalWidth > 0) {
        return imgs[index];
      }
      for (let delta = 1; delta < TOTAL_FRAMES; delta++) {
        const prev = index - delta;
        if (prev >= 0 && imgs[prev] && imgs[prev]!.complete && imgs[prev]!.naturalWidth > 0) {
          return imgs[prev];
        }
        const next = index + delta;
        if (next < TOTAL_FRAMES && imgs[next] && imgs[next]!.complete && imgs[next]!.naturalWidth > 0) {
          return imgs[next];
        }
      }
      return null;
    };

    // Draw image in full-cover mode preserving aspect ratio
    const drawCover = (img: HTMLImageElement) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const ratio = Math.max(cw / iw, ch / ih);
      const nw = iw * ratio;
      const nh = ih * ratio;
      const nx = (cw - nw) * 0.5;
      const ny = (ch - nh) * 0.5;

      ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);
    };

    // Render frame for a given index
    const renderFrame = (index: number, force = false) => {
      if (!force && index === lastRenderedIndexRef.current) return;
      const img = getNearestLoadedImage(index);
      if (!img) return;

      drawCover(img);
      lastRenderedIndexRef.current = index;
    };

    // Resize canvas respecting devicePixelRatio
    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
      );
      renderFrame(frameIdx, true);
    };

    // Scroll listener calculates exact scroll progress across page
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0) {
        targetProgressRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      }
    };

    // Progressive image preloader
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);
      img.onload = () => {
        imagesRef.current[i] = img;
        // As soon as the first frame loads, render it immediately
        if (i === 0 && lastRenderedIndexRef.current === -1) {
          renderFrame(0, true);
        }
      };
    }

    // Animation loop with smooth linear interpolation (lerp)
    const tick = () => {
      const ease = 0.085;
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * ease;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentProgressRef.current * (TOTAL_FRAMES - 1)))
      );

      renderFrame(frameIdx);
      rafIdRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    handleResize();
    handleScroll();
    currentProgressRef.current = targetProgressRef.current;
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Background Scroll Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-screen h-screen pointer-events-none z-0 block"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#071508',
        }}
      />
      {/* Cinematic ambient darkening overlay to ensure perfect contrast and legibility */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.65) 100%)',
        }}
      />
    </>
  );
};

export default TucanScrollCanvas;
