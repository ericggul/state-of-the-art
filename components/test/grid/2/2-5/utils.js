export async function getImageData(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imagePath;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      resolve(imageData);
    };
    img.onerror = reject;
  });
}

export function processImage(imageData, targetWidth, targetHeight) {
  const { data, width, height } = imageData;
  const result = [];

  // Create a temporary canvas to scale the image
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = targetWidth;
  tempCanvas.height = targetHeight;
  const tempCtx = tempCanvas.getContext("2d");

  // Draw the original image on the temporary canvas
  const originalCanvas = document.createElement("canvas");
  originalCanvas.width = width;
  originalCanvas.height = height;
  const originalCtx = originalCanvas.getContext("2d");
  originalCtx.putImageData(imageData, 0, 0);

  // Scale the image to the target dimensions
  tempCtx.drawImage(originalCanvas, 0, 0, width, height, 0, 0, targetWidth, targetHeight);
  const scaledImageData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);

  // Process the scaled image data
  const { data: scaledData } = scaledImageData;
  for (let y = 0; y < targetHeight; y++) {
    const row = [];
    for (let x = 0; x < targetWidth; x++) {
      const index = (y * targetWidth + x) * 4;
      const r = scaledData[index];
      const g = scaledData[index + 1];
      const b = scaledData[index + 2];

      // Simple threshold to determine if the pixel is not black/white
      const isNotBW = !(r === 0 && g === 0 && b === 0) && !(r === 255 && g === 255 && b === 255);

      row.push(isNotBW ? ((x % 9) + 1).toString() : " ");
    }
    result.push(row);
  }

  return result;
}
