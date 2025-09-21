import { useState, useRef, useCallback } from "react";
import type { Settings } from "../types";

interface ImageUploadProps {
  onAnalyze: (file: File) => void;
  isUploading: boolean;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  hasResults: boolean;
}

export function ImageUpload({ 
  onAnalyze, 
  isUploading, 
  settings, 
  onSettingsChange,
  hasResults
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      alert('กรุณาเลือกไฟล์รูปภาพ (jpg, jpeg, png, bmp, tiff)');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
          📷
        </div>
        <h2 className="text-xl font-semibold text-slate-800">อัปโหลดรูปภาพรูหู</h2>
      </div>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-blue-400 bg-blue-50/50 scale-[1.02]' 
            : selectedFile 
            ? 'border-emerald-400 bg-emerald-50/50' 
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="space-y-6">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg"
            />
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="font-medium text-slate-700">{selectedFile?.name}</p>
                <p className="text-sm text-slate-500">
                  {selectedFile && (selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={clearFile}
                className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                🗑️ ลบ
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-8xl opacity-60">🖼️</div>
            <div>
              <p className="text-xl font-medium text-slate-700 mb-2">
                ลากไฟล์มาวางที่นี่
              </p>
              <p className="text-slate-500 mb-4">หรือ</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                📁 เลือกไฟล์
              </button>
            </div>
            <p className="text-sm text-slate-500">
              รองรับ: JPG, JPEG, PNG, BMP, TIFF (ขนาดไม่เกิน 10MB)
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.bmp,.tif,.tiff"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Settings */}
      {hasResults && (
        <div className="mt-8 space-y-4">
          <h3 className="font-medium text-slate-700 flex items-center gap-2">
            ⚙️ ตัวเลือก
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoForce}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  autoForce: e.target.checked
                })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-slate-700">วินิจฉัยต่ออัตโนมัติ</span>
                <p className="text-sm text-slate-500">เมื่อผลเป็น Cannot Dx</p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!selectedFile || isUploading}
        className="mt-8 w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            🔍 กำลังวิเคราะห์...
          </div>
        ) : (
          '🚀 เริ่มวิเคราะห์'
        )}
      </button>
    </div>
  );
}
