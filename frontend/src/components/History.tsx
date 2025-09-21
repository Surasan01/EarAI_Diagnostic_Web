import type { AnalysisResult } from "../types";

interface HistoryProps {
  results: AnalysisResult[];
}

export function History({ results }: HistoryProps) {
  if (results.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <div className="text-center py-8">
          <div className="text-6xl mb-4 opacity-50">📋</div>
          <p className="text-slate-500">ยังไม่มีประวัติการวิเคราะห์</p>
        </div>
      </div>
    );
  }

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Normal': return 'bg-emerald-100 text-emerald-800';
      case 'Abnormal': return 'bg-red-100 text-red-800';
      case 'Cannot Dx': return 'bg-amber-100 text-amber-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60">
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            📋
          </div>
          <div>
            <h3 className="font-semibold text-slate-700">ประวัติการวิเคราะห์</h3>
            <p className="text-sm text-slate-500">{results.length} รายการ</p>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-slate-200/60 max-h-96 overflow-y-auto">
        {results.map((result, index) => (
          <div key={result.timestamp} className="p-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getLabelColor(result.label_main)}`}>
                  {result.label_main}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  result.quality === 'Good' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {result.quality}
                </span>
                {result.forcedDiagnose && (
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700">
                    บังคับ
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-700 font-medium">{result.filename}</p>
              <p className="text-xs text-slate-500">
                {new Date(result.timestamp).toLocaleString('th-TH')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
