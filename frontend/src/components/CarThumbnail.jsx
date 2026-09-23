import { useState } from "react";

// A small set of bespoke car silhouettes rendered as inline SVG, used as a
// fallback when a listing has no photo (or the photo URL fails to load).
const PALETTES = [
  ["#2C4A63", "#1a2e3f"],
  ["#AD3C1D", "#7d2b14"],
  ["#4b5d4a", "#33422f"],
  ["#7a6a3f", "#584c2b"],
  ["#5b4b6a", "#3d3149"],
];

function paletteFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

export default function CarThumbnail({ seed = "car", bodyType = "Sedan", size = "md", imageUrl = "" }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageUrl && !imageFailed) {
    return (
      <img
        src={imageUrl}
        alt={`${bodyType} listing photo`}
        className="car-thumbnail-img"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return <CarSilhouette seed={seed} bodyType={bodyType} size={size} />;
}

function CarSilhouette({ seed, bodyType, size }) {
  const [body, dark] = paletteFor(String(seed) + bodyType);
  const isTall = bodyType === "SUV" || bodyType === "Pickup";

  return (
    <svg
      viewBox="0 0 220 120"
      width={size === "sm" ? 64 : "70%"}
      role="img"
      aria-label={`${bodyType} illustration`}
    >
      <ellipse cx="110" cy="98" rx="86" ry="8" fill="rgba(0,0,0,0.12)" />
      <path
        d={
          isTall
            ? "M28 88 L34 55 Q40 42 58 40 L150 40 Q168 42 176 58 L188 88 Z"
            : "M20 88 L28 62 Q34 50 52 48 L84 30 Q96 24 120 24 L150 32 Q168 38 176 52 L196 88 Z"
        }
        fill={body}
        stroke={dark}
        strokeWidth="3"
      />
      <path
        d={
          isTall
            ? "M62 44 L70 58 L138 58 L146 44 Z"
            : "M92 30 L100 48 L152 48 L146 36 Z"
        }
        fill="rgba(255,255,255,0.35)"
      />
      <circle cx="62" cy="90" r="16" fill={dark} />
      <circle cx="62" cy="90" r="7" fill="#cfd6d9" />
      <circle cx="158" cy="90" r="16" fill={dark} />
      <circle cx="158" cy="90" r="7" fill="#cfd6d9" />
      <rect x="18" y="80" width="14" height="6" rx="2" fill="#f0a202" />
    </svg>
  );
}
