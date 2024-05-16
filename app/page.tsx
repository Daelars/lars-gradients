"use client";

import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);

  const [svgContent, setSvgContent] = useState<string | null>(null);

  const fetchSvg = useCallback(async () => {
    try {
      const newUrl = `/api/noisy-gradient?width=${width}&height=${height}&t=${Date.now()}`;
      const res = await fetch(newUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch SVG: ${res.statusText}`);
      }
      const svgText = await res.text();
      setSvgContent(svgText);
    } catch (error) {
      console.error(error);
    }
  }, [width, height]); // Include width and height as dependencies

  useEffect(() => {
    fetchSvg();
  }, [fetchSvg]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === " ") {
      fetchSvg(); // Directly fetch SVG when space is pressed
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Noisy Gradient Generator</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="width"
              className="block text-sm font-medium text-gray-700"
            >
              Width:
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value, 10))}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-700"
            >
              Height:
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value, 10))}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
        </div>

        <button
          onClick={fetchSvg} // Directly call fetchSvg when the button is clicked
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Generate New Gradient
        </button>

        <div className="w-full mt-4">
          {width > 0 && height > 0 && svgContent ? (
            <div
              className="rounded-lg shadow-md"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <p className="text-red-500">
              Please enter valid width and height values.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
