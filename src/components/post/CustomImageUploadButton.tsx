"use client";
import React, { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomImageUploadButtonProps {
  onSelect: (file: File | null) => void;
  previewUrl?: string | null;
  disabled?: boolean;
}

export default function CustomImageUploadButton({ onSelect, previewUrl, disabled }: CustomImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (disabled) return;
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) { onSelect(null); return; }
    setLoading(true);
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onSelect(file);
    // simulate slight delay feel
    setTimeout(() => setLoading(false), 250);
  }

  function clearImage() {
    setLocalPreview(null);
    onSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="relative flex items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      {localPreview ? (
        <div className="relative group">
          <img src={localPreview} alt="preview" className="h-14 w-14 rounded-md object-cover ring-2 ring-emerald-600" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={handleClick}
          disabled={disabled}
          className="flex items-center gap-2 bg-slate-900 border-slate-600 hover:bg-slate-800 text-slate-100"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          <span>Resim Ekle</span>
        </Button>
      )}
    </div>
  );
}
