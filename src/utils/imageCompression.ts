export interface CompressionResult {
  dataUrl: string;
  blob: Blob;
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const originalSizeKB = Math.round(file.size / 1024);

    if (!file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file type'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaled aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context not available'));
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with specified quality
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error('Failed to convert canvas to blob'));
            }

            const compressedSizeKB = Math.round(blob.size / 1024);
            const reductionPercentage =
              originalSizeKB > 0
                ? Math.max(0, Math.round(((originalSizeKB - compressedSizeKB) / originalSizeKB) * 100))
                : 0;

            resolve({
              dataUrl,
              blob,
              originalSizeKB,
              compressedSizeKB,
              reductionPercentage,
              width,
              height,
            });
          },
          mimeType,
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
