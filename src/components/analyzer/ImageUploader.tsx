import React, { useRef, useState, DragEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Camera as CameraIcon, Image as ImageIcon, UploadCloud, RefreshCw, Trash2, Zap, CheckCircle2 } from 'lucide-react';
import { compressImage, CompressionResult } from '../../utils/imageCompression';
import { isNativeApp } from '../../lib/nativeBootstrap';

interface ImageUploaderProps {
  imageDataUrl: string | null;
  onImageSelected: (dataUrl: string | null) => void;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageDataUrl,
  onImageSelected,
  className = '',
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;

    if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) {
      setErrorMessage(t('errors.invalidImage'));
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);

    try {
      // Compress image client side
      const result = await compressImage(file, 1200, 1200, 0.82);
      setCompressionStats(result);
      onImageSelected(result.dataUrl);
    } catch (err) {
      console.error('Compression failed:', err);
      setErrorMessage(t('errors.genericError'));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onImageSelected(null);
    setCompressionStats(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Converts a Capacitor Camera data-URL result into a File so it can go
  // through the exact same compression + upload pipeline as a web file input.
  const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  };

  const handleNativeCapture = async (source: 'camera' | 'photos') => {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      });

      if (!photo.dataUrl) return;
      const file = await dataUrlToFile(photo.dataUrl, `crop-${Date.now()}.jpg`);
      handleFile(file);
    } catch (err) {
      // User cancelling the picker also lands here — only show an error
      // for genuine failures, not a simple cancel.
      const message = err instanceof Error ? err.message : String(err);
      if (!/cancel/i.test(message)) {
        console.error('Native camera capture failed:', err);
        setErrorMessage(t('errors.genericError'));
      }
    }
  };

  const handleTakePhotoClick = () => {
    if (isNativeApp()) {
      handleNativeCapture('camera');
    } else {
      cameraInputRef.current?.click();
    }
  };

  const handleChooseGalleryClick = () => {
    if (isNativeApp()) {
      handleNativeCapture('photos');
    } else {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {/* Mobile Camera Direct input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {!imageDataUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-agri-500 bg-agri-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-agri-500 bg-slate-50/70 hover:bg-agri-50/30'
          }`}
          onClick={() => handleChooseGalleryClick()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-agri-600 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8 text-agri-600" />
            </div>

            <div className="space-y-1">
              <div className="text-base sm:text-lg font-bold text-slate-800">
                {t('analyzer.uploadBoxTitle')}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
                {t('analyzer.dragDropText')}
              </p>
            </div>

            {/* Quick Action buttons */}
            <div
              className="flex items-center gap-3 pt-2 flex-wrap justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => handleTakePhotoClick()}
                className="flex items-center gap-2 px-4 py-2.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-agri-600/20 active:scale-95 transition-transform"
              >
                <CameraIcon className="w-4 h-4" />
                <span>{t('analyzer.takePhoto')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleChooseGalleryClick()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-transform"
              >
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>{t('analyzer.chooseGallery')}</span>
              </button>
            </div>
          </div>

          {isCompressing && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-8 h-8 text-agri-600 animate-spin" />
              <span className="text-sm font-bold text-slate-700">{t('analyzer.compressingImage')}</span>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview State */
        <div className="bg-white border-2 border-agri-200 rounded-3xl p-4 sm:p-5 shadow-md space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video max-h-72 flex items-center justify-center">
            <img
              src={imageDataUrl}
              alt="Crop leaf preview"
              className="w-full h-full object-contain"
            />

            {/* Optimization Badge */}
            {compressionStats && (
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{t('analyzer.fastAIOptimized')}: {compressionStats.compressedSizeKB} KB</span>
                <span className="text-agri-400 font-bold">(-{compressionStats.reductionPercentage}%)</span>
              </div>
            )}

            <div className="absolute bottom-3 right-3 bg-agri-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('analyzer.readyForAnalysis')}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => handleChooseGalleryClick()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('analyzer.changeImage')}</span>
            </button>

            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-bold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t('analyzer.removeImage')}</span>
            </button>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm p-3 rounded-xl">
          {errorMessage}
        </div>
      )}
    </div>
  );
};
