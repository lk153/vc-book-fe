import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, X } from 'lucide-react';

/**
 * Modal component for previewing images with zoom controls
 * @param {Object} props
 * @param {string} props.imageUrl - URL of the image to preview
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.t - Translation function
 */
export function ImagePreviewModal({ imageUrl, onClose, t }) {
  const [scale, setScale] = useState(1);
  const minScale = 0.5;
  const maxScale = 3;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, maxScale));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, minScale));
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomOut();
          }}
          disabled={scale <= minScale}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('admin.books.zoomOut')}
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-white font-medium min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoomIn();
          }}
          disabled={scale >= maxScale}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={t('admin.books.zoomIn')}
        >
          <ZoomIn size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white rounded-full hover:bg-gray-100 transition ml-4"
          title={t('admin.common.cancel')}
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="overflow-auto max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        <img
          src={imageUrl}
          alt="Preview"
          style={{ transform: `scale(${scale})`, transition: 'transform 0.2s ease' }}
          className="max-w-none cursor-grab"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm opacity-70">
        {t('admin.books.zoomHint')}
      </div>
    </div>
  );
}
