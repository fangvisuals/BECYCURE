import React, { useEffect, useRef, useMemo } from "react";

const CHARSET = "0123456789ABCDEFGHJKLMNOPQRSTUVWXYZ/\\-_[]<>(){}";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function parseHexColor(source, fallback) {
  if (typeof source !== "string") return fallback;
  let hex = source.trim();
  if (hex.startsWith("#")) hex = hex.slice(1);
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  if (hex.length !== 6) return fallback;
  const value = Number.parseInt(hex, 16);
  if (Number.isNaN(value)) return fallback;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

const DEFAULT_BG = parseHexColor("#071019", { r: 7, g: 16, b: 25 });
const DEFAULT_TINT = parseHexColor("#0ea15e", { r: 14, g: 161, b: 94 });

function FaultyTerminal({
  className = "",
  style,
  lockAspect = false,
  aspect = 16 / 9,
  fitMode = "cover",
  bg = "#071019",
  tint = "#0ea15e",
  brightness = 0.5,
  scale = 2,
  gridMul = [5, 2],
  digitSize = 3,
  timeScale = 0.35,
  pause = false,
  scanlineIntensity = 0.12,
  glitchAmount = 0.5,
  flickerAmount = 0.3,
  noiseAmp = 1.0,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0,
  mouseReact = true,
  mouseStrength = 0.25,
  pageLoadAnimation = true,
  ...rest
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const observerRef = useRef(null);
  const cellsRef = useRef({ cols: 0, rows: 0, items: [] });
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false });
  const loadStartRef = useRef(0);
  const lastTimeRef = useRef(0);

  const gridX = Array.isArray(gridMul) ? gridMul[0] ?? 5 : Number(gridMul) || 5;
  const gridY = Array.isArray(gridMul) ? gridMul[1] ?? gridMul[0] ?? 2 : Number(gridMul) || 2;
  const tintColor = useMemo(() => parseHexColor(tint, DEFAULT_TINT), [tint]);
  const bgColor = useMemo(() => parseHexColor(bg, DEFAULT_BG), [bg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    loadStartRef.current = 0;

    let disposed = false;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const parent = canvas.parentElement || canvas;

    const size = { width: 0, height: 0 };

    const updateCanvasSize = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      if (width === size.width && height === size.height) return;
      size.width = width;
      size.height = height;
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(DPR, DPR);
      cellsRef.current.cols = 0;
    };

    updateCanvasSize();

    observerRef.current = new ResizeObserver(updateCanvasSize);
    observerRef.current.observe(parent);

    const initCells = (cols, rows, nowMs) => {
      cellsRef.current = {
        cols,
        rows,
        items: new Array(cols * rows).fill(null).map(() => ({
          char: CHARSET[Math.floor(Math.random() * CHARSET.length)],
          next: nowMs + Math.random() * 600 + 200,
          phase: Math.random(),
        })),
      };
    };

    const draw = (timestamp) => {
      if (disposed) return;
      animationRef.current = window.requestAnimationFrame(draw);

      const { width, height } = size;
      if (width <= 0 || height <= 0) return;

      if (loadStartRef.current === 0) loadStartRef.current = timestamp;
      const loadElapsed = (timestamp - loadStartRef.current) * 0.001;
      const loadProgress = pageLoadAnimation
        ? clamp(loadElapsed / 1.2, 0, 1)
        : 1;

      const effectiveTime = pause
        ? lastTimeRef.current
        : timestamp * 0.001 * Math.max(timeScale, 0.05);
      if (!pause) lastTimeRef.current = effectiveTime;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`;
      ctx.fillRect(0, 0, width, height);

      let drawX = 0;
      let drawY = 0;
      let drawW = width;
      let drawH = height;

      if (lockAspect && aspect > 0) {
        const containerAspect = width / height;
        const targetAspect = aspect;
        if (fitMode === "contain") {
          if (containerAspect > targetAspect) {
            drawH = height;
            drawW = height * targetAspect;
            drawX = (width - drawW) / 2;
          } else {
            drawW = width;
            drawH = width / targetAspect;
            drawY = (height - drawH) / 2;
          }
        } else if (fitMode === "cover") {
          if (containerAspect > targetAspect) {
            drawW = width;
            drawH = width / targetAspect;
            drawY = (height - drawH) / 2;
          } else {
            drawH = height;
            drawW = height * targetAspect;
            drawX = (width - drawW) / 2;
          }
        }
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(drawX, drawY, drawW, drawH);
      ctx.clip();

      const normalizedScale = clamp(scale, 0.5, 6);
      const baseFont = clamp(digitSize, 1, 10) * 6;
      const fontSize = baseFont * normalizedScale;
      const baseCols = Math.max(6, Math.floor(drawW / (fontSize * 0.8)));
      const baseRows = Math.max(4, Math.floor(drawH / (fontSize * 1.4)));
      const gridCols = Math.max(6, Math.round(baseCols * clamp(gridX, 0.5, 12) / 5));
      const gridRows = Math.max(4, Math.round(baseRows * clamp(gridY, 0.5, 12) / 2));

      if (
        cellsRef.current.cols !== gridCols ||
        cellsRef.current.rows !== gridRows
      ) {
        initCells(gridCols, gridRows, effectiveTime * 1000);
      }

      const { cols, rows, items } = cellsRef.current;
      const cellWidth = drawW / cols;
      const cellHeight = drawH / rows;

      ctx.font = `${fontSize}px "Space Grotesk", "Inter", monospace`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      const pointer = pointerRef.current;
      const glitchShift = clamp(glitchAmount, 0, 5) * cellWidth * 0.4;
      const flicker = 1 + Math.sin(effectiveTime * 10) * flickerAmount * 0.2;
      const noiseStrength = clamp(noiseAmp, 0, 2) * 0.35;
      const curvatureStrength = clamp(curvature, 0, 1) * 0.7;
      const ditherStrength = clamp(dither, 0, 1) * 0.15;

      for (let row = 0; row < rows; row += 1) {
        const rowNorm = rows > 1 ? row / (rows - 1) : 0.5;
        const rowOffset = Math.sin(effectiveTime * 1.3 + row * 0.6) * glitchShift;
        const y = drawY + row * cellHeight + cellHeight / 2;

        for (let col = 0; col < cols; col += 1) {
          const idx = row * cols + col;
          const cell = items[idx];
          if (!cell) continue;

          if (!pause && effectiveTime * 1000 > cell.next) {
            cell.char = CHARSET[Math.floor(Math.random() * CHARSET.length)];
            const interval = 400 / Math.max(timeScale, 0.05);
            cell.next = effectiveTime * 1000 + Math.random() * interval + 100;
            cell.phase = Math.random();
          }

          const x = drawX + col * cellWidth + cellWidth / 2 + rowOffset;
          const colNorm = cols > 1 ? col / (cols - 1) : 0.5;

          const dx = colNorm - 0.5;
          const dy = rowNorm - 0.5;
          const curvatureFactor = 1 - curvatureStrength * Math.sqrt(dx * dx + dy * dy) * 2;

          let alpha = brightness * curvatureFactor * flicker * loadProgress;
          alpha += Math.sin(effectiveTime * 4 + cell.phase * Math.PI * 2) * noiseStrength;
          alpha += (Math.random() - 0.5) * ditherStrength;

          if (mouseReact && (pointer.active || mouseStrength > 0)) {
            const distX = colNorm - pointer.x;
            const distY = rowNorm - pointer.y;
            const dist = Math.sqrt(distX * distX + distY * distY);
            alpha += Math.exp(-dist * 6) * mouseStrength * 1.5;
          }

          alpha = clamp(alpha, 0, 1);
          if (alpha <= 0.01) continue;

          const textY = y;
          ctx.fillStyle = `rgba(${tintColor.r}, ${tintColor.g}, ${tintColor.b}, ${alpha})`;
          ctx.fillText(cell.char, x, textY);

          if (chromaticAberration > 0) {
            const ca = clamp(chromaticAberration, 0, 2);
            const offset = cellWidth * 0.12 * ca;
            ctx.fillStyle = `rgba(${tintColor.r}, ${Math.max(0, tintColor.g - 80)}, ${tintColor.b}, ${alpha * 0.4})`;
            ctx.fillText(cell.char, x + offset, textY);
            ctx.fillStyle = `rgba(${Math.max(0, tintColor.r - 120)}, ${tintColor.g}, ${tintColor.b}, ${alpha * 0.4})`;
            ctx.fillText(cell.char, x - offset, textY);
          }
        }
      }

      ctx.restore();

      if (scanlineIntensity > 0.001) {
        const density = clamp(scanlineIntensity, 0, 1);
        const spacing = clamp(2 + 5 * (1 - density), 2, 8);
        ctx.fillStyle = `rgba(0, 0, 0, ${density * 0.35})`;
        for (let y = drawY; y < drawY + drawH; y += spacing) {
          ctx.fillRect(drawX, y, drawW, 1);
        }
      }
    };

    animationRef.current = window.requestAnimationFrame(draw);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationRef.current);
      observerRef.current?.disconnect();
      animationRef.current = 0;
      observerRef.current = null;
    };
  }, [
    lockAspect,
    aspect,
    fitMode,
    bgColor,
    tintColor,
    brightness,
    scale,
    gridX,
    gridY,
    digitSize,
    timeScale,
    pause,
    scanlineIntensity,
    glitchAmount,
    flickerAmount,
    noiseAmp,
    chromaticAberration,
    dither,
    curvature,
    mouseReact,
    mouseStrength,
    pageLoadAnimation,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mouseReact) return undefined;

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
        y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
        active: true,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current = { x: 0.5, y: 0.5, active: false };
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [mouseReact]);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      style={style}
      {...rest}
    />
  );
}

export default FaultyTerminal;
