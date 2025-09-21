import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { ApiConfig } from "./components/ApiConfig";
import { ImageUpload } from "./components/ImageUpload";
import { ResultsPanel } from "./components/ResultsPanel";
import { History } from "./components/History";
import { Footer } from "./components/Footer";
import type { AnalysisResult, DebugInfo } from "./types";

export default function App() {
  const [apiBaseUrl, setApiBaseUrl] = useState(() => 
    localStorage.getItem('apiBaseUrl') || ''
  );
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [settings, setSettings] = useState({
    autoForce: false
  });

  useEffect(() => {
    localStorage.setItem('apiBaseUrl', apiBaseUrl);
  }, [apiBaseUrl]);

  const testConnection = async () => {
    if (!apiBaseUrl) {
      toast.error('กรุณาใส่ Backend URL');
      return;
    }

    setIsConnecting(true);
    try {
      const [healthRes, debugRes] = await Promise.all([
        fetch(`${apiBaseUrl}/health`),
        fetch(`${apiBaseUrl}/debug`)
      ]);

      if (!healthRes.ok || !debugRes.ok) {
        throw new Error('Connection failed');
      }

      const health = await healthRes.json();
      const debug = await debugRes.json();
      
      setDebugInfo(debug);
      toast.success(`เชื่อมต่อสำเร็จ: ${health.status}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  const analyzeImage = async (file: File, forceDiagnose = false) => {
    if (!apiBaseUrl) {
      toast.error('กรุณาตั้งค่า API URL ก่อน');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('make_gradcam', 'true');
      formData.append('force_diagnose', String(forceDiagnose));

      const response = await fetch(`${apiBaseUrl}/predict`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }

      const analysisResult: AnalysisResult = {
        ...result,
        timestamp: Date.now(),
        filename: file.name,
        apiBaseUrl,
        forcedDiagnose: forceDiagnose
      };

      setResults(prev => [analysisResult, ...prev.slice(0, 9)]);

      // Auto-retry if Cannot Dx and auto-force is enabled
      if (!forceDiagnose && 
          result.routing?.is_cannotdx && 
          settings.autoForce) {
        toast.info('ผลเป็น Cannot Dx - กำลังวินิจฉัยต่ออัตโนมัติ...');
        setTimeout(() => analyzeImage(file, true), 1000);
      }

    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
                🦻
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">EarAI Diagnostic</h1>
                <p className="text-sm text-slate-500">ระบบวินิจฉัยรูหูด้วย AI</p>
              </div>
            </div>
            <ApiConfig
              apiBaseUrl={apiBaseUrl}
              setApiBaseUrl={setApiBaseUrl}
              onTestConnection={testConnection}
              isConnecting={isConnecting}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-8">
            <ImageUpload
              onAnalyze={analyzeImage}
              isUploading={isUploading}
              settings={settings}
              onSettingsChange={setSettings}
              hasResults={results.length > 0}
            />
            
            {results.length > 0 && (
              <ResultsPanel
                result={results[0]}
                onForceAnalyze={(file) => analyzeImage(file, true)}
              />
            )}
          </div>

          <div className="xl:col-span-1 space-y-6">
            {/* History Toggle Button */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    📋
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-slate-700">ประวัติการวิเคราะห์</p>
                    <p className="text-sm text-slate-500">{results.length} รายการ</p>
                  </div>
                </div>
                <div className={`transform transition-transform ${showHistory ? 'rotate-180' : ''}`}>
                  ▼
                </div>
              </button>
            </div>

            {/* History Panel */}
            {showHistory && <History results={results} />}
          </div>
        </div>
      </main>

      <Footer debugInfo={debugInfo} />
      <Toaster position="top-right" />
    </div>
  );
}
