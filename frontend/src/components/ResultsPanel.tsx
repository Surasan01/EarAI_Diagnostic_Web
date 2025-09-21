import { useState } from "react";
import type { AnalysisResult } from "../types";

interface ResultsPanelProps {
  result: AnalysisResult;
  onForceAnalyze: (file: File) => void;
}

export function ResultsPanel({ result, onForceAnalyze }: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview');

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Normal': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Abnormal': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cannot Dx': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getQualityColor = (quality: string) => {
    return quality === 'Good' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const ProbabilityBar = ({ 
    label, 
    value, 
    threshold, 
    color = 'blue' 
  }: { 
    label: string; 
    value: number; 
    threshold: number; 
    color?: string; 
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono text-slate-600">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r transition-all duration-500 ${
            color === 'red' ? 'from-red-400 to-red-500' :
            color === 'amber' ? 'from-amber-400 to-amber-500' :
            'from-blue-400 to-blue-500'
          }`}
          style={{ width: `${Math.min(value * 100, 100)}%` }}
        />
        <div 
          className="absolute top-0 w-0.5 h-full bg-slate-700"
          style={{ left: `${Math.min(threshold * 100, 100)}%` }}
        />
      </div>
      <div className="text-xs text-slate-500">
        เกณฑ์: {(threshold * 100).toFixed(1)}%
      </div>
    </div>
  );

  const downloadJson = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis_${result.timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60">
      <div className="p-8 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white">
              📊
            </div>
            <h2 className="text-xl font-semibold text-slate-800">ผลการวิเคราะห์</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={downloadJson}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              💾 ดาวน์โหลด JSON
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className={`px-4 py-2 rounded-xl border font-semibold ${getLabelColor(result.label_main)}`}>
            {result.label_main}
          </div>
          <div className={`px-4 py-2 rounded-xl border font-semibold ${getQualityColor(result.quality)}`}>
            คุณภาพ: {result.quality}
          </div>
          {result.forcedDiagnose && (
            <div className="px-4 py-2 rounded-xl border font-semibold bg-purple-100 text-purple-800 border-purple-200">
              บังคับวินิจฉัย
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">📁 ไฟล์:</span>
            <span>{result.filename}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">🕒 เวลา:</span>
            <span>{new Date(result.timestamp).toLocaleString('th-TH')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">🔀 Routing:</span>
            <span>{result.routing?.reason}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200/60">
        <nav className="flex">
          {[
            { id: 'overview', label: '📈 ภาพรวม', icon: '📈' },
            { id: 'features', label: '🔢 ฟีเจอร์', icon: '🔢' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  📊 คะแนนความน่าจะเป็น
                </h3>
                <ProbabilityBar
                  label="Bad Quality"
                  value={result.probs.p_bad}
                  threshold={result.probs.tau_bad}
                  color="red"
                />
                <ProbabilityBar
                  label="Reject (Cannot Dx)"
                  value={result.probs.p_reject}
                  threshold={result.probs.tau_reject}
                  color="amber"
                />
                {result.probs.p_abnormal !== undefined && (
                  <ProbabilityBar
                    label="Abnormal"
                    value={result.probs.p_abnormal}
                    threshold={result.probs.tau_abnormal || 0}
                    color="red"
                  />
                )}
              </div>

              <div className="space-y-6">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  🖼️ ข้อมูลภาพ
                </h3>
                <div className="bg-slate-50/50 rounded-xl p-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">ขนาดต้นฉบับ:</span>
                    <span className="font-mono">{result.meta.orig_w} × {result.meta.orig_h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ขนาดใหม่:</span>
                    <span className="font-mono">{result.meta.new_w} × {result.meta.new_h}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Scale:</span>
                    <span className="font-mono">{result.meta.scale.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Padding:</span>
                    <span className="font-mono">T{result.meta.pad_top} R{result.meta.pad_right} B{result.meta.pad_bottom} L{result.meta.pad_left}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && result.features && (
          <div className="space-y-6">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              🔢 ฟีเจอร์ IQA (7 ตัว)
            </h3>
            <div className="bg-slate-50/50 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-100/50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">Feature</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Raw Value</th>
                    <th className="text-right py-4 px-6 font-semibold text-slate-700">Z-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {result.features.names.map((name, index) => (
                    <tr key={name} className="hover:bg-white/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-700">{name}</td>
                      <td className="py-4 px-6 text-right font-mono text-slate-600">
                        {result.features!.raw[index].toFixed(6)}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-600">
                        {result.features!.zscore[index].toFixed(3)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
