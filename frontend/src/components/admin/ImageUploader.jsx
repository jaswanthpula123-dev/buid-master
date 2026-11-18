import React, { useState } from 'react';
import { UploadCloud, Plus, X, Image as ImageIcon, Check } from 'lucide-react';
import api from '../../services/api';

const ImageUploader = ({
  images = [],
  coverImage = '',
  onCoverChange,
  onImagesChange,
  title = 'Project / Property Images',
}) => {
  const [directUrl, setDirectUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Handle direct URL addition
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!directUrl.trim()) return;

    const trimmed = directUrl.trim();
    if (!images.includes(trimmed)) {
      const updated = [...images, trimmed];
      onImagesChange(updated);
      if (!coverImage) {
        onCoverChange(trimmed);
      }
    }
    setDirectUrl('');
  };

  // Handle file upload to backend
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      if (files.length === 1) {
        formData.append('image', files[0]);
        const res = await api.post('/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success && res.data.url) {
          const updated = [...images, res.data.url];
          onImagesChange(updated);
          if (!coverImage) onCoverChange(res.data.url);
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
        const res = await api.post('/upload/multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success && res.data.urls) {
          const updated = [...images, ...res.data.urls];
          onImagesChange(updated);
          if (!coverImage && res.data.urls.length > 0) onCoverChange(res.data.urls[0]);
        }
      }
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed. You can paste direct image URLs below.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (imgUrl) => {
    const updated = images.filter((img) => img !== imgUrl);
    onImagesChange(updated);
    if (coverImage === imgUrl) {
      onCoverChange(updated[0] || '');
    }
  };

  return (
    <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-navy-950 flex items-center gap-1.5">
            <ImageIcon size={16} className="text-gold-600" />
            {title}
          </h4>
          <p className="text-xs text-slate-500">
            Upload from computer or paste web image URLs (Unsplash, Cloudinary, etc.)
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-white rounded-full border border-slate-200 text-slate-600">
          {images.length} Image{images.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* File Upload Zone */}
      <div className="relative border-2 border-dashed border-slate-300 hover:border-gold-500 rounded-xl p-4 text-center bg-white transition cursor-pointer">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
          <UploadCloud size={28} className={uploading ? 'text-gold-500 animate-bounce' : 'text-slate-400'} />
          <p className="text-xs font-semibold text-navy-900">
            {uploading ? 'Uploading Images to Storage...' : 'Click to Browse Files or Drag & Drop'}
          </p>
          <p className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 10MB each</p>
        </div>
      </div>

      {uploadError && (
        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
          {uploadError}
        </p>
      )}

      {/* Direct URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={directUrl}
          onChange={(e) => setDirectUrl(e.target.value)}
          placeholder="Or paste direct image URL (e.g. https://images.unsplash.com/...)"
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-gold-500 bg-white"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition"
        >
          <Plus size={14} />
          Add URL
        </button>
      </div>

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
          {images.map((img, idx) => {
            const isCover = coverImage === img;
            return (
              <div
                key={idx}
                className={`relative rounded-xl overflow-hidden aspect-video bg-slate-900 group border-2 ${
                  isCover ? 'border-gold-500 ring-2 ring-gold-400/50' : 'border-slate-200'
                }`}
              >
                <img src={img} alt={`Upload ${idx}`} className="w-full h-full object-cover" />

                {/* Cover badge */}
                {isCover && (
                  <span className="absolute top-1 left-1 bg-gold-500 text-navy-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow">
                    COVER
                  </span>
                )}

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => onCoverChange(img)}
                      title="Set as Cover Image"
                      className="p-1 rounded bg-gold-500 hover:bg-gold-400 text-navy-950 text-[10px] font-bold"
                    >
                      Set Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img)}
                    title="Remove"
                    className="p-1 rounded bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
