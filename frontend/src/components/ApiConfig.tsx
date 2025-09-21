interface ApiConfigProps {
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  onTestConnection: () => void;
  isConnecting: boolean;
}

export function ApiConfig({ 
  apiBaseUrl, 
  setApiBaseUrl, 
  onTestConnection, 
  isConnecting 
}: ApiConfigProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-700">⚙️ ตั้งค่า API</span>
        </div>
        <input
          type="text"
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
          placeholder="https://xxxxx.ngrok-free.app"
          className="px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72 text-sm"
        />
        <button
          onClick={onTestConnection}
          disabled={isConnecting || !apiBaseUrl}
          className="px-4 py-2.5 text-sm font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConnecting ? '🔄 ทดสอบ...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
