import { NextRequest, NextResponse } from "next/server";

// Import Tailwind config directly
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

const getRandomTailwindColor = () => {
  const colors = Object.keys(fullConfig.theme.colors);
  const randomColorName = colors[
    Math.floor(Math.random() * colors.length)
  ] as keyof typeof fullConfig.theme.colors;

  let randomColor = fullConfig.theme.colors[randomColorName] as string;

  // Handle color objects (e.g., shades of a color)
  if (typeof randomColor === "object") {
    const shades = Object.keys(randomColor);
    const randomShade = shades[Math.floor(Math.random() * shades.length)];
    randomColor = randomColor[randomShade];
  }
  return randomColor;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const width = searchParams.get("width") ?? "500";
  const height = searchParams.get("height") ?? "200";
  const colors =
    searchParams.get("colors") ??
    `${getRandomTailwindColor()},${getRandomTailwindColor()}`;
  const noiseIntensity = searchParams.get("noiseIntensity") ?? "0.2";

  const gradientStops = colors
    .split(",")
    .map(
      (color, i) =>
        `<stop offset="${
          i / (colors.split(",").length - 1)
        }" style="stop-color:${color};" />`
    )
    .join("");

  const noiseFilter = `url(#noise)`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="5" result="noisy" />
          <feDisplacementMap in="SourceGraphic" in2="noisy" scale="${
            parseFloat(noiseIntensity) * 20
          }" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" filter="${noiseFilter}" />
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        ${gradientStops}
      </linearGradient>
    </svg>
  `;

  // Append colors to the URL query parameters
  const url = new URL(req.url);
  url.searchParams.set("colors", colors);

  return new NextResponse(svg, {
    status: 200,
    headers: { "Content-Type": "image/svg+xml" },
  });
}
