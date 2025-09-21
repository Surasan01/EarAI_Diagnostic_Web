import type { DebugInfo } from "../types";

interface FooterProps {
  debugInfo: DebugInfo | null;
}

export function Footer({ debugInfo }: FooterProps) {
  if (!debugInfo) {
    return (
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              🦻 EarAI Diagnostic v2.0 - กรุณาทดสอบการเชื่อมต่อเพื่อดูข้อมูลระบบ
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50/50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              🚪 Gate Model
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="font-mono">{debugInfo.gate.timm}</span>
              </div>
              <div className="flex justify-between">
                <span>τ_bad:</span>
                <span className="font-mono">{debugInfo.gate.tau_bad.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span>τ_reject:</span>
                <span className="font-mono">{debugInfo.gate.tau_reject.toFixed(6)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50/50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              🩺 Dx2 Model
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Model:</span>
                <span className="font-mono">{debugInfo.dx2.timm}</span>
              </div>
              <div className="flex justify-between">
                <span>Temperature:</span>
                <span className="font-mono">{debugInfo.dx2.temperature.toFixed(5)}</span>
              </div>
              <div className="flex justify-between">
                <span>τ:</span>
                <span className="font-mono">{debugInfo.dx2.tau.toFixed(6)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50/50 rounded-xl p-6">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
              ⚙️ Input Config
            </h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Letterbox:</span>
                <span className="font-mono">{debugInfo.input.letterbox}px</span>
              </div>
              <div className="flex justify-between">
                <span>Model Input:</span>
                <span className="font-mono">{debugInfo.input.model_input}px</span>
              </div>
              <div className="flex justify-between">
                <span>TTA:</span>
                <span className="font-mono">{debugInfo.dx2.tta_mode}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 pt-6 border-t border-slate-200/60">
          <p className="text-sm text-slate-500">
            🦻 EarAI Diagnostic v2.0 - ระบบวินิจฉัยรูหูด้วยปัญญาประดิษฐ์
          </p>
        </div>
      </div>
    </footer>
  );
}
