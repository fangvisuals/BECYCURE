import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function AnimatedBackgroundWithRoute() {
  const location = useLocation();

  const getTargetColor = (pathname) => {
    if (pathname.startsWith("/integration")) return "#ff00cc";
    if (pathname.startsWith("/services")) return "#ffea00";
    if (pathname.startsWith("/conseil")) return "#00ff99";
    if (pathname.startsWith("/partenariats")) return "#ff6600";
    if (pathname.startsWith("/blog")) return "#a259ff";
    return "#00ffff";
  };

  const [color, setColor] = useState(getTargetColor(location.pathname));
  const colorRef = useRef(color);

  useEffect(() => {
    colorRef.current = color;
  }, [color]);

  useEffect(() => {
    let frame;
    let start;
    const duration = 600;

    const hexToRgb = (hex) => {
      const m = hex.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
      return m
        ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
        : [0, 0, 0];
    };

    const rgbToHex = ([r, g, b]) =>
      "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");

    const lerp = (a, b, t) => a + (b - a) * t;

    const from = hexToRgb(colorRef.current);
    const to = hexToRgb(getTargetColor(location.pathname));

    if (rgbToHex(from) === rgbToHex(to)) return; // pas de changement

    function animate(ts) {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const next = [
        Math.round(lerp(from[0], to[0], t)),
        Math.round(lerp(from[1], to[1], t)),
        Math.round(lerp(from[2], to[2], t)),
      ];
      setColor(rgbToHex(next));
      if (t < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => frame && cancelAnimationFrame(frame);
  }, [location.pathname]);

  return <AnimatedBackground color={color} />;
}

export default AnimatedBackgroundWithRoute;
